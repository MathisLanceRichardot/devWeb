import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router'; // Importer RouterModule
import { routes } from '../app.routes';
import { MainBannerComponent } from "../main-banner/main-banner.component";
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";
import { BarreRechercheComponent } from "../barre-recherche/barre-recherche.component";
import { ObjetComponent } from "../objet/objet.component";
import { FirebaseService } from '../firebase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mes-objets',
  imports: [RouterModule,CommonModule, MainBannerComponent, PiedDePageComponent, BarreRechercheComponent,ObjetComponent],
  templateUrl: './mes-objets.component.html',
  styleUrl: './mes-objets.component.css'
})
export class MesObjetsComponent implements OnInit {
  searchQuery: string = '';  // Texte de recherche
  selectedCategories: string[] = [];  // Catégories sélectionnées
  objets: any[] = [];  // Liste des objets récupérés de Firebase

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.loadObjetsMaison();  // Charger les objets au début sans recherche
  }

  // Méthode qui est appelée quand la recherche ou les catégories changent
  async onSearchMaison({ searchQuery, selectedCategories }: { searchQuery: string, selectedCategories: string[] }): Promise<void> {
    this.searchQuery = searchQuery;
    this.selectedCategories = selectedCategories;
    await this.loadObjetsMaison();  // Recharge les objets avec les nouveaux critères de recherche
  }

  // Méthode pour charger les objets depuis Firebase avec recherche et filtrage
  async loadObjetsMaison() {
    this.objets = await this.firebaseService.getObjetsMaison(this.searchQuery, this.selectedCategories);
  }
}