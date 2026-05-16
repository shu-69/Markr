import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { IndexPageComponent } from './index-page/index-page.component';
import { GlobalVar } from './GlobalVar';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegisterComponent } from './register/register.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AnnouncementComponent } from './tabs/announcement/announcement.component';
import { CoursesComponent } from './courses/courses.component';
import { TestsComponent } from './tests/tests.component';
import { PracticePapersComponent } from './practice-papers/practice-papers.component';
import { PencilLoaderComponent } from './components/pencil-loader/pencil-loader.component';
import { ExamPageComponent } from './exam-page/exam-page.component';
import { ViewresultComponent } from './viewresult/viewresult.component';
import { SideSheetComponent } from './components/side-sheet/side-sheet.component';
import { AuthService } from './services/auth.service';

// Angular Material
import { MatDialogModule } from '@angular/material/dialog';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Third Party
import { NgpImagePickerModule } from 'ngp-image-picker';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';

// Standalone Components
import { ProfileComponent } from './profile/profile.component';
import { TransactionsComponent } from './transactions/transactions.component';

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
    AnnouncementComponent,
    CoursesComponent,
    TestsComponent,
    PracticePapersComponent,
    PencilLoaderComponent,
    ExamPageComponent,
    ViewresultComponent,
    SideSheetComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatBadgeModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatTabsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    NgpImagePickerModule,
    FontAwesomeModule,
    ProfileComponent,
    TransactionsComponent,
    SidenavComponent,
  ],
  providers: [
    GlobalVar,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    DatePipe,
    AuthService,
    provideLottieOptions({ player: () => player }),
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.autoAuthUser();
    }),
    provideHttpClient(withInterceptorsFromDi()),
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
