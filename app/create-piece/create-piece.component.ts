import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../firebase.service';
import { getDocs, collection, query, where } from 'firebase/firestore'; // <- à importer si utilisé ici
import { Firestore } from '@angular/fire/firestore'; // <- à injecter

interface Piece {
  id?: string;
  nom: string;
}

@Component({
  selector: 'app-create-piece',
  standalone: true,
  templateUrl: './create-piece.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./create-piece.component.css']
})
export class CreatePieceComponent {
  typesPieces: string[] = ['Cuisine', 'Salon', 'Toilette', 'Chambre', 'Salle de bain'];
  typePiece: string = '';

  constructor(private firebaseService: FirebaseService) {}

  async ajouterPiece() {
    if (!this.typePiece) return;

    const pieces = await this.firebaseService.getPieces();
    const dejaExistantes = pieces.filter(p => p.nom.startsWith(this.typePiece));
    const numero = dejaExistantes.length + 1;
    const nomFinal = `${this.typePiece} ${numero}`;

    const nouvellePiece: Piece = { nom: nomFinal };
    await this.firebaseService.ajouterPiece(nouvellePiece);

    this.typePiece = '';
  }
}

