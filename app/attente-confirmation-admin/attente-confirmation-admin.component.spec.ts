import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttenteConfirmationAdminComponent } from './attente-confirmation-admin.component';

describe('AttenteConfirmationAdminComponent', () => {
  let component: AttenteConfirmationAdminComponent;
  let fixture: ComponentFixture<AttenteConfirmationAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttenteConfirmationAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttenteConfirmationAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
