import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Router } from '@angular/router';
import { MainBannerComponent } from "../main-banner/main-banner.component";
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";
import { ModifPhotoComponent } from '../modif-photo/modif-photo.component';  // Assure-toi de l'importer
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-profile',
  imports: [CommonModule, MainBannerComponent, PiedDePageComponent, ModifPhotoComponent],  // Assure-toi d'importer ModifPhotoComponent ici
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {
  userData: any = null;
  isEditingPhoto: boolean = false;

  constructor(private firebaseService: FirebaseService, private router: Router) {}

  ngOnInit(): void {
    // Récupère les données de l'utilisateur via le service Firebase
    this.firebaseService.user$.subscribe(user => {
      if (user) {
        this.userData = user;
      }
    });
  }

  // Méthode pour activer/désactiver l'éditeur de photo
  toggleEditPhoto() {
    this.isEditingPhoto = !this.isEditingPhoto;
  }

  // Met à jour la photo de profil localement et ferme l'éditeur
  updatePhoto(newPhoto: string) {
    if (this.userData && newPhoto) {
      // Met à jour l'image de l'utilisateur localement
      this.userData.Image = newPhoto;

      // Ferme l'éditeur de photo
      this.isEditingPhoto = false;

      // Met à jour la photo dans Firebase
      this.firebaseService.updateProfilePhoto(this.userData.id, newPhoto).then(() => {
        console.log('Photo de profil mise à jour sur le serveur');
      }).catch((error) => {
        console.error('Erreur lors de la mise à jour de la photo de profil :', error);
      });
    }
  }

  editProfil() {
    if (this.userData) {
      // Logique pour modifier le profil de l'utilisateur
      const updatedUser = { ...this.userData, name: 'New Name' }; // Exemple de changement de nom
      this.firebaseService.updateUser(updatedUser).then(message => {
        console.log(message);
      });
    }
  }

  deleteUser() {
    if (confirm("Êtes-vous sûr de vouloir supprimer votre profil ?")) {
      this.firebaseService.deleteUser().then(() => {
        this.router.navigate(['/home']);
      });
    }
  }

  increaseLevel() {
    if (this.userData) {
      if(this.userData.level<-1){
      this.firebaseService.addLevel(this.userData.mail).then(() => {
        this.userData.level += 1;
      }).catch((error) => console.error('Erreur lors de l\'augmentation du niveau', error));
    }
  }
}
}
