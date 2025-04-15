import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";
import { MainBannerComponent } from "../main-banner/main-banner.component";
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../firebase.service';
import { ObjetUtilisateurComponent } from "../objet-utilisateur/objet-utilisateur.component";
import { CreateObjectComponent } from "../create-object/create-object.component";
import { CreatePieceComponent } from '../create-piece/create-piece.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, MainBannerComponent, PiedDePageComponent, CommonModule, ObjetUtilisateurComponent, CreateObjectComponent, CreatePieceComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', '../../assets/styles.css']
})
export class HomeComponent implements AfterViewInit {
  
  constructor(private firebaseservice: FirebaseService, private router: Router) {}
  isvisiteur: boolean = true;
  isSimple: boolean = true;
  users: any[] = [];

  ngOnInit() {
    // Vérifier si l'utilisateur est un visiteur sans prendre en compte la connexion
    this.firebaseservice.getCurrentUser().subscribe((user: any) => {
      if(user?.level >1){
        this.isSimple= false;
      }
      if (user?.level > -1) {
      this.isvisiteur = false;
      }
      this.isvisiteur = !(user?.level > -1);
    });
  }

  @ViewChild('loaderWrapper', { static: false }) loaderWrapper!: ElementRef;

  ngAfterViewInit(): void {
    // Gestion du loader
    const loader = this.loaderWrapper?.nativeElement;
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }

    // Animation fade-in
    const faders = document.querySelectorAll('.fade-in');
    const options = { threshold: 0.2 };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
          obs.unobserve(entry.target);
        }
      });
    }, options);

    faders.forEach(fader => observer.observe(fader));
  }
}

