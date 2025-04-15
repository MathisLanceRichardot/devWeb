import { Component} from '@angular/core';
import {Router, RouterModule } from '@angular/router';
import { FirebaseService } from '../firebase.service';
import { FormsModule } from '@angular/forms';
import { CommonModule} from '@angular/common';
import { MainBannerComponent } from "../main-banner/main-banner.component";
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";


@Component({
  selector: 'app-connexion',
  imports: [RouterModule, FormsModule, CommonModule, MainBannerComponent, PiedDePageComponent],
  templateUrl: './connexion.component.html',
  styleUrls: ['../../assets/styles.css', './connexion.component.css']
})
export class ConnexionComponent {
  user = {
    identifier: '',  // email ou pseudo
    password: ''
  };
  showPassword: boolean = false;
  errorMessage: string | null = null;
  est_connecter: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  constructor(private firebaseService: FirebaseService, private router: Router) {}

  async onSubmit_connexion(): Promise<void> {
    if (this.user.identifier && this.user.password) {
      console.log('Tentative de connexion avec les informations suivantes :');
      console.log('Identifiant:', this.user.identifier);
      console.log('Mot de passe:', this.user.password);

      // Appeler FirebaseService pour authentifier l'utilisateur
      const isAuthenticated = await this.firebaseService.authenticateUser(this.user.identifier, this.user.password);

      if (isAuthenticated) {
        console.log('Connexion réussie');
        this.router.navigate(['/social']);
        this.est_connecter=true;
      } else {
        console.error('Identifiants incorrects');
        this.errorMessage = 'Identifiant ou mot de passe incorrect';
      }
    } else {
      console.error('Veuillez remplir tous les champs');
      this.errorMessage = 'Veuillez remplir tous les champs.';
    }
  }
}
