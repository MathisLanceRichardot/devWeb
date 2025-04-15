import { Component,HostListener } from '@angular/core';
import { RouterModule } from '@angular/router'; // Importer RouterModule
import { CommonModule } from '@angular/common'; // Importer CommonModule
import { OptionBannerComponent } from "../banner-option/banner-option.component"; // Importer Subscription pour gérer les abonnements
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { ViewEncapsulation } from '@angular/core';



@Component({
  selector: 'app-main-banner',
  standalone: true,
  imports: [RouterModule, CommonModule, OptionBannerComponent, IconButtonComponent],
  templateUrl: './main-banner.component.html',
  styleUrls: ['./main-banner.component.css', '../../assets/styles.css'],
  encapsulation: ViewEncapsulation.None // Désactive l'encapsulation
})
export class MainBannerComponent {
  isSidebarVisible: boolean = false;

  // Méthode pour basculer l'état de la sidebar
  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  // Fermer la sidebar si on clique en dehors
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const sidebar = document.querySelector('.sidebar');
    const button = document.querySelector('#button');
    if (sidebar && !sidebar.contains(event.target as Node) && !button?.contains(event.target as Node)) {
      this.isSidebarVisible = false;
    }
  }
}

