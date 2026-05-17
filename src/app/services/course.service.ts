import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Params } from '../Params';

export interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  isFree: boolean;
  price?: number;
  thumbnailUrl?: string;
  duration?: string;
}

export interface EnrollmentResponse {
  success: boolean;
  message: string;
}

export interface EnrolledCoursesResponse {
  success: boolean;
  result: string[]; // Array of enrolled course IDs
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = Params.SERVICE_BASE_URL;

  constructor(private http: HttpClient) {}

  getCourses(): Observable<{ success: boolean; result: Course[] }> {
    return this.http.get<{ success: boolean; result: Course[] }>(
      this.apiUrl + Params.COURSES_SERVICE_URL_SUFFIXS.GET_COURSES
    );
  }

  getEnrolledCourses(userId: string): Observable<EnrolledCoursesResponse> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<EnrolledCoursesResponse>(
      this.apiUrl + Params.COURSES_SERVICE_URL_SUFFIXS.GET_ENROLLED_COURSES,
      { params }
    );
  }

  enrollInCourse(userId: string, courseId: string, paymentId?: string): Observable<EnrollmentResponse> {
    const payload = { userId, courseId, paymentId };
    return this.http.post<EnrollmentResponse>(
      this.apiUrl + Params.COURSES_SERVICE_URL_SUFFIXS.ENROLL_IN_COURSE,
      payload
    );
  }
}
