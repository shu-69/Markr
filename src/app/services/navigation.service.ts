import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private router: Router) {}

  openPage(pageName: string) {
    if (!pageName.startsWith('/')) {
      pageName += '/';
    }
    this.router.navigate([pageName]);
  }
}
