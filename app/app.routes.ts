import { Routes } from '@angular/router';
import { InformationComponent } from './information/information.component';
import { AppComponent } from '../app/app.component';
import {PageInconnueComponent} from './page-inconnue/page-inconnue.component';
import {HomeComponent} from './home/home.component';
import {InscriptionComponent} from './inscription/inscription.component'
import {ConnexionComponent} from './connexion/connexion.component'
import { MonProfilComponent } from './mon-profil/mon-profil.component';
import { ObjetUtilisateurComponent } from './objet-utilisateur/objet-utilisateur.component'; 
import { AttenteConfirmationAdminComponent } from './attente-confirmation-admin/attente-confirmation-admin.component';
import { AttenteConfirmationMailComponent } from './attente-confirmation-mail/attente-confirmation-mail.component';
import { SocialComponent } from './social/social.component';
import { Component } from '@angular/core';
import { AuthGuard } from './auth-gard/auth-gard.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },  // Redirection vers '/home'
    { path: 'home', component: HomeComponent },  // Assure-toi que HomeComponent existe
    { path: 'information', component: InformationComponent},  // Route vers InformationComponent
    { path: 'connexion', component: ConnexionComponent },
    { path: 'inscription', component: InscriptionComponent },
    {
        path: 'social',
        loadComponent: () => import('./social/social.component').then(m => m.SocialComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'mon-profil',
        loadComponent: () => import('./mon-profil/mon-profil.component').then(m => m.MonProfilComponent),
        canActivate: [AuthGuard]
      },
      {
        path: 'mes-objets',
        loadComponent: () => import('./objet-utilisateur/objet-utilisateur.component').then(m => m.ObjetUtilisateurComponent),
        canActivate: [AuthGuard]
      },
    { path:"mes-objets", component:ObjetUtilisateurComponent },
    { path: 'mon-profil', component: MonProfilComponent},
    { path: 'attente-confirmation-admin', component: AttenteConfirmationAdminComponent},
    { path: 'attente-confirmation-mail', component: AttenteConfirmationMailComponent},
    { path: '**', component: PageInconnueComponent},  // Route vers InformationComponent
];
