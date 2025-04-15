import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../firebase.service'; // importe ton service
import { FormsModule } from '@angular/forms';

type ObjetTypes =
  | 'Spot lumineux'
  | 'Ampoule intelligente'
  | 'Télévision'
  | 'Enceinte Bluetooth'
  | 'Réfrigérateur'
  | 'Lave-vaisselle'
  | 'Lave-linge'
  | 'Thermostat'
  | 'Climatiseur'
  | 'Chauffage intelligent'
  | 'TP-Link';

interface Attributs {
  connectivite: string;
  connexion: string;
  etat: string;
  consommation: string;
  maxluminosite?: number;
  taille?: number;
  volume?: number;
  temperature?: number;
  mode?: string;
  debit?: number;
  [key: string]: string | number | undefined;
}

@Component({
  selector: 'app-objet-affichage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './objet-affichage.component.html',
  styleUrls: ['./objet-affichage.component.css'],
})
export class ObjetAffichageComponent implements OnInit {
  @Input() objet!: { id: string; type: ObjetTypes; categorie: string; piece: string } & Attributs;

  canEdit = false;
  editMode = false;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.firebaseService.getCurrentUser().subscribe(user => {
      if (user?.level > 1) {
        this.canEdit = true;
      }
    });
  }

  hasAttribute(attr: keyof Attributs): boolean {
    return this.objet[attr] !== undefined && this.objet[attr] !== null;
  }

  toggleEdit(): void {
    this.editMode = !this.editMode;
  }

  saveChanges(): void {
    this.firebaseService.updateObjet(this.objet.id, this.objet); // ← méthode à implémenter
    console.log('caca'+this.objet.id);
    this.editMode = false;
  }

  onEtatChange() {
    if (this.objet.etat === 'Éteint') {
      this.objet.connexion = 'Déconnecté';
    }
  }
}

