import { Component, Inject, signal, WritableSignal } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { NavigationService } from '../services/navigation.service';
import { Test } from '../TestsParams';
import { Params } from '../Params';
import { NavigationExtras, Router } from '@angular/router';
import { UserDetails } from '../UserDetails';
import { provideIcons } from '@ng-icons/core';
import { lucideGrid, lucideList, lucideChevronLeft, lucideChevronRight, lucideChevronDown } from '@ng-icons/lucide';

export interface DialogData {
  test: any;
}

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss'],
  standalone: false,
  providers: [
    provideIcons({ lucideGrid, lucideList, lucideChevronLeft, lucideChevronRight, lucideChevronDown })
  ]
})
export class TestsComponent {
  isLoading: WritableSignal<boolean> = signal(false);
  isGridView = signal(true);
  currentPage = signal(1);
  pageSize = signal(10);
  totalItems = signal(0);
  totalPages = signal(0);
  searchTerm = signal('');
  sortBy = signal('date');

  isSearching: WritableSignal<boolean> = signal(false);

  showCompleted: WritableSignal<boolean> = signal(true);

  tests: Test[] = [];
  allTests: Test[] = [];

  incomletedTests: Test[] = [];

  searchResult: Test[] = [];

  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    private router: Router,
  ) {
    this.loadTests();
  }

  loadTests() {
    this.isLoading.set(true);

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };

    const options: any = {
      headers: headers,
    };

    this.http
      .get(
        Params.SERVICE_BASE_URL +
          Params.EXAM_SERVICE_URL_SUFFIXS.GET_ACTIVE_TESTS,
        options,
      )
      .subscribe({
        next: (result: any) => {
          this.allTests = result.result;
          
          this.updateDisplayedTests();

          this.isLoading.set(false);
        },
        error: (error: any) => {
          this.isLoading.set(false);

          console.log(error);
          alert("Can't load tests, please try again after sometime.");
        },
      });
  }

  updateDisplayedTests() {
    let sourceList = this.allTests;

    // 1. Handle Filtering (Show Completed or not)
    if (!this.showCompleted()) {
      sourceList = sourceList.filter(
        (element: any) => this.checkIfTestCompleted(element._id) == false
      );
    }

    // 2. Handle Search
    if (this.searchTerm() !== '') {
      sourceList = sourceList.filter((element) =>
        element.title.toLowerCase().includes(this.searchTerm().toLowerCase())
      );
    }

    // 3. Handle Sorting
    sourceList = [...sourceList].sort((a, b) => {
      if (this.sortBy() === 'title') {
        return a.title.localeCompare(b.title);
      } else if (this.sortBy() === 'marks') {
        return b.marks - a.marks; // High to low
      } else if (this.sortBy() === 'time') {
        return a.time - b.time; // Short to long
      } else if (this.sortBy() === 'date') {
        const dateA = a.details?.added_on ? new Date(a.details.added_on).getTime() : 0;
        const dateB = b.details?.added_on ? new Date(b.details.added_on).getTime() : 0;
        return dateB - dateA; // Newest first
      }
      return 0;
    });

    // 4. Update Pagination Stats
    this.totalItems.set(sourceList.length);
    this.totalPages.set(Math.ceil(sourceList.length / this.pageSize()));
    
    // Ensure current page is valid
    if (this.currentPage() > this.totalPages() && this.totalPages() > 0) {
      this.currentPage.set(this.totalPages());
    }

    // 5. Handle Pagination
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    
    const paginatedList = sourceList.slice(startIndex, endIndex);
    
    this.tests = paginatedList;

    if (this.searchTerm() !== '') {
      this.searchResult = paginatedList;
    } else {
      this.searchResult = [];
    }

    if (!this.showCompleted()) {
      this.incomletedTests = paginatedList;
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      this.updateDisplayedTests();
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.updateDisplayedTests();
    }
  }

  doSearch(e: any) {
    let searchValue = e.target.value;
    this.searchTerm.set(searchValue);
    this.currentPage.set(1); // Reset to page 1 on search
    
    if (searchValue == '') {
      this.isSearching.set(false);
    } else {
      this.isSearching.set(true);
    }
    
    this.updateDisplayedTests();
  }

  onSortChange(e: any) {
    this.sortBy.set(e.target.value);
    this.updateDisplayedTests();
  }

  getSortLabel() {
    switch(this.sortBy()) {
      case 'date': return 'Date Added';
      case 'title': return 'Title';
      case 'marks': return 'Highest Marks';
      case 'time': return 'Time Limit';
      default: return 'Date Added';
    }
  }

  setSort(val: string) {
    this.sortBy.set(val);
    this.updateDisplayedTests();
  }

  filterIncompletedTests() {
    this.incomletedTests = this.tests.filter(
      (element: any) => this.checkIfTestCompleted(element._id) == false,
    );
  }

  checkIfTestCompleted(testId: string): Boolean {
    let tests = UserDetails.Submission?.filter(
      (element: any) => element.examDetails.examType == 'test',
    );

    for (let i = 0; i < tests?.length; i++) {
      if (tests[i].examDetails.examId == testId) {
        return true;
      }
    }

    return false;
  }

  getTestTime(withoutTime: Boolean, seconds: number): string {
    if (withoutTime || seconds == 0) return 'No time';
    else return this.changeSecondsToTime(seconds);
  }

  changeSecondsToTime(seconds: number): string {
    seconds = Number(seconds);

    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor((seconds % 3600) % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours') : '0 hour, ';
    var mDisplay = m > 0 ? m + (m == 1 ? ' minute' : ' minutes') : '';
    //var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

    return hDisplay + mDisplay;
  }

  openTestDetails(test: Test) {
    let dialogRef = this.dialog.open(TestDetailsDialog, {
      width: '45%',
      height: 'fit-content',
      panelClass: ['dialog'],

      data: { test },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      if (result && result.result) {
        let navigationExtras: NavigationExtras = {
          queryParams: {
            examType: 'test',
            id: test._id,

            user_email: UserDetails.Email,
            user_password: UserDetails.Password,
          },
        };

        this.router.navigate([Params.PageNames.exam], navigationExtras);
      }
    });
  }
}

@Component({
  selector: 'testdetailsdialog-dialog',
  template: `
    <div
      style="text-align: start; font-family: 'Poppins-Bold'; font-size: 24px; color: black; 
              padding-left: 20px; padding-right: 20px; margin-top: 20px;"
    >
      {{ data.test.title }}
    </div>
    <div
      style="text-align: start; margin-top: 10px; font-family: Poppins-Regular; font-size: 14px;
              padding-left: 20px; padding-right: 20px;"
    >
      {{ data.test.description }}
    </div>
    <div style="display: flex; justify-content: center; flex-flow: column;">
      <div
        style="text-align: center; margin-top: 20px; display: flex; flex-flow: column; width: fit-content; text-align: start; gap: 10px; background: #9b9b9b38;
                             padding: 15px 15px; border-radius: 10px; margin-left: 15px; margin-right: 15px; overflow-x: auto; width: auto;"
      >
        <span style="font-family: Poppins-Regular; font-size: 14px;"
          ><span
            style="font-family: monospace; background: #cdcdcd;
                   padding: 4px 8px; border-radius: 4px;"
            >Questions count</span
          >&nbsp;&nbsp;{{ data.test.questions.length }}&nbsp;questions</span
        >
        <span style="font-family: Poppins-Regular; font-size: 14px;"
          ><span
            style="font-family: monospace; background: #cdcdcd;
                   padding: 4px 8px; border-radius: 4px;"
            >Time</span
          >&nbsp;&nbsp;{{
            getTestTime(data.test.is_without_time, data.test.time)
          }}</span
        >
        <span style="font-family: Poppins-Regular; font-size: 14px;"
          ><span
            style="font-family: monospace; background: #cdcdcd;
                   padding: 4px 8px; border-radius: 4px;"
            >Marks</span
          >&nbsp;&nbsp;{{ data.test.marks }}&nbsp;marks</span
        >
      </div>
    </div>
    <div
      style="text-align: center;
                          padding: 15px;
                          margin-top: 25px;
                          font-family: Poppins-Regular; color: white; display: flex; justify-content: space-around; gap: 15px;"
    >
      <button
        style="width: 50%; height: 40px; border-radius: 10px; border: 1px solid black; font-family: 'Poppins-Medium';"
        (click)="close()"
      >
        Close
      </button>
      <button
        style="width: 50%; height: 40px; border-radius: 10px; border: 1px solid black; font-family: 'Poppins-Medium'; background: #68de79"
        (click)="done()"
      >
        Start
      </button>
    </div>
  `,
  standalone: true,
})
export class TestDetailsDialog {
  constructor(
    public dialogRef: MatDialogRef<TestDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private navigationService: NavigationService,
  ) {}

  close() {
    this.dialogRef.close({
      result: false,
    });
  }

  done() {
    this.dialogRef.close({
      result: true,
    });
  }

  getTestTime(withoutTime: Boolean, seconds: number): string {
    if (withoutTime || seconds == 0) return 'No time';
    else return this.changeSecondsToTime(seconds);
  }

  changeSecondsToTime(seconds: number): string {
    seconds = Number(seconds);

    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor((seconds % 3600) % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours') : '0 hour, ';
    var mDisplay = m > 0 ? m + (m == 1 ? ' minute' : ' minutes') : '';
    //var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

    return hDisplay + mDisplay;
  }
}
