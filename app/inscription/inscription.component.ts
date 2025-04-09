import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importer RouterModule
import { FirebaseService } from '../firebase.service';
import { FormsModule } from '@angular/forms';
import { MainBannerComponent } from "../main-banner/main-banner.component";
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";
import { ConnexionComponent } from "../connexion/connexion.component";  // Ajouter cet import
@Component({
  selector: 'app-inscription',
  imports: [RouterModule, FormsModule, MainBannerComponent, PiedDePageComponent, ConnexionComponent],
  templateUrl: './inscription.component.html',
  styleUrls: ['../../assets/styles.css', 'inscription.component.css']
})
export class InscriptionComponent {
  user= {
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
  erreur: String='';
  constructor(private firebaseService: FirebaseService){}
  onSubmit_inscription(): void{
    this.firebaseService.addUser(this.user).then((result: String) => {
      this.erreur = result;
      this.user = { name: '', mail: '', password: '', photoURL: '', categorie: '', date_de_naissance: '', sexe: '', level: -2, points: 0 };
      //level -2 = utilisateur pas encore vérifié par l'admin
      //level -1 = utilisateur en attente de validation du mail
      //level 0 = utilisateur débutant
      //level 1 = utilisateur intermédiaire
      //level 2 = utilisateur avancé
      //level 3 = utilisateur expert
      //Voici les niveaux : débutant, intermédiaire, avancé et
      //expert. Un utilisateur simple
    });
  }
}
