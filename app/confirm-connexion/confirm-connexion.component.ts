import { Component } from '@angular/core';
import { MainBannerComponent } from "../main-banner/main-banner.component";
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";

@Component({
  selector: 'app-confirm-connexion',
  imports: [MainBannerComponent, PiedDePageComponent],
  templateUrl: './confirm-connexion.component.html',
  styleUrls: ['./confirm-connexion.component.css', '../../assets/styles.css']
})
export class ConfirmConnexionComponent {

}
