import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmConnexionComponent } from './confirm-connexion.component';

describe('ConfirmConnexionComponent', () => {
  let component: ConfirmConnexionComponent;
  let fixture: ComponentFixture<ConfirmConnexionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmConnexionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmConnexionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
