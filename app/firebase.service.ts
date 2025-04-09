import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc, getDoc, Timestamp } from 'firebase/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private db = getFirestore();  // Initialisation de Firestore

  private est_connecter = new BehaviorSubject<boolean>(false); // État de connexion
  private userSubject = new BehaviorSubject<any | null>(null); // Données utilisateur

  user$ = this.userSubject.asObservable(); // Observable pour l'utilisateur
  est_connecter$ = this.est_connecter.asObservable(); // Observable pour l'état de connexion

  private lastLoggedInEmail: string | null = null; // Stockage du dernier email connecté

  constructor() {}

  /**
   * Charger l'utilisateur connecté depuis Firestore
   */
  async loadUser() {
    try {
      if (!this.est_connecter.value || !this.lastLoggedInEmail) {
        this.userSubject.next(null);
        return;
      }

      const q = query(collection(this.db, 'user'), where('mail', '==', this.lastLoggedInEmail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        console.log("Utilisateur connecté :", userData);
        this.userSubject.next(userData);
      } else {
        console.log("Utilisateur introuvable");
        this.userSubject.next(null);
      }
    } catch (e) {
      console.error("Erreur lors de la récupération de l'utilisateur :", e);
      this.userSubject.next(null);
    }
  }

// Méthode pour ajouter un événement d'historique
async addHistorique(mail: string, pseudo: string, type: string) {
  try {
    const historiqueRef = collection(this.db, 'historique');
    await addDoc(historiqueRef, {
      mail: mail,
      pseudo: pseudo,
      temps: Timestamp.fromDate(new Date()), // Horodatage de l'action
      type: type,  // Type de l'action (connexion, déconnexion, etc.)
    });
    console.log("Historique ajouté avec succès");
  } catch (e) {
    console.error("Erreur lors de l'ajout de l'historique :", e);
  }
}

  /**
   * Récupérer l'utilisateur en tant qu'Observable
   */
  getCurrentUser() {
    return this.user$;
  }
  /**
   * Augmenter le niveau de l'utilisateur de 1
   * @param id - L'ID de l'utilisateur
   * @returns Promise<void>
   */
  async addLevel(mail: string): Promise<void> {
    if (!mail) {
      console.error("Erreur : l'email fourni est invalide");
      return;
    }
    try {
      const q = query(collection(this.db, 'user'), where('mail', '==', mail));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDocRef = querySnapshot.docs[0].ref;
        const userData = querySnapshot.docs[0].data();
        const currentLevel = userData['level'] !== undefined ? userData['level'] : 0;
        await updateDoc(userDocRef, { level: currentLevel + 1 });
        console.log(`Niveau de l'utilisateur ${mail} augmenté de 1`);
      } else {
        console.log(`Utilisateur avec l'email ${mail} non trouvé`);
      }
    } catch (e) {
      console.error("Erreur lors de l'augmentation du niveau de l'utilisateur :", e);
    }
  }
  /**
   * Ajouter un utilisateur dans Firestore
   * @param user - Informations de l'utilisateur à ajouter
   */
  async addUser(user: any): Promise<String> {
    try {
      if (!user.mail || !user.password || !user.date_de_naissance || !user.name || !user.sexe || !user.categorie) {
        return "Tous les champs doivent être remplis";
      }
      if (!user.mail.endsWith('@gmail.com')) {
        return "L'email doit se terminer par @gmail.com";
      }
      if (user.password.length < 4 || user.password.length > 16) {
        return "Le mot de passe doit comporter entre 4 et 16 caractères";
      }
      if (user.name.length > 16) {
        return "Le nom ne doit pas dépasser 16 caractères";
      }
      const sqlInjectionPattern = /['";\-]/;
      if (sqlInjectionPattern.test(user.mail) || sqlInjectionPattern.test(user.password) || sqlInjectionPattern.test(user.name)) {
        return "Les champs ne doivent pas contenir de caractères spéciaux";
      }
      const q = query(collection(this.db, 'user'), where('mail', '==', user.mail));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return `L'email ${user.mail} existe déjà dans la base de données`;
      }
      const birthDate = new Date(user.date_de_naissance);
      const today = new Date();
      if (birthDate >= today) {
        return "La date de naissance doit être antérieure à aujourd'hui";
      }
      const docRef = await addDoc(collection(this.db, "user"), user);
      return `${user.name} fait son entrée !😀`;
    } catch (e) {
      console.error("Erreur d'ajout de l'utilisateur : ", e);
      return "Erreur d'ajout de l'utilisateur";
    }
  }
  /**
   * Authentifier un utilisateur en vérifiant le mail et le mot de passe
   * @param mail - Email de l'utilisateur
   * @param password - Mot de passe de l'utilisateur
   * @returns boolean - True si la connexion réussit, False sinon
   */
  async authenticateUser(mailOrPseudo: string, password: string): Promise<boolean> {
    try {
      // Cherche par mail ou pseudo
      const q = query(
        collection(this.db, 'user'),
        where('mail', '==', mailOrPseudo),
        where('password', '==', password)
      );
  
      // Si le mail ne correspond pas, essayer avec pseudo
      let querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        const qPseudo = query(
          collection(this.db, 'user'),
          where('name', '==', mailOrPseudo),
          where('password', '==', password)
        );
        querySnapshot = await getDocs(qPseudo);
      }
  
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        const userMail = userData['mail'];
        const userPseudo = userData['name'];
        await this.addHistorique(userMail, userPseudo, 'connexion');
        await updateDoc(querySnapshot.docs[0].ref, { points: (userData['points'] || 0) + 1 });
        this.est_connecter.next(true);
        this.lastLoggedInEmail = mailOrPseudo;
        this.loadUser();
        return true;
      }
      return false;
    } catch (e) {
      console.error('Erreur d\'authentification :', e);
      return false;
    }
  }
  
  
  
  

  /**
   * Mettre à jour la photo de profil de l'utilisateur
   * @param userId - L'ID de l'utilisateur
   * @param photoURL - L'URL de la nouvelle photo de profil
   * @returns Promise<void>
   */
  async updateProfilePhoto(userId: string, photoURL: string): Promise<void> {
    const userDocRef = doc(this.db, 'user', userId);
    await updateDoc(userDocRef, { photoURL: photoURL });
  }

  /**
   * Mettre à jour les informations de l'utilisateur
   * @param updatedUser - Les nouvelles informations de l'utilisateur
   * @returns Promise<void>
   */
  async updateUser(updatedUser: any): Promise<string> {
    try {
      if (!updatedUser.mail || !updatedUser.password || !updatedUser.date_de_naissance || !updatedUser.name || !updatedUser.sexe || !updatedUser.categorie) {
        return "Tous les champs doivent être remplis";
      }
      if (!updatedUser.mail.endsWith('@gmail.com')) {
        return "L'email doit se terminer par @gmail.com";
      }
      if (updatedUser.mail.length > 16) {
        return "L'email ne doit pas dépasser 16 caractères";
      }
      if (updatedUser.password.length < 4 || updatedUser.password.length > 16) {
        return "Le mot de passe doit comporter entre 4 et 16 caractères";
      }
      if (updatedUser.name.length > 16) {
        return "Le nom ne doit pas dépasser 16 caractères";
      }
      const sqlInjectionPattern = /['";\-]/;
      if (sqlInjectionPattern.test(updatedUser.mail) || sqlInjectionPattern.test(updatedUser.password) || sqlInjectionPattern.test(updatedUser.name)) {
        return "Les champs ne doivent pas contenir de caractères spéciaux";
      }
      const birthDate = new Date(updatedUser.date_de_naissance);
      const today = new Date();
      if (birthDate >= today) {
        return "La date de naissance doit être antérieure à aujourd'hui";
      }
      const q = query(collection(this.db, 'user'), where('mail', '==', updatedUser.mail));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return "Utilisateur non trouvé";
      }
      const userDocRef = querySnapshot.docs[0].ref;
      await updateDoc(userDocRef, updatedUser);
      return "Utilisateur mis à jour avec succès";
    } catch (e) {
      console.error("Erreur de mise à jour de l'utilisateur : ", e);
      return "Erreur de mise à jour de l'utilisateur";
    }
  }

  /**
   * Déconnecter l'utilisateur
   */
  deconnexion(): void {
    if (this.lastLoggedInEmail) {
      // Récupérer les informations de l'utilisateur avant la déconnexion
      const userMail = this.lastLoggedInEmail;
      const userPseudo = this.userSubject.value?.['name'] || '';  // Utiliser la notation avec crochets
  
      // Ajouter l'historique de déconnexion
      this.addHistorique(userMail, userPseudo, 'déconnexion');
    }
  
    this.est_connecter.next(false);
    this.userSubject.next(null);
    this.lastLoggedInEmail = null;
    console.log("Utilisateur déconnecté");
  }

  /**
   * Récupérer l'ID de l'utilisateur connecté en utilisant son email
   * @returns Promise<string | null> - L'ID de l'utilisateur ou null si non trouvé
   */
  async getCurrentUserID(): Promise<string | null> {
    if (!this.lastLoggedInEmail) {
      console.log("Aucun email d'utilisateur connecté trouvé");
      return null;
    }

    const q = query(collection(this.db, 'user'), where('mail', '==', this.lastLoggedInEmail));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userId = querySnapshot.docs[0].id;
      console.log("ID de l'utilisateur connecté :", userId);
      return userId;
    } else {
      console.log("Utilisateur non trouvé avec l'email :", this.lastLoggedInEmail);
      return null;
    }
  }
  async deleteUser(): Promise<void> {
    const userId = await this.getCurrentUserID();
    if (!userId) {
      console.log("Impossible de supprimer l'utilisateur car l'ID est introuvable");
      return;
    }
    const userDocRef = doc(this.db, 'user', userId);
    await deleteDoc(userDocRef);
    this.deconnexion(); // Déconnecter l'utilisateur après suppression
    console.log("Utilisateur supprimé avec succès");
  }

  /**
   * Récupérer les utilisateurs avec un niveau inférieur ou égal à 2
   * @returns Promise<any[]>
   */
  async getUsersWithLevelLessThanOrEqualTo(level: number): Promise<any[]> {
    const q = query(collection(this.db, 'user'), where('level', '<=', level));
    const querySnapshot = await getDocs(q);
    const users = querySnapshot.docs.map(doc => doc.data());
    return users;
  }

  /**
   * Récupérer un utilisateur par son email
   * @param mail - Email de l'utilisateur
   * @returns Observable<any>
   */
  getUserByMail(mail: string): Observable<any> {
    const q = query(collection(this.db, 'user'), where('mail', '==', mail));
    return new Observable(observer => {
      getDocs(q).then(querySnapshot => {
        if (!querySnapshot.empty) {
          observer.next(querySnapshot.docs[0].data());
        } else {
          observer.next(null);
        }
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }
}
