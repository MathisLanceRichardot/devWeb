import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjetUtilisateurComponent } from './objet-utilisateur.component';

describe('ObjetUtilisateurComponent', () => {
  let component: ObjetUtilisateurComponent;
  let fixture: ComponentFixture<ObjetUtilisateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjetUtilisateurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjetUtilisateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
