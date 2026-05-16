import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ExamPageComponent } from '../exam-page/exam-page.component';
import { SharedServiceService } from './shared-service.service';

@Injectable({
  providedIn: 'root',
})
export class ExamPageGuard {
  constructor(private sharedService: SharedServiceService) {}

  canDeactivate(
    component: ExamPageComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    //console.log('check', this.sharedService.isExamRunning)

    return !this.sharedService.isExamRunning;
  }
}
