import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importer RouterModule
import { FirebaseService } from '../firebase.service';
import { CommonModule } from '@angular/common'; // Importer CommonModule
import { Subscription } from 'rxjs';
import { ModifPhotoComponent } from "../modif-photo/modif-photo.component"; // Importer Subscription pour gérer les abonnements

@Component({
  selector: 'app-banner-option',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './banner-option.component.html',
  styleUrls: ['./banner-option.component.css']
})
export class OptionBannerComponent implements OnInit, OnDestroy {
  est_connecter: boolean = false;
  statut: string = '';
  isBannerVisible: boolean = false;
  nom_utilisateur: string = '';
  private subscriptions: Subscription = new Subscription();
  photoURL: string = '../../assets/img/avatars/avatar_default.png';
  showModifPhoto: boolean = false;

  constructor(private firebaseservice: FirebaseService) {}

  ngOnInit() {
    // S'abonner à l'état de connexion
    this.subscriptions.add(
      this.firebaseservice.est_connecter$.subscribe((isConnected) => {
        this.est_connecter = isConnected;
        if (isConnected) {
          this.loadUserInfo();
        }
      })
    );
  }

  loadUserInfo() {
    this.firebaseservice.getCurrentUser().subscribe(user => {
      if (user) {
        this.nom_utilisateur = user.name || 'Utilisateur';
        this.photoURL = user.photoURL || this.photoURL;
      }
    });
  }

  deconnexion() {
    this.firebaseservice.deconnexion();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
