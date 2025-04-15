import { Component, OnInit } from '@angular/core';import { MainBannerComponent } from "../main-banner/main-banner.component";
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../firebase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attente-confirmation-mail',
  imports: [MainBannerComponent, PiedDePageComponent,CommonModule],
  templateUrl: './attente-confirmation-mail.component.html',
  styleUrls: ['./attente-confirmation-mail.component.css', '../../assets/styles.css']
})
export class AttenteConfirmationMailComponent implements OnInit {

  token: string | null = null;
  message: string = '';
  loading: boolean = false;

  constructor(private route: ActivatedRoute, private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  confirmerInscription(): void {
    if (!this.token) {
      this.message = 'Aucun token trouvé.';
      return;
    }

    this.loading = true;
    this.firebaseService.validateToken(this.token)
      .then(() => {
        this.message = '✅ Email validé avec succès ! Vous pouvez maintenant vous connecter.';
      })
      .catch(() => {
        this.message = '❌ Erreur de validation du token. Veuillez réessayer.';
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
