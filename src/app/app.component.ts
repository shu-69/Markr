import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators'
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  title = 'CrecomStudents';

  subscription: Subscription

    constructor(private router: Router, private auth: AuthService){

      // Listener for browser refreshed

      this.subscription = router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          //browserRefresh = !router.navigated;

          console.log("Browser refreshed")
        }
      });
 

    }
  ngOnInit(): void {
    //this.auth.autoAuthUser();
  }

}
