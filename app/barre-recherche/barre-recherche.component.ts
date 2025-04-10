import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { FirebaseService } from '../firebase.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-barre-recherche',
  standalone: true,  
  templateUrl: './barre-recherche.component.html',
  styleUrls: ['./barre-recherche.component.css'],
  imports: [FormsModule, RouterModule, CommonModule] 
})

export class BarreRechercheComponent {
  searchQuery: string = '';  // Texte de recherche
  selectedCategories: string[] = [];  // Catégories sélectionnées
  categories = [
    { Nom: 'Domotique' },
    { Nom: 'Sécurité' },
    { Nom: 'Lumière' },
    { Nom: 'Energie' },
    { Nom: 'Confort' }
  ];

  filtersVisible: boolean = false;  // Contrôle la visibilité des filtres

  @Output() searchEvent = new EventEmitter<{ searchQuery: string, selectedCategories: string[] }>();

  constructor(private firebaseService: FirebaseService) {}

  // Méthode pour gérer les changements de sélection des catégories (filtrage en temps réel)
  onCategoryChange(event: any): void {
    const category = event.target.value;

    if (event.target.checked) {
      this.selectedCategories.push(category);
    } else {
      const index = this.selectedCategories.indexOf(category);
      if (index > -1) {
        this.selectedCategories.splice(index, 1);
      }
    }

    this.emitSearchEvent(); // Émettre l'événement au changement de catégorie
  }

  // Méthode pour émettre l'événement de recherche uniquement au clic du bouton
  onSearchButtonClick(): void {
    this.emitSearchEvent();  // Émettre l'événement quand le bouton de recherche est cliqué
  }

  // Méthode privée pour émettre l'événement de recherche
  private emitSearchEvent(): void {
    this.searchEvent.emit({
      searchQuery: this.searchQuery,
      selectedCategories: this.selectedCategories
    });
  }

  // Méthode pour basculer l'affichage des filtres
  toggleFilters(): void {
    this.filtersVisible = !this.filtersVisible;
  }
}
