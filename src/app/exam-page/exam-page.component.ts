import { AfterViewInit, Component, ElementRef, HostListener, Inject, signal, Signal, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationExtras, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { Params } from '../Params';
import { Observable, Subscription, interval, map, share, timer } from 'rxjs';
import { Question, Test } from '../TestsParams';
import { UserDetails } from '../UserDetails';
import { MatTabGroup } from '@angular/material/tabs';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { SharedServiceService } from '../services/shared-service.service';
export interface ImageDialogData {

  'src': string

}

@Component({
    selector: 'app-exam-page',
    templateUrl: './exam-page.component.html',
    styleUrls: ['./exam-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class ExamPageComponent  implements AfterViewInit {

  @ViewChild('timerProgressBar', { static: false }) timerProgressBar!: ElementRef;

  isLoading = signal<boolean>(false);
  toShowInstructions = false;
  isExaminationRunning = false;
  isSubmitting = false;
  isSubmitted = false;
  isSubmitFailed = false;
  timeOut = false;
  examTimerSubscription: any;
  selectedQuestionIndex = 0;

  rxTime: any = new Date();
  timesubscription!: Subscription;
  examTimer = '';
  timePassed = '';
  timeOutText = '';

  hourGlassAnimOptions: AnimationOptions = {
    path: '/assets/anims/sand-clock-timer.json',
    loop: true
  };

  questionContainerUI = {

    'font-size': '18px',
    'font-family': 'Poppins-Regular',

  }

  submissionDetails = {

    'id': ''

  }

  instructions: string = '';

  isInsctructionCheck = false;

  examDetails = {

    'examType': '',
    'id': ''

  }

  userDetails = {

    'name': '',
    'username': '',
    'email': '',

  }

  paperDetails: Test | undefined = undefined
  answers: any[] = [];

  // @HostListener('window:beforeunload', ['$event'])
  // canLeavePage($event: any){
  //   if (this.isExaminationRunning && confirm('Exam is in progress. Leaving this page will result to loose your progress.')) {
  //     $event.preventDefault();
  //   }
  // }

  @HostListener('window:beforeunload', ['$event'])
  showMessage($event: any) {
    if (this.isExaminationRunning) {
      $event.returnValue = 'Exam is in progress. Refreshing this page will result to loose your progress.';
    }

  }

  constructor(private route: ActivatedRoute, private dialog: MatDialog, private http: HttpClient, private router: Router,
    private location: Location, private sharedService: SharedServiceService) {

    this.sharedService.isExamRunning = this.isExaminationRunning;

  }

  canDeactivate(component: ExamPageComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    //return (this.isExaminationRunning && confirm('Exam is in progress. Leaving this page will result to loose your progress.'));

    console.log('checking')

    return !this.isExaminationRunning;

  }

  ngAfterViewInit(): void {



  }

  async ngOnInit() {

    this.initCurrentTime();

    this.route.queryParams.subscribe(async (data: any) => {

      this.examDetails.examType = data.examType;
      this.examDetails.id = data.id;

      // this.userDetails.name = data.user_name;
      // this.userDetails.username = data.user_username;
      // this.userDetails.password = data.user_password;
      // this.userDetails.email = data.user_email;

      this.authenticate(data.user_email, data.user_password)

    });

  }

  async startExam() {

    if (!this.checkError())
      return

    this.isExaminationRunning = true;
    this.toShowInstructions = false;
    if (!this.paperDetails!.is_without_time)
      this.startExamTimer(this.paperDetails!.time);

  }

  checkError(): Boolean {

    if (this.userDetails.name == '' || this.userDetails.username == '' || this.userDetails.email == '') {
      alert('Cannot start exam. User details missing.')
      return false;
    }

    if (this.examDetails.id == '' || this.examDetails.examType == '') {
      alert('Cannot start exam. Exam details missing.')
      return false;
    }

    if (this.paperDetails == undefined) {
      alert('Cannot start exam. Paper details missing.')
      return false;
    }

    return true;

  }

  loadExam(examType: 'test' | 'practice_paper' | string, examId: string) {

    this.isLoading.set(true);

    const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

    const options: any = {

      headers: headers,
      params: {
        'examType': examType,
        'examId': examId
      },
      // responseType: 'text'

    }

    this.http.get(Params.SERVICE_BASE_URL + Params.EXAM_SERVICE_URL_SUFFIXS.GET_EXAM, options).subscribe({
      next: (result: any) => {

        this.isLoading.set(false);

        this.paperDetails = result.result

        this.answers.fill(undefined, 0, this.paperDetails!.questions.length)

      }, error: (error: any) => {

        this.isLoading.set(false);

        console.error(error);
        alert("Can't load tests, please try again after sometime.");

        this.location.back();

      }
    });

  }

  async authenticate(username: string, password: string) {

    this.isLoading.set(true);

    const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

    const options: any = {

      headers: headers,
      params: { 'username': username, 'password': password },

    }

    await this.http.get(Params.SERVICE_BASE_URL + Params.ACCOUNT_SERVICE_URL_SUFFIXS.LOGIN, options).subscribe({
      next: (result: any) => {

        this.isLoading.set(false);

        if (result.success) {

          let response = result.result;

          this.userDetails.name = response.name;
          this.userDetails.username = response.username;
          this.userDetails.email = response.email;

          this.isLoading.set(true);

          if(this.examDetails.examType == 'test'){

            this.http.get(Params.SERVICE_BASE_URL + Params.EXAM_SERVICE_URL_SUFFIXS.CHECK_SUBMISSION,
              { headers: headers, params: { 'email': response.email, 'examId': this.examDetails.id } }).subscribe({
  
                next: (value: any) => {
  
                  this.isLoading.set(false);
  
                  if (value.success) {
  
                    if (value.result) {
  
                      alert("You have already attempted this exam, so you cannot attempt it again.")
                      this.location.back()
  
                    } else {
  
                      this.getInstructions(this.examDetails.examType);
                      this.loadExam(this.examDetails.examType, this.examDetails.id)   // TODO ::::
  
                    }
  
                  } else {
  
                    alert('An unknown error occured');
                    this.location.back();
  
                  }
  
                }, error: (error) => {
  
                  this.isLoading.set(false);
  
                  console.error(error)
                  alert('An unknown error occured');
                  this.location.back();
  
                },
  
              })

          }else{

            this.getInstructions(this.examDetails.examType);
            this.loadExam(this.examDetails.examType, this.examDetails.id)   // TODO ::::

          }

        } else {

          this.isLoading.set(false);

          alert("Authentication failed!")
          this.location.back();

        }

      }, error: (error: any) => {

        this.isLoading.set(false);

        console.error(error)
        alert("Authentication failed, due to an error!")
        this.location.back();

      }
    });

  }

  setUserAnswer(question: Question, event: any) {

    var answer = event.target.value;

    if (!answer)
      return;

    question.userAnswer = answer;

  }

  saveAnswer() {

    this.answers[this.selectedQuestionIndex] = this.paperDetails!.questions[this.selectedQuestionIndex].userAnswer;

    this.goNextQuestion();

  }

  getInstructions(examType: string) {

    this.isLoading.set(true);

    const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

    const options: any = {

      headers: headers,
      params: {
        'examType': examType,
      },
      // responseType: 'text'

    }

    this.http.get(Params.SERVICE_BASE_URL + Params.EXAM_SERVICE_URL_SUFFIXS.GET_EXAM_INSTRUCTIONS, options).subscribe({
      next: (result: any) => {

        this.isLoading.set(false);

        console.log("Ins", result)

        this.instructions = result.result

        this.toShowInstructions = true;

      }, error: (error: any) => {

        this.isLoading.set(false);

        this.toShowInstructions = true;

        this.instructions = "Can't load Instructions";

        console.error(error);

      }
    });

  }

  getExamTime(withoutTime: Boolean, seconds: number): string {

    if (withoutTime || seconds == 0)
      return 'No time'
    else
      return this.changeSecondsToTime(seconds)

  }

  submitExam() {

    this.isExaminationRunning = false;
    this.isSubmitting = true;
    this.isSubmitFailed = false;
    this.sharedService.isExamRunning = this.isExaminationRunning;

    let options = {

      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      params: {

        "examType": this.examDetails.examType,
        "examId": this.examDetails.id

      }

    }

    let body = {

      "questions": this.getQuestionsWithAnswers(),
      "submittedBy": {
        "name": this.userDetails.name,
        "username": this.userDetails.username,
        "email": this.userDetails.email,
      },
      "submittionDetails": {
        "date": new Date(),
        "timeTaken": this.timePassed,
      },
      "examDetails": {
        "examType": this.examDetails.examType,
        "examId": this.examDetails.id,
        "title": this.paperDetails?.title,
        "totalMarks": this.paperDetails?.marks,
        "passMarks": this.paperDetails?.pass_marks,
        "negativeMarking": this.paperDetails?.negativeMarking
      }

    }

    console.log('sending data', body)

    this.http.post(Params.SERVICE_BASE_URL + Params.EXAM_SERVICE_URL_SUFFIXS.SUBMIT_EXAM, body, options).subscribe({

      next: (data: any) => {

        if (data.success) {

          this.isSubmitting = false;
          this.isSubmitted = true;

          this.submissionDetails.id = data.submissionId;

        } else {

          this.isSubmitting = false;
          this.isSubmitFailed = true;

        }

        console.log(data)

      }, error: (err) => {

        this.isSubmitting = false;
        this.isSubmitFailed = true;

        console.error(err)

      }

    })

    this.examTimerSubscription.unsubscribe();

  }

  getQuestionsWithAnswers(): any[] {

    let questions = [];

    for (let i = 0; i < this.paperDetails!.questions.length; i++) {

      let element = this.paperDetails!.questions[i]

      let question = {

        "body": element.body,
        "answer_content": element.answer_content,
        "answer_type": element.answer_type,
        "marks": element.marks,
        "user_ans": this.answers[i]

      }

      questions.push(question);

    }

    return questions;

  }

  viewResult() {

    let navigationExtras: NavigationExtras = {
      queryParams: {

        'examType': this.examDetails.examType,
        'examId': this.examDetails.id,
        'submissionId': this.submissionDetails.id

      }
    };

    this.router.navigate([Params.PageNames.viewresult], navigationExtras);

  }

  openSubmitDialog() {

    let dialogRef = this.dialog.open(SubmitDialog, {
      width: '50%',
      // height: '90%',
      panelClass: ['submit-paper-dialog'],

      data: {},

    });

    dialogRef.afterClosed().subscribe((data) => {

      if (data && data.submit) {

        this.submitExam();

      }

    });

  }

  changeSecondsToTime(seconds: number): string {

    seconds = Number(seconds);

    var h = Math.floor(seconds / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours") : "0 hour, ";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute" : " minutes") : "";
    //var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

    return hDisplay + mDisplay;

  }

  getTodayDate(): string {

    let date = new Date();

    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

  }

  initCurrentTime() {
    this.timesubscription = timer(0, 1000)
      .pipe(
        map(() => new Date()),
        share()
      )
      .subscribe(time => {
        this.rxTime = time;
      });
  }

  changeQuestionsContainerFontSize(method: 'increase' | 'decrease') {

    if (method == 'increase') {

      let currentFontSize: number = Number(this.questionContainerUI['font-size'].replace('px', ''));

      if (currentFontSize >= 40)
        return

      let newFontSize = (currentFontSize + 1) + 'px';

      this.questionContainerUI['font-size'] = newFontSize;

    } else {

      let currentFontSize: number = Number(this.questionContainerUI['font-size'].replace('px', ''));

      if (currentFontSize <= 10)
        return

      let newFontSize = (currentFontSize - 1) + 'px';

      this.questionContainerUI['font-size'] = newFontSize;

    }

  }

  goPrevQuestion() {

    if (this.selectedQuestionIndex == 0)
      return;

    this.selectedQuestionIndex--;

  }

  goNextQuestion() {

    if (this.selectedQuestionIndex >= this.paperDetails!.questions.length - 1)
      return;

    this.selectedQuestionIndex++;

  }

  goToQuestion(index: number) {

    if (index < 0 || index >= this.paperDetails!.questions.length)
      return;

    this.selectedQuestionIndex = index;

  }

  toogleMarkQuestion(question: Question) {

    question.isMarked = !question.isMarked;

  }

  expandQuestionImage(imageSrc: string) {

    let dialogRef = this.dialog.open(ImagePreviewDialog, {
      width: '90%',
      height: '90%',
      panelClass: ['question_image_preview'],

      data: { src: imageSrc },

    });

    dialogRef.afterClosed().subscribe(() => {

    });

  }

  startExamTimer2(examTime: number) {         // Not using

    const source = timer(0, 1000);

    const timeStartedAt = new Date().getMilliseconds();

    this.examTimerSubscription = source.subscribe(val => {

      console.log('val', val, new Date().getMilliseconds())

      this.timePassed = this.msToTime(val * 1000);
      let currentMs = (examTime - val) * 1000;
      this.examTimer = this.msToTime(currentMs);

      this.setTimerProgress((val * 100) / examTime);

      if (val == examTime) {

        this.examTimerSubscription.unsubscribe();
        console.log("Time Up!")

      }

    });
  }

  startExamTimer(examTime: number) {

    const source = interval(1000);
    const startTime = new Date().getTime();
    const endTime = startTime + (examTime * 1000);

    this.examTimerSubscription = source.subscribe(() => {
      const currentTime = new Date().getTime();
      const remainingTime = endTime - currentTime;

      if (remainingTime <= 0) {
        this.timeOut = true;
        this.isExaminationRunning = false;
        this.examTimerSubscription.unsubscribe();
        console.log("Time Up!");

        // Showing timeout animation >>

        let progress = 10;
        this.timeOutText = `Time up! Please wait submitting your progress in ${progress} seconds.`
        const intervalId = setInterval(() => {
          progress--;
          this.timeOutText = `Time up! Please wait submitting your progress in ${progress} seconds.`
        }, 1000);

        setTimeout(() => {
          clearInterval(intervalId);
          this.submitExam();
        }, 10000);

        //return;
      }

      this.timePassed = this.msToTime((examTime * 1000) - remainingTime);
      this.examTimer = this.msToTime(remainingTime);
      this.setTimerProgress(((examTime * 1000) - remainingTime) * 100 / (examTime * 1000));
    });

  }

  msToTime(timeInMiliseconds: number) {

    let h, m, s;
    h = Math.floor(timeInMiliseconds / 1000 / 60 / 60);
    m = Math.floor((timeInMiliseconds / 1000 / 60 / 60 - h) * 60);
    s = Math.floor(((timeInMiliseconds / 1000 / 60 / 60 - h) * 60 - m) * 60);

    s < 10 ? s = `0${s}` : s = `${s}`
    m < 10 ? m = `0${m}` : m = `${m}`
    h < 10 ? h = `0${h}` : h = `${h}`

    return (`${h}:${m}:${s}`);

  }

  hourGlassAnimationCreated(animationItem: AnimationItem): void {
    this.hourGlassAnimOptions
  }

  setTimerProgress(value: number) {

    this.timerProgressBar.nativeElement.style.backgroundSize = value + "%"

  }

  getObjectIDAsString(objectId: any) {



    //const objectId = new ObjectId(); // create a new ObjectID
    return objectId.toString(); // convert to string

  }

  ngOnDestroy() {
    if (this.timesubscription) {
      this.timesubscription.unsubscribe();
    }
  }

}

@Component({
  selector: 'image-preview-dialog',
  template: `

  <i class="fa fa-times" style="position: absolute; right: 0; margin: 20px; font-size: 24px; cursor: pointer;" (click)="close()"></i>

  <img [src]="data.src" style="width: 100%; height: 100%; object-fit: contain;">
    
            `,
  standalone: true,
})

export class ImagePreviewDialog {
  constructor(public dialogRef: MatDialogRef<ImagePreviewDialog>, @Inject(MAT_DIALOG_DATA) public data: ImageDialogData) { }

  close() {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'submit-dialog',
  template: `<section>

  <div style="display: flex; flex-flow: column; padding: 20px 30px; gap: 20px; font-family: 'Poppins-SemiBold';"> 

    <h1 style="margin-bottom: 10px; margin-top: 8px;">Submit Paper</h1>

    <img src="assets/iconspichon/icons8_question_mark_100px.png" style="width: 20%; align-self: center;"/>

    <span style="align-self: center;">Please confirm to submit.</span>

    <div style="display: flex; justify-content: space-between; gap: 20px;">
      <button class="close" style="width: 50%;" (click)="close()">Close</button>
      <button class="btn" style="width: 50%;" (click)="done()">Confirm Submit</button>
    </div>

  </div>

  </section>`,
  styles: [`
            .btn {
              padding: 0.9em 1.6em;
              border: none;
              outline: none;
              color: #FFF;
              font-family: inherit;
              font-weight: 500;
              font-size: 17px;
              cursor: pointer;
              position: relative;
              z-index: 0;
              border-radius: 12px;
              }

              .btn::after {
              content: "";
              z-index: -1;
              position: absolute;
              width: 100%;
              height: 100%;
              background-color: rgb(46, 46, 46);
              left: 0;
              top: 0;
              border-radius: 10px;
              }
              /* glow */
              .btn::before {
              content: "";
              background: linear-gradient(
                  45deg,
                  #FF0000, #002BFF, #FF00C8, #002BFF,
                    #FF0000, #002BFF, #FF00C8, #002BFF
              );
              position: absolute;
              top: -2px;
              left: -2px;
              background-size: 600%;
              z-index: -1;
              width: calc(100% + 4px);
              height: calc(100% + 4px);
              filter: blur(8px);
              animation: glowing 20s linear infinite;
              transition: opacity .3s ease-in-out;
              border-radius: 10px;
              opacity: 0;
              }

              @keyframes glowing {
              0% {
                background-position: 0 0;
              }

              50% {
                background-position: 400% 0;
              }

              100% {
                background-position: 0 0;
              }
              }

              /* hover */
              .btn:hover::before {
              opacity: 1;
              }

              .btn:active:after {
              background: transparent;
              }

              .btn:active {
              color: #000;
              font-weight: bold;
              } .close{

              border-radius: 12px;
              font-family: 'Poppins-Regular', sans-serif;
              font-size: 18px;
              cursor: pointer;
              
              }`],
  standalone: true,
})

export class SubmitDialog {
  constructor(public dialogRef: MatDialogRef<ImagePreviewDialog>, @Inject(MAT_DIALOG_DATA) public data: ImageDialogData) { }

  close() {
    this.dialogRef.close({ 'submit': false });
  }

  done() {
    this.dialogRef.close({ 'submit': true });
  }

}