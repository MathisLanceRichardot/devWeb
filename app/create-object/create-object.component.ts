import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../firebase.service';

type Categories = 'Eclairage' | 'Divertissement' | 'Electromenager' | 'Climat' | 'Divers'| 'Securite';
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
  | 'TP-Link'
  | 'Assistant vocal'
  | 'Camera'

interface Attributs {
  connectivite: string;
  connexion: string;
  etat: string;
  consommation: number;
  maxluminosite?: number;
  taille?: number;
  puissanceBluetooth?: number;
  temperature?: number;
  mode?: string;
  debit?: number;
  id?: string;
  volume?:number;
  resolution?:number;
}

@Component({
  selector: 'app-create-object',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-object.component.html',
  styleUrls: ['./create-object.component.css', '../../assets/styles.css'],
})
export class CreateObjectComponent implements OnInit {
  categorie: Categories = 'Eclairage';
  type_objet: ObjetTypes = 'Spot lumineux';
  piece: string = '';

  luminosite: number = 100;
  tailleTelevision: number = 42;
  puissanceBluetooth: number = 10;
  temperatureRefrigerateur: number = 4;
  temperatureThermostat: number = 21;
  debitTpLink: number = 100;
  modeClimatiseur: 'Refroidissement' | 'Chauffage' | 'Ventilation' = 'Refroidissement';
  volumeAssistantVocal: number = 50;  // Volume pour l'assistant vocal
  volumeTelevision: number = 50;  // Volume pour la télévision
  volumeBluetooth: number = 50; // Volume pour l'enceinte Bluetooth
  resolutionCamera: number = 1080;

  objetsDisponibles: string[] = [];

  objetsParCategorie: { [key in Categories]: string[] } = {
    Eclairage: ['Spot lumineux', 'Ampoule intelligente'],
    Divertissement: ['Télévision', 'Enceinte Bluetooth', 'Assistant vocal'], // Ajout de l'Assistant vocal
    Electromenager: ['Réfrigérateur', 'Lave-vaisselle', 'Lave-linge'],
    Climat: ['Thermostat', 'Climatiseur', 'Chauffage intelligent'],
    Divers: ['TP-Link'],
    Securite: ['Camera']
  };
  
  // Mise à jour des attributs des objets pour inclure le volume pour "Enceinte Bluetooth" et "Assistant vocal"
  attributsParObjet: { [key in ObjetTypes]: Attributs } = {
    'Spot lumineux': {
      connectivite: 'Wi-Fi',
      connexion: 'Déconnecté',
      etat: 'Éteint',
      consommation: 8,
      maxluminosite: 150,
    },
    'Ampoule intelligente': {
      connectivite: 'Wi-Fi',
      connexion: 'Déconnecté',
      etat: 'Éteint',
      consommation: 10,
      maxluminosite: 80,
    },
    Télévision: {
      connectivite: 'Wi-Fi',
      connexion: 'Déconnecté',
      etat: 'Éteint',
      consommation: 100,
      taille: 42,
      puissanceBluetooth: 10,
    },
    'Enceinte Bluetooth': {
      connectivite: 'Bluetooth',
      connexion: 'Déconnecté',
      etat: 'Éteint',
      consommation: 5,
      volume: 50, // Ajout du volume
    },
    Réfrigérateur: {
      connectivite: 'Wi-Fi',
      connexion: 'Déconnecté',
      etat: 'Éteint',
      consommation: 150,
      temperature: 4,
    },
    'Lave-vaisselle': {
      connectivite: 'Wi-Fi',
      connexion: 'Déconnecté',
      etat: 'Éteint',
      consommation: 1200,
    },
    'Lave-linge': {
      connectivite: 'Wi-Fi',
      connexion: 'Déconnecté',
      etat: 'Éteint',
      consommation: 500,
    },
    Thermostat: {
      connectivite: 'Wi-Fi',
      connexion: 'Déconnecté',
      etat: 'Éteint',
      consommation: 3,
      temperature: 21,
    },
    Climatiseur: {
      connectivite: 'Wi-Fi',
      connexion: 'Déconnecté',
      etat: 'Éteint',
      consommation: 2000,
      mode: 'Refroidissement',
    },
    'Chauffage intelligent': {
      connectivite: 'Wi-Fi',
      connexion: 'Déconnecté',
      etat: 'Éteint',
      consommation: 800,
    },
    'TP-Link': {
      connectivite: 'Wi-Fi',
      connexion: 'Déconnecté',
      etat: 'Éteint',
      consommation: 10,
      debit: 100,
    },
    'Assistant vocal': { // Définir les attributs de l'Assistant vocal
      connectivite: 'Bluetooth',
      connexion: 'Déconnecté',
      etat: 'Éteint',
      consommation: 10,
      volume: 50, // Ajout du volume
    },
    'Camera': { // Définir les attributs de l'Assistant vocal
      connectivite: 'Wi-Fi',
      connexion: 'Bluetooth',
      etat: 'Éteint',
      consommation: 10,
      resolution: 1080, // Ajout du volume
    },
  };

  piecesDisponibles: string[] = [];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.firebaseService.getPiecesRealtime((pieces) => {
      this.piecesDisponibles = pieces.map(p => p.nom);
    });
  }

  updateObjets() {
    this.objetsDisponibles = this.objetsParCategorie[this.categorie] || [];
    this.type_objet = this.objetsDisponibles[0] as ObjetTypes;
  }

  async ajouterObjetDansPiece() {
    if (!this.type_objet || !this.piece) return;
  
    const objetChoisi = { ...this.attributsParObjet[this.type_objet] };
  
    // Ajout des attributs spécifiques
    if (this.categorie === 'Eclairage') {
      objetChoisi.maxluminosite = this.luminosite;
    }
    if (this.type_objet === 'Télévision') {
      objetChoisi.volume = this.volumeTelevision;
    }
    if (this.type_objet === 'Enceinte Bluetooth') {
      objetChoisi.volume = this.volumeBluetooth;
    }
    if (this.type_objet === 'Camera') {
      objetChoisi.resolution = this.resolutionCamera;
    }
    if (this.type_objet === 'Réfrigérateur') {
      objetChoisi.temperature = this.temperatureRefrigerateur;
    }
    if (this.type_objet === 'Thermostat' || this.type_objet === 'Chauffage intelligent') {
      objetChoisi.temperature = this.temperatureThermostat;
    }
    if (this.type_objet === 'TP-Link') {
      objetChoisi.debit = this.debitTpLink;
    }
    if (this.type_objet === 'Climatiseur') {
      objetChoisi.mode = this.modeClimatiseur;
    }
    if (this.type_objet === 'Assistant vocal') {
      objetChoisi.volume = this.volumeAssistantVocal;
    }
  
    // Crée un identifiant unique pour l'objet (type + pièce)
    const objetId = `${this.type_objet}_${this.piece}`;
  
    // Récupération de l'objet existant depuis Firebase
    const objetExistant = await this.firebaseService.getObjetByIdMaison(objetId);
  
    if (objetExistant) {
      // L'objet existe déjà, ajout d'un numéro de version
      let version = 1;
      while (await this.firebaseService.getObjetByIdMaison(`${objetId}_${version}`)) {
        version++;
      }
      // Ajouter le numéro à l'objet
      objetChoisi['id'] = `${objetId}_${version}`;
    } else {
      // L'objet n'existe pas, pas besoin de version
      objetChoisi['id'] = objetId;
    }
  
    // Ajout des infos générales
    const objetAEnregistrer = {
      type: this.type_objet,
      categorie: this.categorie,
      piece: this.piece,
      ...objetChoisi,
      dateMiseAJour: new Date().toISOString(),  // Ajoute la date de mise à jour
    };
  
    // Enregistrement dans Firebase
    try {
      await this.firebaseService.addObjet(objetAEnregistrer);
      console.log('Objet ajouté dans la pièce et en base :', objetAEnregistrer);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'objet :', error);
    }
  
    // Réinitialisation
    this.categorie="Eclairage";
    this.type_objet = 'Spot lumineux';
    this.luminosite = 100;
    this.tailleTelevision = 42;
    this.puissanceBluetooth = 10;
    this.temperatureRefrigerateur = 4;
    this.temperatureThermostat = 21;
    this.debitTpLink = 100;
    this.modeClimatiseur = 'Refroidissement';
  }
}

