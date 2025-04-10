import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarreRechercheComponent } from './barre-recherche.component';

describe('BarreRechercheComponent', () => {
  let component: BarreRechercheComponent;
  let fixture: ComponentFixture<BarreRechercheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarreRechercheComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarreRechercheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
