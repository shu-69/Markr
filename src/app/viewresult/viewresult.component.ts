import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Params } from '../Params';

import { Location } from '@angular/common';

@Component({
  selector: 'app-viewresult',
  templateUrl: './viewresult.component.html',
  styleUrls: ['./viewresult.component.scss'],
  standalone: false,
})
export class ViewresultComponent {
  submission: any | undefined = undefined;

  resultColor = 'black';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private location: Location,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.route.queryParams.subscribe(async (data: any) => {
      console.log(data);

      this.loadSubmission(data.examType, data.examId, data.submissionId);
    });
  }

  loadSubmission(examType: string, examId: string, submissionId: string) {
    let options = {
      headeres: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      params: {
        examType: examType,
        examId: examId,
        submissionId: submissionId,
      },
    };

    this.http
      .get(
        Params.SERVICE_BASE_URL +
          Params.EXAM_SERVICE_URL_SUFFIXS.GET_SUBMISSION,
        options,
      )
      .subscribe({
        next: (value: any) => {
          console.log(value);

          this.submission = value.result;
        },
        error: (err) => {
          alert("Can't get submission details!");
        },
      });
  }

  getMarksObtained(): number {
    let marks = 0;
    let isNegtiveMarking = this.submission?.examDetails.negativeMarking;

    this.submission?.questions.forEach((element: any) => {
      if (element.user_ans) {
        switch (element.answer_type) {
          case 'options':
            if (element.user_ans == element.answer_content.correct_answer) {
              marks += element.marks.positive;
            } else {
              if (isNegtiveMarking && element.marks.negative) {
                marks -=
                  element.marks.negative < 0
                    ? element.marks.negative * -1
                    : element.marks.negative;
              }
            }

            break;

          case 'boolean':
            if (
              element.user_ans ==
              element.answer_content.correct_answer.toString().toLowerCase()
            ) {
              marks += element.marks.positive;
            } else {
              if (isNegtiveMarking && element.marks.negative) {
                marks -=
                  element.marks.negative < 0
                    ? element.marks.negative * -1
                    : element.marks.negative;
              }
            }

            break;

          case 'oneword':
            if (
              element.user_ans.toLowerCase() ==
              element.answer_content.correct_answer.toLowerCase()
            ) {
              marks += element.marks.positive;
            } else {
              if (isNegtiveMarking && element.marks.negative) {
                marks -=
                  element.marks.negative < 0
                    ? element.marks.negative * -1
                    : element.marks.negative;
              }
            }

            break;

          default:
            break;
        }
      }
    });

    return marks;
  }

  getResult() {
    let totalMarks = this.submission?.examDetails.totalMarks;
    let passMarks = this.submission?.examDetails.passMarks;
    let marksObtained = this.getMarksObtained();

    let percentage = ((marksObtained * 100) / totalMarks).toFixed(2) + ' %';

    if (marksObtained >= passMarks) {
      this.resultColor = '#51a41c';
    } else {
      this.resultColor = '#c91717';
    }

    return marksObtained >= passMarks
      ? percentage + ' ' + 'Pass'
      : percentage + ' ' + 'Fail';
  }

  getExamDate() {
    let date = new Date(this.submission?.submittionDetails.date);

    return (
      date.getDate() +
      '/' +
      (date.getMonth() + 1) +
      '/' +
      date.getFullYear() +
      ' @ ' +
      date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      })
    );
  }

  scrollToDiv(elementId: string) {
    const element = document.getElementById(elementId);
    if (!element) {
      console.log(`Element with id "${elementId}" not found.`);
      return;
    }
    const parentElement = element.parentElement;
    if (!parentElement) {
      console.log(
        `No parent element found for element with id "${elementId}".`,
      );
      return;
    }
    const elementRect = element.getBoundingClientRect();
    const parentRect = parentElement.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const parentY = parentRect.top + scrollY;
    const elementY = elementRect.top + scrollY;
    const offset = elementY - parentY;
    parentElement.scrollTo({
      top: offset,
      behavior: 'smooth',
    });
    element.focus();
  }

  printResult() {
    print();
  }

  share() {
    if (navigator.share) {
      navigator
        .share({
          url: window.location.href,
        })
        .then(() => console.log('URL shared successfully.'))
        .catch((error) => console.error('Error sharing URL:', error));
    } else {
      console.warn('Web Share API not supported.');
    }
  }

  showInfo() {
    alert(
      'Info : \n' +
        'Exam Id : ' +
        this.submission?.examDetails.examId +
        '\n' +
        'Submission Id : ' +
        this.submission?._id,
    );
  }

  goHome() {
    this.router.navigate([Params.PageNames.home]);
  }

  toogleHeader(element: HTMLDivElement) {
    element.classList.toggle('inactive');
  }

  getAlphabet(index: number): string {
    let alphabets = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ];

    return alphabets[index];
  }
}
