import { Component, ViewEncapsulation } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { SharedServiceService } from '../services/shared-service.service';
import { Params } from '../Params';
import { NavigationExtras, Router } from '@angular/router';
import ObjectID from 'bson-objectid';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {

  constructor(public sharedService: SharedServiceService, private router: Router) {



  }

  ngOnInit() {


  }

  viewResult(examType: string, examId: string, submissionId: string) {

    let navigationExtras: NavigationExtras = {
      queryParams: {

        'examType': examType,
        'examId': examId,
        'submissionId': submissionId

      }
    };

    //this.router.navigate([Params.PageNames.viewresult], navigationExtras);

    const link = this.router.serializeUrl(this.router.createUrlTree([Params.PageNames.viewresult], navigationExtras));
    window.open(link, '_blank');

  }

  toogleSection(elementClassList: any, e: any) {

    if (elementClassList.contains('inactive')) {

      elementClassList.remove('inactive');

      e.srcElement.innerText = 'keyboard_arrow_up';

    } else {

      elementClassList.add('inactive');

      e.srcElement.innerText = 'keyboard_arrow_down';

    }

  }

  getExamDateStr(date: any): string {

    date = new Date(date);

    return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();

  }

  getExamTimeStr(date: any): string {

    date = new Date(date);

    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

  }

}
