import { Component, OnInit } from '@angular/core';
import { MainBannerComponent } from "../main-banner/main-banner.component";
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";
import { FirebaseService } from '../firebase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProfilComponent } from '../profil/profil.component';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mon-profil',
  imports: [MainBannerComponent, PiedDePageComponent, FormsModule,ProfilComponent,CommonModule],
  templateUrl: './mon-profil.component.html',
  styleUrls: ['../../assets/styles.css', 'mon-profil.component.css']
})
export class MonProfilComponent implements OnInit {

  userData$: Observable<any> | null = null; // Déclare un observable pour les données utilisateur

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    // Au lieu de souscrire manuellement, on définit userData$ comme un observable
    this.userData$ = this.firebaseService.getCurrentUser(); // Associe l'observable à la propriété
  }
}
