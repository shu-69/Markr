import { Component, signal, WritableSignal } from '@angular/core';
import { SideNavToogle } from '../sidenav/sidenav.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: false,
})
export class LayoutComponent {
  isSideNavCollapsed: WritableSignal<boolean> = signal(false);
  screenWidth = 0;

  onToggleSideNav(data: SideNavToogle) {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  getBodyClass(): string {
    return '';
  }
}
