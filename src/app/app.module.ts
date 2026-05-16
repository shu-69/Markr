import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { IndexPageComponent } from './index-page/index-page.component';
import { GlobalVar } from './GlobalVar';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatBadgeModule } from '@angular/material/badge';
import { RegisterComponent } from './register/register.component';
import { NgpImagePickerModule } from 'ngp-image-picker';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
import { DatePipe } from '@angular/common';
import { AuthService } from './services/auth.service';
import { catchError, Observable, of } from 'rxjs';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AnnouncementComponent } from './tabs/announcement/announcement.component';
import { CoursesComponent } from './courses/courses.component';
import { TestsComponent } from './tests/tests.component';
import { PracticePapersComponent } from './practice-papers/practice-papers.component';
import { PencilLoaderComponent } from './components/pencil-loader/pencil-loader.component';
import { ExamPageComponent } from './exam-page/exam-page.component';
import { ViewresultComponent } from './viewresult/viewresult.component';

export function playerFactory() {
  return player;
}

export function appInitializer(
  authenticationService: AuthService,
): () => Promise<Observable<any>> {
  return async () =>
    (await authenticationService.autoAuthUser()).pipe(
      // catch error to start app on success or failure
      catchError(() => of()),
    );
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LayoutComponent,
    HomeComponent,
    IndexPageComponent,
    ContactUsComponent,
    PageNotFoundComponent,
    DashboardComponent,
    RegisterComponent,
    SidenavComponent,
    AnnouncementComponent,
    CoursesComponent,
    TestsComponent,
    PracticePapersComponent,
    PencilLoaderComponent,
    ExamPageComponent,
    ViewresultComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatDialogModule,
    MatBadgeModule,
    NgpImagePickerModule,
    FontAwesomeModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatTabsModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    GlobalVar,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    DatePipe,
    AuthService,
    provideLottieOptions({ player: () => player }),
    provideAppInitializer(() => {
      const initializerFn = ((service: AuthService) =>
        async function () {
          return service.autoAuthUser();
        })(inject(AuthService));
      return initializerFn();
    }),
    provideHttpClient(withInterceptorsFromDi()),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
