import { Component } from '@angular/core';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-modif-photo',
  templateUrl: './modif-photo.component.html',
  styleUrls: ['./modif-photo.component.css']
})
export class ModifPhotoComponent {
  constructor(private firebaseservice: FirebaseService) {}
  selectPhoto(adresse: string): void {
    console.log('Photo sélectionnée :', adresse);
    this.firebaseservice.getCurrentUserID().then((userId) => {
      if (userId) {
        this.firebaseservice.updateProfilePhoto(userId, adresse).then(() => {
          console.log('Photo de profil mise à jour sur le serveur');
          this.firebaseservice.loadUser();
        }).catch((error) => {
          console.error('Erreur lors de la mise à jour de la photo de profil :', error);
        });
      }
    }).catch((error) => {
      console.error('Erreur lors de la récupération de l\'ID de l\'utilisateur :', error);
    });
  }
}
