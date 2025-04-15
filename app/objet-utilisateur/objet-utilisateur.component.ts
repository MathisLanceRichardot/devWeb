import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { CommonModule } from '@angular/common';
import { ObjetAffichageComponent } from '../objet-affichage/objet-affichage.component';

@Component({
  selector: 'app-objet-utilisateur',
  imports:[ObjetAffichageComponent,CommonModule],
  templateUrl: './objet-utilisateur.component.html',
  styleUrls: ['./objet-utilisateur.component.css'],
})
export class ObjetUtilisateurComponent implements OnInit {
  piecesDisponibles: string[] = [];  // Tableau pour stocker les pièces
  objets: { [piece: string]: any[] } = {};  // Dictionnaire des objets par pièce

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.getPiecesAndObjets();
  }

  getPiecesAndObjets(): void {
    // Récupérer les pièces
    this.firebaseService.getPiecesRealtime2((pieces) => {
      this.piecesDisponibles = pieces;

      // Pour chaque pièce, récupérer les objets associés
      this.piecesDisponibles.forEach((piece) => {
        this.objets[piece] = [];  // Initialiser un tableau vide pour chaque pièce

        // Récupérer les objets associés à cette pièce
        this.firebaseService.getObjetsRealtime((objets) => {
          // Filtrer les objets associés à la pièce en cours
          this.objets[piece] = objets.filter((objet) => objet.piece === piece);
        });
      });
    });
  }
}
