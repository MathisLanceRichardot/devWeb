import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesObjetsComponent } from './mes-objets.component';

describe('MesObjetsComponent', () => {
  let component: MesObjetsComponent;
  let fixture: ComponentFixture<MesObjetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesObjetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesObjetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
