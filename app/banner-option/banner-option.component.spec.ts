import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionBannerComponent } from './banner-option.component';

describe('MainBannerComponent', () => {
  let component: OptionBannerComponent;
  let fixture: ComponentFixture<OptionBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OptionBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
