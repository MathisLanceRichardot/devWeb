import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PiedDePageComponent } from "../pied-de-page/pied-de-page.component";
import { MainBannerComponent } from "../main-banner/main-banner.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, PiedDePageComponent, MainBannerComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', '../../assets/styles.css']
})
export class HomeComponent implements AfterViewInit {

  @ViewChild('loaderWrapper', { static: false }) loaderWrapper!: ElementRef;

  ngAfterViewInit(): void {
    // Gestion du loader
    const loader = this.loaderWrapper?.nativeElement;
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }

    // Animation fade-in
    const faders = document.querySelectorAll('.fade-in');
    const options = { threshold: 0.2 };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
          obs.unobserve(entry.target);
        }
      });
    }, options);

    faders.forEach(fader => observer.observe(fader));
  }
}

