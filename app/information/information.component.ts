import { Component,OnInit } from '@angular/core';
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
  selector: 'app-information',
  imports: [RouterModule,CommonModule, MainBannerComponent, PiedDePageComponent, BarreRechercheComponent,ObjetComponent],
  templateUrl: './information.component.html',
  styleUrls: ['../../assets/styles.css', 'information.component.css']
})
export class InformationComponent implements OnInit {
  searchQuery: string = '';  // Texte de recherche
  selectedCategories: string[] = [];  // Catégories sélectionnées
  objets: any[] = [];  // Liste des objets récupérés de Firebase

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.loadObjets();  // Charger les objets au début sans recherche
  }

  // Méthode qui est appelée quand la recherche ou les catégories changent
  async onSearch({ searchQuery, selectedCategories }: { searchQuery: string, selectedCategories: string[] }): Promise<void> {
    console.log('Requête de recherche:', searchQuery);
    console.log('Catégories sélectionnées:', selectedCategories);
    
    this.searchQuery = searchQuery;
    this.selectedCategories = selectedCategories;
    await this.loadObjets();  // Recharge les objets avec les nouveaux critères de recherche
  }
  

  async loadObjets() {
    console.log('Chargement des objets avec les critères :');
    console.log('Recherche:', this.searchQuery);
    console.log('Catégories:', this.selectedCategories);
  
    this.objets = await this.firebaseService.getObjets(this.searchQuery, this.selectedCategories);
  }
}