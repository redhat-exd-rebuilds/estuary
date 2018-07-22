import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<router-outlet (activate)="onActivate()"></router-outlet>',
})
export class AppComponent {
  onActivate() {
    // Smoothly scroll up the page without the use of animations
    const scrollToTop = window.setInterval(() => {
      const pos = window.pageYOffset;
      if (pos > 0) {
          window.scrollTo(0, pos - 20);
      } else {
          window.clearInterval(scrollToTop);
      }
    }, 15);
  }
}
