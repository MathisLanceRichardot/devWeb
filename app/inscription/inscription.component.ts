import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importer RouterModule
import { FirebaseService } from '../firebase.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";
import { MainBannerComponent } from "../main-banner/main-banner.component";


@Component({
  selector: 'app-inscription',
  imports: [RouterModule, FormsModule, PiedDePageComponent, MainBannerComponent],
  templateUrl: './inscription.component.html',
  styleUrls: ['../../assets/styles.css', 'inscription.component.css']
})
export class InscriptionComponent {
  user = {
    name: '',
    mail: '',
    prenom:'',
    nom:'',
    password: '',
    photoURL: '',
    categorie: '',
    date_de_naissance: '',
    sexe: '',
    level: -1,
    points: 0
  };

  erreur: string = '';

  constructor(private firebaseService: FirebaseService, private router: Router) {}

  onSubmit_inscription(): void {
    this.firebaseService.addUser(this.user).then((result: string) => {
      this.erreur = '';  // Réinitialise l'erreur
      console.log(result);
      
      // Vérification de l'email avant envoi
      if (!this.user.mail) {
        console.error("L'email est vide ou incorrect !");
        return; // Ne pas envoyer l'email si l'email est vide
      }
  
      this.firebaseService.envoyer_mail(this.user.mail);
  
      // Réinitialiser le formulaire et rediriger l'utilisateur vers la page de connexion
      this.router.navigate(['/identifier/connexion']);
      
      // Réinitialiser l'objet utilisateur
      this.user = {
        name: '',
        prenom:'',
        nom:'',
        mail: '',
        password: '',
        photoURL: '',
        categorie: '',
        date_de_naissance: '',
        sexe: '',
        level: -1,
        points: 0
      };
  
    }).catch((error) => {
      // Gérer les erreurs d'inscription
      this.erreur = `Erreur lors de l'inscription : ${error.message}`;
      console.error(error);
    });
  }
}