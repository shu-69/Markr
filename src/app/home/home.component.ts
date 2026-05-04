import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { Params } from '../Params';
import { UserDetails } from '../UserDetails';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent {


  constructor(private http: HttpClient) {

    // Loading all submissions

    

  }

  ngOnInit() {

    console.log('Home Ng Init', UserDetails.Email)

  }


}
