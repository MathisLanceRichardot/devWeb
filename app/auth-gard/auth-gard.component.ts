import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { FirebaseService } from '../firebase.service';
import { Observable, map, take } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {}
  canActivate(): Observable<boolean> {
    // Vérifie si l'utilisateur est déjà authentifié dans un flux réactif
    return this.firebaseService.est_connecter$.pipe(
      take(1), // Ne prend qu'une seule valeur (l'état de la connexion)
      switchMap((isConnected) => {
        if (isConnected) {
          return [true]; // Si l'utilisateur est connecté, autorise l'accès
        } else {
          this.router.navigate(['/home']); // Sinon, redirige vers la page de connexion
          return [false]; // Refuse l'accès
        }
      })
    );
  }
}
