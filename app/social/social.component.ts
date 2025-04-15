import { Component, OnInit } from '@angular/core';
import { MainBannerComponent } from "../main-banner/main-banner.component";
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";
import { FirebaseService } from '../firebase.service';
import { CommonModule } from '@angular/common';
import { ProfilComponent } from '../profil/profil.component';
import { BarreRechercheComponent } from "../barre-recherche/barre-recherche.component";


@Component({
  selector: 'app-social',
  standalone: true,
  imports: [MainBannerComponent, PiedDePageComponent, CommonModule, ProfilComponent, BarreRechercheComponent],
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.css']
})
export class SocialComponent implements OnInit{
  users: any[] = [];
  searchQuery: string = '';  
  selectedCategories: string[] = []; 
  selectedSexes: string[] = [];  // Ajout de selectedSexes ici

  constructor(private firebaseService: FirebaseService) {}


  ngOnInit(): void {
    this.loadUsers();
  }


  // Lors de la recherche d'utilisateurs, on applique les filtres de recherche
  async onSearchUser({ searchQuery, selectedCategories, selectedSexes }: { searchQuery: string, selectedCategories: string[], selectedSexes: string[] }): Promise<void> {
    console.log('Requête de recherche:', searchQuery);
    console.log('Catégories sélectionnées:', selectedCategories);
    console.log('Sexe sélectionné:', selectedSexes);
    
    this.searchQuery = searchQuery;
    this.selectedCategories = selectedCategories;
    this.selectedSexes = selectedSexes;  // Ajout de selectedSexes

    // Recharge les utilisateurs avec les nouveaux critères
    await this.loadUsers();  
  }
  
  // Charge les objets avec les critères de recherche et de filtre
  async loadUsers() {
    console.log('Chargement des objets avec les critères :');
    console.log('Recherche:', this.searchQuery);
    console.log('Catégories:', this.selectedCategories);
    console.log('Sexes:', this.selectedSexes);
  
    this.users = await this.firebaseService.getUsersSearch(this.searchQuery, this.selectedCategories, this.selectedSexes);
  }
}

