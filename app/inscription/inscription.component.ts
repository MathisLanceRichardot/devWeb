import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importer RouterModule
import { FirebaseService } from '../firebase.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscription',
  imports: [RouterModule, FormsModule],
  templateUrl: './inscription.component.html',
  styleUrls: ['../../assets/styles.css', 'inscription.component.css']
})
export class InscriptionComponent {
  user = {
    name: '',
    mail: '',
    password: '',
    photoURL: '',
    categorie: '',
    date_de_naissance: '',
    sexe: '',
    level: -2,
    points: 0
  };
  erreur: String = '';
  
  constructor(private firebaseService: FirebaseService, private router: Router) {}

  onSubmit_inscription(): void {
    this.firebaseService.addUser(this.user).then((result: String) => {
      this.erreur = '';  // Réinitialise l'erreur
      console.log(result);
      
      // Si l'inscription est réussie, redirige l'utilisateur vers la page de connexion
      this.router.navigate(['/identifier/connexion']);  // Redirection vers la page de connexion (tu peux changer selon ta route)
      
      // Réinitialise le formulaire
      this.user = { 
        name: '', 
        mail: '', 
        password: '', 
        photoURL: '', 
        categorie: '', 
        date_de_naissance: '', 
        sexe: '', 
        level: -2, 
        points: 0 
      };
    }).catch((error) => {
      // Gère les erreurs d'inscription
      this.erreur = `Erreur lors de l'inscription : ${error.message}`;
      console.error(error);
    });
  }
}

