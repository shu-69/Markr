import { Component, ViewEncapsulation, WritableSignal, signal } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { SharedServiceService } from '../services/shared-service.service';
import { Params } from '../Params';
import { NavigationExtras, Router } from '@angular/router';
import { SubmissionService } from '../services/submission.service';
import ObjectID from 'bson-objectid';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class DashboardComponent {

  constructor(public sharedService: SharedServiceService, private router: Router, private submissionService: SubmissionService) {



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

  isSubmissionsExpanded: WritableSignal<boolean> = signal(false);
  isLoadingSubmissions: WritableSignal<boolean> = signal(false);

  async toogleSubmissions() {
    this.isSubmissionsExpanded.set(!this.isSubmissionsExpanded());
    
    // Fetch data only when expanding and data isn't present
    if (this.isSubmissionsExpanded() && !this.sharedService.getUsersSubmissions()) {
      this.isLoadingSubmissions.set(true);
      try {
        await this.submissionService.initSubmittions();
      } catch (err) {
        console.error("Failed to load submissions", err);
      } finally {
        this.isLoadingSubmissions.set(false);
      }
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
