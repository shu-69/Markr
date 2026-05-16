import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { navData } from './nav-data';

export interface SideNavToogle {
  screenWidth: number;
  collapsed: WritableSignal<boolean>;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class SidenavComponent implements OnInit {
  @Output() onToggleSideNav: EventEmitter<SideNavToogle> = new EventEmitter();

  collapsed: WritableSignal<boolean> = signal(false);
  screenWidth = 0;
  navData = navData;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed.set(false);
      this.onToggleSideNav.emit({
        collapsed: this.collapsed,
        screenWidth: this.screenWidth,
      });
    }
  }

  ngOnInit() {
    this.screenWidth = window.innerWidth;
  }

  toogleCollapse() {
    this.collapsed.set(!this.collapsed());
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  closeSideNav() {
    this.collapsed.set(false);
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }
}
