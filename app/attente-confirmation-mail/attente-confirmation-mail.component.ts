import { Component } from '@angular/core';
import { MainBannerComponent } from "../main-banner/main-banner.component";
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";

@Component({
  selector: 'app-attente-confirmation-mail',
  imports: [MainBannerComponent, PiedDePageComponent],
  templateUrl: './attente-confirmation-mail.component.html',
  styleUrls: ['./attente-confirmation-mail.component.css', '../../assets/styles.css']
})
export class AttenteConfirmationMailComponent {

}
