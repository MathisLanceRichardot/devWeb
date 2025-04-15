import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Router, ActivatedRoute } from '@angular/router';  // Import ActivatedRoute
import { MainBannerComponent } from "../main-banner/main-banner.component";
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";
import { ModifPhotoComponent } from '../modif-photo/modif-photo.component';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profil',
  imports: [CommonModule, ModifPhotoComponent,FormsModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css', '../../assets/styles.css']
})
export class ProfilComponent implements OnInit, OnDestroy {
  userData: any = null;
  isEditingPhoto: boolean = false;
  @Input() UserId!: string | null;
  private unsubscribe$ = new Subject<void>();  // Pour gérer l'abonnement aux observables
  isSocialMode: boolean = false;  // Variable pour différencier les vues
  isEditingProfil: boolean = false;
  editableUser: any = {};

  constructor(
    private firebaseService: FirebaseService, 
    private router: Router, 
    private route: ActivatedRoute  // Injection de ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Vérifie les paramètres de l'URL pour déterminer le mode d'affichage
    this.route.url.subscribe(urlSegments => {
      // Si l'URL contient 'social', on est en mode "social"
      this.isSocialMode = urlSegments.some(segment => segment.path === 'social');
    });

    if (this.UserId) {
      // Mode "social": afficher l'utilisateur par ID
      this.firebaseService.getUserById(this.UserId).then(user => {
        this.userData = user;
      }).catch((error) => {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      });
    } else {
      // Mode "profil": afficher l'utilisateur connecté
      this.firebaseService.user$.pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
        if (user) {
          this.userData = user;
        }
      });
    }
  }

  ngOnDestroy(): void {
    // Se désabonner lors de la destruction du composant pour éviter les fuites de mémoire
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  toggleEditPhoto() {
    this.isEditingPhoto = !this.isEditingPhoto;
  }

  updatePhoto(newPhoto: string) {
    if (this.userData && newPhoto) {
      this.userData.Image = newPhoto;
      this.isEditingPhoto = false;
      this.firebaseService.updateProfilePhoto(this.userData.id, newPhoto).then(() => {
        console.log('Photo de profil mise à jour sur le serveur');
      }).catch((error) => {
        console.error('Erreur lors de la mise à jour de la photo de profil :', error);
      });
    }
  }

  editProfil() {
    this.isEditingProfil = true;
    this.editableUser = { ...this.userData }; // On copie les données de l'utilisateur
  }

  cancelEdit() {
    this.isEditingProfil = false;
    this.editableUser = {};
  }

  saveProfil(): void {
    this.firebaseService.updateUser(this.editableUser).then((message: string) => {
      if (message === "Utilisateur mis à jour avec succès") {
        this.firebaseService.loadUser(); // recharge les données utilisateur
        this.isEditingProfil = false;
      }
    });
  }

  deleteUser() {
    if (confirm("Êtes-vous sûr de vouloir supprimer votre profil ?")) {
      this.firebaseService.deleteUser().then(() => {
        this.router.navigate(['/home']);
      });
    }
  }

  increaseLevel() {
    if (this.userData && this.userData.level >0) {
      this.firebaseService.addLevel(this.userData.mail).then(() => {
        this.userData.level -= 1;
      }).catch((error) => console.error('Erreur lors de l\'augmentation du niveau', error));
    }
  }
}


