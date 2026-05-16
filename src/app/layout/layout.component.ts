import { Component, signal, WritableSignal, OnInit } from '@angular/core';
import { SideNavToogle } from '../sidenav/sidenav.component';
import { SharedServiceService } from '../services/shared-service.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: false,
})
export class LayoutComponent implements OnInit {
  isSideNavCollapsed: WritableSignal<boolean> = signal(false);
  screenWidth = 0;

  constructor(private sharedService: SharedServiceService) {}

  ngOnInit() {
    this.sharedService.updateUserData();
  }

  onToggleSideNav(data: SideNavToogle) {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  getBodyClass(): string {
    return '';
  }
}
