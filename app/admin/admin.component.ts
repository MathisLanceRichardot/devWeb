import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css', '../../assets/styles.css']
})
export class AdminComponent implements OnInit {
  isadmin: boolean = false;
  users: any[] = [];
  etat: any;

  constructor(private firebaseservice: FirebaseService, private router: Router) {}

  ngOnInit() {
    // Vérifier si l'utilisateur est un administrateur
    this.firebaseservice.getCurrentUser().subscribe((user: any) => {
      if (user.level >= 3) {
        this.isadmin = true;
        this.loadUsers();
      } else {
        this.isadmin = false;
      }
    });
  }

  Valider_Inscription(mail: any, level: any) {
    console.log("Valider_Inscription");
    this.firebaseservice.addLevel(mail);
    this.loadUsers();
  }

  ModifierProfil(mail: string) {
    console.log("ModifierProfil");
    this.router.navigate(['/profil'], { queryParams: { user: mail } });
  }

  async loadUsers() {
    this.users = await this.firebaseservice.getUsersWithLevelLessThanOrEqualTo(2);
    if (this.users.every(user => user.level <= -2)) {
      this.etat = "en attente de validation";
    }
    if (this.users.every(user => user.level == 0 || user.level == 1)) {
      this.etat = "utilisateur Simple";
    }
    if (this.users.every(user => user.level == 2)) {
      this.etat = "utilisateur Complexe";
    }
    if (this.users.every(user => user.level >= 3)) {
      this.etat = "Administrateur";
    }
    if (this.users.every(user => user.level == -1)) {
      this.etat = "en attente de confirmation du mail";
    }
  }
}
