import { Component, Input, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-objet',
  imports:[CommonModule],
  templateUrl: './objet.component.html',
  styleUrls: ['./objet.component.css']
})
export class ObjetComponent implements OnInit {
  @Input() objetId!: string;
  objet: any = null;

  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit() {
    if (this.objetId) {
      this.objet = await this.firebaseService.getObjetById(this.objetId);
    }
  }
}