import { Injectable } from '@angular/core';
import { getFirestore, collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc, getDoc, Timestamp } from 'firebase/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import emailjs from 'emailjs-com';
import { v4 as uuidv4 } from 'uuid';



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
   // Service d'authentification
   async authenticateUser(mailOrPseudo: string, password: string): Promise<boolean> {
    try {
      const q = query(
        collection(this.db, 'user'),
        where('mail', '==', mailOrPseudo),
        where('password', '==', password)
      );
  
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

  // Service utilisateur
  async loadUser() {
    if (!this.est_connecter.value || !this.lastLoggedInEmail) {
      this.userSubject.next(null);
      return;
    }

    const q = query(collection(this.db, 'user'), where('mail', '==', this.lastLoggedInEmail));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      this.userSubject.next(userData);
    } else {
      this.userSubject.next(null);
    }
  }

  async updateProfilePhoto(userId: string, photoURL: string): Promise<void> {
    const userDocRef = doc(this.db, 'user', userId);
    await updateDoc(userDocRef, { photoURL: photoURL });
  }

  async addLevel(mail: string): Promise<void> {
    try {
      const q = query(collection(this.db, 'user'), where('mail', '==', mail));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDocRef = querySnapshot.docs[0].ref;
        const userData = querySnapshot.docs[0].data();
        const currentLevel = userData['level'] !== undefined ? userData['level'] : 0;
        await updateDoc(userDocRef, { level: currentLevel + 1 });
      } else {
        console.log(`Utilisateur avec l'email ${mail} non trouvé`);
      }
    } catch (e) {
      console.error("Erreur lors de l'augmentation du niveau de l'utilisateur :", e);
    }
  }

  async addHistorique(mail: string, pseudo: string, type: string) {
    try {
      const historiqueRef = collection(this.db, 'historique');
      await addDoc(historiqueRef, {
        mail: mail,
        pseudo: pseudo,
        temps: Timestamp.fromDate(new Date()),
        type: type,
      });
    } catch (e) {
      console.error("Erreur lors de l'ajout de l'historique :", e);
    }
  }

  // Déconnexion
  deconnexion(): void {
    if (this.lastLoggedInEmail) {
      const userMail = this.lastLoggedInEmail;
      const userPseudo = this.userSubject.value?.['name'] || '';
      this.addHistorique(userMail, userPseudo, 'déconnexion');
    }

    this.est_connecter.next(false);
    this.userSubject.next(null);
    this.lastLoggedInEmail = null;
  }

  // Récupérer l'ID de l'utilisateur
  async getCurrentUserID(): Promise<string | null> {
    if (!this.lastLoggedInEmail) {
      return null;
    }

    const q = query(collection(this.db, 'user'), where('mail', '==', this.lastLoggedInEmail));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userId = querySnapshot.docs[0].id;
      return userId;
    } else {
      return null;
    }
  }

  async deleteUser(): Promise<void> {
    const userId = await this.getCurrentUserID();
    if (!userId) {
      return;
    }
    const userDocRef = doc(this.db, 'user', userId);
    await deleteDoc(userDocRef);
    this.deconnexion();
  }


  /**
   * Récupérer l'utilisateur en tant qu'Observable
   */
  getCurrentUser() {
    return this.user$;
  }
  
  /**
   * Ajouter un utilisateur dans Firestore
   * @param user - Informations de l'utilisateur à ajouter
   */
  async addUser(user: any): Promise<string> {
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
  async storeToken(email: string, token: string) {
    try {
      // Chercher l'utilisateur par email dans la base de données Firestore
      const q = query(collection(this.db, 'user'), where('mail', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDocRef = querySnapshot.docs[0].ref;

        // Ajouter le token dans Firestore sous l'utilisateur
        await updateDoc(userDocRef, {
          token: token,  // Token généré pour l'utilisateur
          tokenUsed: false  // Indiquer que ce token n'est pas encore utilisé
        });

        console.log(`Token pour l'utilisateur ${email} enregistré.`);
      } else {
        console.log(`Utilisateur avec l'email ${email} non trouvé`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du token :', error);
    }
  }
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
envoyer_mail(email: any) {
const token = uuidv4();  // Générer un token unique pour chaque utilisateur
const lien = `http://localhost:4200/increment-level?token=${token}`;  // Créer le lien unique avec le token

// Stocker le token dans Firestore avec une propriété `used` initialisée à false
this.storeToken(email, token);  // Une méthode qui enregistre ce token dans Firestore

emailjs.send("service_p65hfb5", "template_a2t96in", {
    lien: lien,  // Lien contenant le token unique
    mail: email,
}, 'H9gBdFM3Vx43S4MDN')  // Utilise ta clé publique ici
.then((response) => {
    console.log('Email envoyé à :', email, 'réponse : ', response);
})
.catch((error) => {
    console.error('Erreur de l\'envoi du mail à :', email, 'réponse', error);
});
}
  
  getCurrentUserEmail(): string | null {
    return this.lastLoggedInEmail || null;
  }
  // OBJET
  async getObjetById(id: string): Promise<any> {
    try {
      const docRef = doc(this.db, 'objet', id);
      const objetSnap = await getDoc(docRef);
      if (objetSnap.exists()) {
        return { id: objetSnap.id, ...objetSnap.data() };
      } else {
        console.log("Objet introuvable");
        return null;
      }
    } catch (e) {
      console.error("Erreur getObjetById :", e);
      return null;
    }
  }

  async getObjets(searchQuery: string, selectedCategories: string[]): Promise<any[]> {
    try {
      let objetsRef = collection(this.db, 'objet');  // Référence à la collection 'objet'
      
      // Crée une requête conditionnelle en fonction des paramètres de recherche
      let q;
      
      // Si une requête de recherche est fournie, on l'ajoute comme critère
      if (searchQuery && searchQuery !== '') {
        q = query(objetsRef, where('Nom', '>=', searchQuery), where('Nom', '<=', searchQuery + '\uf8ff'));  // Recherche par nom
      } else {
        q = query(objetsRef);  // Si aucun texte n'est donné, on récupère toute la collection
      }
  
      // Si des catégories sont sélectionnées, on ajoute ce critère à la requête
      if (selectedCategories.length > 0) {
        q = query(q, where('Categorie', 'in', selectedCategories));  // Filtrer par catégories
      }
  
      // Exécute la requête et récupère les résultats
      const querySnapshot = await getDocs(q);
      const objets = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return objets;
  
    } catch (e) {
      console.error("Erreur lors de la récupération des objets:", e);
      throw e;
    }
  }


  async loadObjets(searchQuery: string, selectedCategories: string[]): Promise<any[]> {
    return this.getObjets(searchQuery, selectedCategories);
  }
}



