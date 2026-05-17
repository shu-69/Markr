import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { Course, CourseService } from '../services/course.service';
import { PaymentService } from '../services/payment.service';
import { UserDetails } from '../UserDetails';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  standalone: false,
})
export class CoursesComponent implements OnInit {
  courses: WritableSignal<Course[]> = signal([]);
  enrolledCourseIds: WritableSignal<string[]> = signal([]);
  isLoading: WritableSignal<boolean> = signal(false);
  isProcessingPayment: WritableSignal<boolean> = signal(false);

  constructor(
    private courseService: CourseService,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.fetchCourses();
    if (UserDetails._id) {
      this.fetchEnrolledCourses();
    }
  }

  fetchCourses() {
    this.isLoading.set(true);
    this.courseService.getCourses().subscribe({
      next: (res) => {
        if (res.success) {
          this.courses.set(res.result);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load courses', err);
        this.isLoading.set(false);
      }
    });
  }

  fetchEnrolledCourses() {
    this.courseService.getEnrolledCourses(UserDetails._id).subscribe({
      next: (res) => {
        if (res.success) {
          this.enrolledCourseIds.set(res.result);
        }
      },
      error: (err) => console.error('Failed to fetch enrollments', err)
    });
  }

  isEnrolled(courseId: string): boolean {
    return this.enrolledCourseIds().includes(courseId);
  }

  enrollFree(courseId: string) {
    if (!UserDetails._id) {
      this.showMessage('Please log in to enroll.');
      return;
    }
    this.isProcessingPayment.set(true);
    this.courseService.enrollInCourse(UserDetails._id, courseId).subscribe({
      next: (res) => {
        if (res.success) {
          this.showMessage('Successfully enrolled for free!');
          this.fetchEnrolledCourses();
        } else {
          this.showMessage('Failed to enroll.');
        }
        this.isProcessingPayment.set(false);
      },
      error: (err) => {
        console.error('Enroll error', err);
        this.showMessage('An error occurred.');
        this.isProcessingPayment.set(false);
      }
    });
  }

  enrollPaid(course: Course) {
    if (!UserDetails._id) {
      this.showMessage('Please log in to purchase.');
      return;
    }
    
    this.isProcessingPayment.set(true);
    const description = `Enrollment in ${course.title}`;
    
    // amount will automatically be mapped to 100 paise (₹1) in PaymentService per our hardcoded setup.
    this.paymentService.initiatePayment(course.price || 499, description).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          // Send to backend
          this.courseService.enrollInCourse(UserDetails._id, course._id, response.razorpay_payment_id).subscribe({
            next: (res) => {
              if (res.success) {
                this.showMessage('Payment successful! You are now enrolled.');
                this.fetchEnrolledCourses();
              } else {
                this.showMessage('Payment successful but enrollment failed. Contact support.');
              }
              this.isProcessingPayment.set(false);
            },
            error: (err) => {
              console.error('Enroll error', err);
              this.showMessage('Error finalizing enrollment.');
              this.isProcessingPayment.set(false);
            }
          });
        } else {
          this.isProcessingPayment.set(false);
          if (response.status === 'cancelled') {
            this.showMessage('Payment cancelled.');
          }
        }
      },
      error: (err) => {
        this.isProcessingPayment.set(false);
        console.error('Payment Error:', err);
        this.showMessage('Payment failed.');
      }
    });
  }

  private showMessage(msg: string) {
    this.snackBar.open(msg, 'Close', { duration: 3000, panelClass: ['premium-snackbar'] });
  }
}
