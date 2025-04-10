import { Component } from '@angular/core';
import { MainBannerComponent } from "../main-banner/main-banner.component";
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";
import { RouterModule } from '@angular/router'; // NÉCESSAIRE pour <router-outlet>

@Component({
  selector: 'app-identifier',
  standalone: true, // si tu utilises Angular standalone components
  imports: [
    RouterModule,
    MainBannerComponent,
    PiedDePageComponent
  ],
  template: `
    <app-main-banner></app-main-banner>
    <router-outlet></router-outlet>
    <app-pied-de-page></app-pied-de-page>
  `,
  styleUrls: ['./identifier.component.css']
})
export class IdentifierComponent {}
