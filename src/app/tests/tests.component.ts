import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { NavigationService } from '../services/navigation.service';
import { Test } from '../TestsParams';
import { Params } from '../Params';
import { NavController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { UserDetails } from '../UserDetails';

export interface DialogData {
  test: any
}

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss']
})
export class TestsComponent {

  isLoading: boolean = false;

  isSearching: boolean = false;

  tests: Test[] = []

  searchResult: Test[] = []

  constructor(private dialog: MatDialog, private http: HttpClient, private router: Router) {

    this.loadTests()

  }

  loadTests() {

    this.isLoading = true;

    const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

    const options: any = {

      headers: headers,
      params: {},
      // responseType: 'text'

    }

    this.http.get(Params.SERVICE_BASE_URL + Params.EXAM_SERVICE_URL_SUFFIXS.GET_ACTIVE_TESTS, options).subscribe({
      next: (result: any) => {

        this.tests = result;

        this.isLoading = false;

      }, error: (error: any) => {

        this.isLoading = false;

        console.log(error);
        alert("Can't load tests, please try again after sometime.");

      }
    });

  }

  doSearch(e: any) {

    let searchValue = e.target.value;

    if (searchValue == '') {
      this.searchResult = []
      this.isSearching = false;
      return
    }

    this.isSearching = true;
    this.searchResult = this.tests.filter(element => element.title.toLowerCase().includes(searchValue.toLowerCase()))

  }

  getTestTime(withoutTime: Boolean, seconds: number): string {

    if (withoutTime || seconds == 0)
      return 'No time'
    else
      return this.changeSecondsToTime(seconds)

  }

  changeSecondsToTime(seconds: number): string {

    seconds = Number(seconds);

    var h = Math.floor(seconds / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours") : "0 hour, ";
    var mDisplay = m > 0 ? m + (m == 1 ? ", minute, " : " minutes ") : "";
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

      console.log(result)

      if (result && result.result) {

        let navigationExtras: NavigationExtras = {
          queryParams: {
            
              "examType": 'test',
              "id": test._id, 
              
              'user_email': UserDetails.Email,
              'user_password': UserDetails.Password,
              
          }
        };

        this.router.navigate([Params.PageNames.exam], navigationExtras);

      }

    });

  }

}

@Component({
  selector: 'testdetailsdialog-dialog',
  template: ` <div style="text-align: start; font-family: 'Poppins-Bold'; font-size: 24px; color: black; 
              padding-left: 20px; padding-right: 20px; margin-top: 20px;" >{{data.test.title}}</div>
              <div style="text-align: start; margin-top: 10px; font-family: Poppins-Regular; font-size: 14px;
              padding-left: 20px; padding-right: 20px;">{{data.test.description}}</div>
              <div style="display: flex; justify-content: center; flex-flow: column;">
                <div style="text-align: center; margin-top: 20px; display: flex; flex-flow: column; width: fit-content; text-align: start; gap: 10px; background: #9b9b9b38;
                             padding: 15px 15px; border-radius: 10px; margin-left: 15px; margin-right: 15px; overflow-x: auto; width: auto;">
                  <span style="font-family: Poppins-Regular; font-size: 14px;"><span style="font-family: monospace; background: #cdcdcd;
                   padding: 4px 8px; border-radius: 4px;">Questions count</span>&nbsp;&nbsp;{{data.test.questions.length}}&nbsp;questions</span>
                  <span style="font-family: Poppins-Regular; font-size: 14px;"><span style="font-family: monospace; background: #cdcdcd;
                   padding: 4px 8px; border-radius: 4px;">Time</span>&nbsp;&nbsp;{{getTestTime(data.test.is_without_time, data.test.time)}}</span>
                   <span style="font-family: Poppins-Regular; font-size: 14px;"><span style="font-family: monospace; background: #cdcdcd;
                   padding: 4px 8px; border-radius: 4px;">Marks</span>&nbsp;&nbsp;{{data.test.marks}}&nbsp;marks</span>
                </div>
              </div>
              <div style="text-align: center;
                          padding: 15px;
                          margin-top: 25px;
                          font-family: Poppins-Regular; color: white; display: flex; justify-content: space-around; gap: 15px;"  >
                          <button style="width: 50%; height: 40px; border-radius: 10px; border: 1px solid black; font-family: 'Poppins-Medium';" (click)="close()">Close</button> 
                          <button style="width: 50%; height: 40px; border-radius: 10px; border: 1px solid black; font-family: 'Poppins-Medium'; background: #68de79" (click)="done()">Start</button>  
                        </div>
              `,
  standalone: true
})

export class TestDetailsDialog {
  constructor(public dialogRef: MatDialogRef<TestDetailsDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private navigationService: NavigationService) { }

  close() {
    this.dialogRef.close({
      result: false
    });
  }

  done() {
    this.dialogRef.close({
      result: true
    });
  }

  getTestTime(withoutTime: Boolean, seconds: number): string {

    if (withoutTime || seconds == 0)
      return 'No time'
    else
      return this.changeSecondsToTime(seconds)

  }

  changeSecondsToTime(seconds: number): string {

    seconds = Number(seconds);

    var h = Math.floor(seconds / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours") : "0 hour, ";
    var mDisplay = m > 0 ? m + (m == 1 ? ", minute, " : " minutes ") : "";
    //var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";

    return hDisplay + mDisplay;

  }



}