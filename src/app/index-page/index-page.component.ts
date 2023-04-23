import { Component } from '@angular/core';

import { GlobalVar } from '../GlobalVar';

@Component({
  selector: 'app-index-page',
  templateUrl: './index-page.component.html',
  styleUrls: ['./index-page.component.scss']
})

export class IndexPageComponent {

  constructor(public GlobalVar : GlobalVar){

  }

}
