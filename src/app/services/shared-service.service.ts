import { Injectable, signal } from '@angular/core';
import { UserDetails } from '../UserDetails';

@Injectable({
  providedIn: 'root',
})
export class SharedServiceService {
  isExamRunning = false;

  // Signals for reactive user data
  userDisplayName = signal('');
  username = signal('');
  userEmail = signal('');
  userProfileImg = signal('../../assets/imgs/default_profile_img.png');

  constructor() {}

  /**
   * Updates the internal signals with the latest data from UserDetails.
   * Call this after a successful login or profile update.
   */
  updateUserData() {
    this.userDisplayName.set(UserDetails.Name || '');
    this.username.set(UserDetails.Username || '');
    this.userEmail.set(UserDetails.Email || '');
    this.userProfileImg.set(UserDetails.ProfileImg || '../../assets/imgs/default_profile_img.png');
  }

  getName(trimLastName?: boolean) {
    const name = this.userDisplayName();
    if (trimLastName) {
      if (name.includes(' ')) {
        return name.substring(0, name.indexOf(' '));
      } else {
        return name;
      }
    } else {
      return name;
    }
  }

  getUserName() {
    return this.username();
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
