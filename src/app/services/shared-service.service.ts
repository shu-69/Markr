import { Injectable } from '@angular/core';
import { UserDetails } from '../UserDetails';

@Injectable({
  providedIn: 'root',
})
export class SharedServiceService {
  isExamRunning = false;

  constructor() {}

  getName(trimLastName?: boolean) {
    if (trimLastName) {
      if (UserDetails.Name.includes(' ')) {
        return UserDetails.Name.substring(0, UserDetails.Name.indexOf(' '));
      } else {
        return UserDetails.Name;
      }
    } else {
      return UserDetails.Name;
    }
  }

  getUserName() {
    return UserDetails.Username;
  }

  getUsersSubmissions() {
    return UserDetails.Submission;
  }

  getUsersSubmissionsForParticularExam(examType: 'test' | 'practice_paper') {
    return UserDetails.Submission?.filter(
      (element: any) => element.examDetails.examType == examType,
    );
  }
}
