import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule,  Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-barre-recherche',
  standalone: true,
  templateUrl: './barre-recherche.component.html',
  styleUrls: ['./barre-recherche.component.css'],
  imports: [FormsModule, RouterModule, CommonModule,]
})
export class BarreRechercheComponent implements OnInit {
  searchQuery: string = '';
  selectedCategory: string = '';
  selectedSexe: string = '';
  isSocialMode: boolean = false;

  categories1 = [
    { Nom: 'Domotique' },
    { Nom: 'Securité' },
    { Nom: 'Lumière' },
    { Nom: 'Energie' },
    { Nom: 'Confort' }
  ];

  categories2 = [
    { Nom: 'enfant' },
    { Nom: 'parent' },
    { Nom: 'grand-parent' },
    { Nom: 'invite' }
  ];
  
  sexes = [
    { sexe: 'autre' },
    { sexe: 'femme' },
    { sexe: 'homme' }
  ];

    constructor(
      private router: Router, 
      private route: ActivatedRoute  // Injection de ActivatedRoute
    ) {}

  @Output() searchEvent = new EventEmitter<{ searchQuery: string, selectedCategories: string[], selectedSexes : string[] }>();

  ngOnInit() : void{
    this.route.url.subscribe(urlSegments => {
      // Si l'URL contient 'social', on est en mode "social"
      this.isSocialMode = urlSegments.some(segment => segment.path === 'social');
    });
  }

  onCategoryChange(): void {
    // Réinitialiser la recherche si on choisit "Toutes les catégories"
    if (this.selectedCategory === '') {
      this.searchQuery = '';  // <- Réinitialisation du champ de recherche
    }
  
    this.emitSearchEvent(); // Émettre l'événement mis à jour
  }

  onSexeChange(): void {
    // Réinitialiser la recherche si on choisit "Toutes les catégories"
    if (this.selectedSexe === '') {
      this.searchQuery = '';  // <- Réinitialisation du champ de recherche
    }
  
    this.emitSearchEvent(); // Émettre l'événement mis à jour
  }

  onSearchButtonClick(): void {
    this.emitSearchEvent();
  }

  private emitSearchEvent(): void {
    this.searchEvent.emit({
      searchQuery: this.searchQuery,
      selectedCategories: this.selectedCategory === '' ? [] : [this.selectedCategory],
      selectedSexes: this.selectedSexe === '' ? [] : [this.selectedSexe]
    });
  }

}


