import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttenteConfirmationMailComponent } from './attente-confirmation-mail.component';

describe('AttenteConfirmationMailComponent', () => {
  let component: AttenteConfirmationMailComponent;
  let fixture: ComponentFixture<AttenteConfirmationMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttenteConfirmationMailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttenteConfirmationMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
