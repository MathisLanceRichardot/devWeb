import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.css']
})
export class IconButtonComponent {
  @Input() icon: string = 'menu'; // ex: "home", "user", "settings"
  @Input() size: number = 24;
  @Input() color: string = 'currentColor';
}
