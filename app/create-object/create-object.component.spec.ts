import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateObjetComponent } from './create-object.component';

describe('CreateObjectComponent', () => {
  let component: CreateObjectComponent;
  let fixture: ComponentFixture<CreateObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateObjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
