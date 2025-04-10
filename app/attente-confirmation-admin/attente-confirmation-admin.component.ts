import { Component } from '@angular/core';
import { MainBannerComponent } from "../main-banner/main-banner.component";
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";

@Component({
  selector: 'app-attente-confirmation-admin',
  imports: [MainBannerComponent, PiedDePageComponent],
  templateUrl: './attente-confirmation-admin.component.html',
  styleUrls: ['./attente-confirmation-admin.component.css', '../../assets/styles.css']
})
export class AttenteConfirmationAdminComponent {

}
