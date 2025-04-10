import { Routes } from '@angular/router';
import { InformationComponent } from './information/information.component';
import { AppComponent } from '../app/app.component';
import {PageInconnueComponent} from './page-inconnue/page-inconnue.component';
import {HomeComponent} from './home/home.component';
import {InscriptionComponent} from './inscription/inscription.component'
import {ConnexionComponent} from './connexion/connexion.component'
import { ProfilComponent } from "./profil/profil.component";
import { IdentifierComponent } from './identifier/identifier.component';
import { MesObjetsComponent } from './mes-objets/mes-objets.component';
import { AttenteConfirmationAdminComponent } from './attente-confirmation-admin/attente-confirmation-admin.component';
import { AttenteConfirmationMailComponent } from './attente-confirmation-mail/attente-confirmation-mail.component';
export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },  // Redirection vers '/home'
    { path: 'home', component: HomeComponent },  // Assure-toi que HomeComponent existe
    { path: 'information', component: InformationComponent},  // Route vers InformationComponent
    {path: 'identifier',component: IdentifierComponent,children: [
          { path: 'connexion', component: ConnexionComponent },
          { path: 'inscription', component: InscriptionComponent },
    ]},
    { path:"mes-objets", component:MesObjetsComponent},
    { path: 'connexion', component: ConnexionComponent},  // Route vers InformationComponent
    { path: 'profil', component: ProfilComponent},
    { path: 'attente-confirmation-admin', component: AttenteConfirmationAdminComponent},
    { path: 'attente-confirmation-mail', component: AttenteConfirmationMailComponent},
    { path: '**', component: PageInconnueComponent},  // Route vers InformationComponent
];
