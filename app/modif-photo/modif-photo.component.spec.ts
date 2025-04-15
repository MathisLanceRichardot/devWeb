import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifPhotoComponent } from './modif-photo.component';

describe('ModifPhotoComponent', () => {
  let component: ModifPhotoComponent;
  let fixture: ComponentFixture<ModifPhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifPhotoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
