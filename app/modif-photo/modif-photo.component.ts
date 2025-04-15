import { Component,Input,Output, EventEmitter } from '@angular/core';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-modif-photo',
  templateUrl: './modif-photo.component.html',
  styleUrls: ['./modif-photo.component.css']
})
export class ModifPhotoComponent {
  @Input() userData: any;  // Reçoit les données de l'utilisateur
  @Output() photoUpdated = new EventEmitter<string>();  // Émet un événement de mise à jour de la photo

  constructor(private firebaseService: FirebaseService) {}

  selectPhoto(adresse: string): void {
    console.log('Photo sélectionnée :', this.userData);

    // Récupère l'ID de l'utilisateur et met à jour la photo
    this.firebaseService.getCurrentUserID().then((userId) => {
      if (userId) {
        this.firebaseService.updateProfilePhoto(userId, adresse).then(() => {
          console.log('Photo de profil mise à jour sur le serveur');
          
          // Émet l'événement avec la nouvelle photo pour que le parent mette à jour l'image
          this.photoUpdated.emit(adresse);

          // Recharge les données utilisateur
          this.firebaseService.loadUser();
        }).catch((error) => {
          console.error('Erreur lors de la mise à jour de la photo de profil :', error);
        });
      }
    }).catch((error) => {
      console.error('Erreur lors de la récupération de l\'ID de l\'utilisateur :', error);
    });
  }
}

