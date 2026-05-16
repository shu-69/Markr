import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { CoursesComponent } from './courses/courses.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { IndexPageComponent } from './index-page/index-page.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PracticePapersComponent } from './practice-papers/practice-papers.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './services/auth.guard';
import { TestsComponent } from './tests/tests.component';
import { ExamPageComponent } from './exam-page/exam-page.component';
import { ViewresultComponent } from './viewresult/viewresult.component';
import { ExamPageGuard } from './services/exam-page.guard';
import { AnnouncementComponent } from './tabs/announcement/announcement.component';

const routes: Routes = [
  {
    path: 'home',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'announcement',
        component: AnnouncementComponent,
      },
      {
        path: 'courses',
        component: CoursesComponent,
      },
      {
        path: 'tests',
        component: TestsComponent,
      },
      {
        path: 'practice-papers',
        component: PracticePapersComponent,
      },
    ],
  },
  {
    path: '',
    component: IndexPageComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'exam',
    component: ExamPageComponent,
    canDeactivate: [ExamPageGuard], //() => ExamPageComponent.canDeactivate()
  },
  {
    path: 'viewresult',
    component: ViewresultComponent,
  },
  {
    path: 'contact',
    component: ContactUsComponent,
  },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
