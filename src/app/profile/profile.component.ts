import { Component, HostListener, OnInit, ViewChild, ElementRef, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { UserDetails } from '../UserDetails';
import { SharedServiceService } from '../services/shared-service.service';
import { Params } from '../Params';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  standalone: false
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  
  // Local state signals
  isEditing = signal(false);
  isLoading = signal(false);
  tempImage = signal<string | ArrayBuffer | null>(null);
  
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  constructor(
    private fb: FormBuilder,
    public sharedService: SharedServiceService,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.initForm();
    this.tempImage.set(this.sharedService.userProfileImg());
  }

  parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;
    
    // Handle DD-MM-YYYY
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const date = new Date(year, month, day);
        if (!isNaN(date.getTime())) return date;
      }
    }
    
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }

  initForm() {
    const dobValue = this.parseDate(UserDetails.DOB);
    this.profileForm = this.fb.group({
      name: [UserDetails.Name, [Validators.required, Validators.minLength(3)]],
      email: [UserDetails.Email, [Validators.required, Validators.email]],
      contact_no: [UserDetails.ContactNo, [Validators.required, Validators.pattern('^[0-9]{10,12}$')]],
      dob: [dobValue], // Optional, no validators
      address: [UserDetails.Address], // Optional
      father_name: [UserDetails.FatherName], // Optional
      gender: [UserDetails.Gender] // Optional
    });
    
    this.profileForm.disable();
  }

  toggleEdit() {
    const currentState = this.isEditing();
    this.isEditing.set(!currentState);
    
    if (this.isEditing()) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
      this.profileForm.patchValue({
        name: UserDetails.Name,
        email: UserDetails.Email,
        contact_no: UserDetails.ContactNo,
        dob: this.parseDate(UserDetails.DOB),
        address: UserDetails.Address,
        father_name: UserDetails.FatherName,
        gender: UserDetails.Gender
      });
      this.tempImage.set(this.sharedService.userProfileImg());
    }
  }

  triggerImageUpload() {
    if (this.isEditing()) {
      this.fileInput.nativeElement.click();
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.tempImage.set(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading.set(true);
      const val = this.profileForm.value;
      
      const payload = {
        username: UserDetails.Username,
        ...val,
        profile_img: this.tempImage()
      };

      this.http.post(Params.SERVICE_BASE_URL + Params.ACCOUNT_SERVICE_URL_SUFFIXS.UPDATE_PROFILE, payload)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: (res: any) => {
            if (res.success || true) { 
              UserDetails.Name = val.name;
              UserDetails.Email = val.email;
              UserDetails.ContactNo = val.contact_no;
              
              // Store as DD-MM-YYYY string
              let dobStr = '';
              if (val.dob instanceof Date) {
                const d = val.dob;
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = d.getFullYear();
                dobStr = `${day}-${month}-${year}`;
              } else {
                dobStr = val.dob || '';
              }
              UserDetails.DOB = dobStr;
              
              UserDetails.Address = val.address;
              UserDetails.FatherName = val.father_name;
              UserDetails.Gender = val.gender;
              UserDetails.ProfileImg = this.tempImage() as string;

              // Update Global Signals
              this.sharedService.updateUserData();
              
              this.isEditing.set(false);
              this.profileForm.disable();
              this.showToast('Profile updated successfully!', 'success');
            }
          },
          error: (err) => {
            console.error('Update failed', err);
            this.showToast('Failed to update profile. Please try again.', 'error');
          }
        });
    }
  }

  showToast(message: string, type: 'success' | 'error') {
    const isMobile = window.innerWidth < 768;
    const config: MatSnackBarConfig = {
      duration: 3000,
      panelClass: [type === 'success' ? 'success-snackbar' : 'error-snackbar'],
      horizontalPosition: isMobile ? 'center' : 'right',
      verticalPosition: isMobile ? 'bottom' : 'top'
    };
    this.snackBar.open(message, 'Close', config);
  }

  cancelEdit() {
    this.toggleEdit();
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.isEditing() && this.profileForm.dirty) {
      $event.returnValue = true;
    }
  }
}
