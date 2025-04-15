import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePieceComponent } from './create-piece.component';

describe('CreatePieceComponent', () => {
  let component: CreatePieceComponent;
  let fixture: ComponentFixture<CreatePieceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePieceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePieceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
