import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjetAffichageComponent } from './objet-affichage.component';

describe('ObjetAffichageComponent', () => {
  let component: ObjetAffichageComponent;
  let fixture: ComponentFixture<ObjetAffichageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjetAffichageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjetAffichageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
