/* Angular Imports */
import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
/* Services */
import { BookingDialogService } from "./booking-dialog.service";
/* Dialog Data */
import { BookingDialogData } from "../../home/home.component";
/* Moment - to format dates & times */
import * as moment from "moment";

@Component({
  selector: 'booking-dialog',
  templateUrl: 'booking-dialog.component.html',
  styleUrls: ['../dialog-boxes.css'],
  providers: [ BookingDialogService ]
})

export class BookingDialogComponent {
  // Variables
  classSelected: string[];      // Class selected
  sessionSelected: string[];    // Session of class selected
  filteredSessions;             // Filtered list of all sessions only include sessions of the class selected
  numSpaces = -1;               // Number of spaces available in session selected

  constructor(public dialogRef: MatDialogRef<BookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BookingDialogData,
    private bookingDialogService: BookingDialogService) {}

  // Close modal if user clicks outside of it
  onNoClick(): void {
    this.dialogRef.close();
  }

  // Filter sessions list to only include sessions of the class the user has selected
  filterSessions(className): void {
    this.sessionSelected = [];
    this.filteredSessions = [];
    this.numSpaces = -1;

    this.filteredSessions = this.data.sessions.filter(session => session.className == className);
    for(let i=0; i<this.filteredSessions.length; i++){
      this.filteredSessions[i].dateTime = moment(this.filteredSessions[i].dateTime).format("ddd Do MMM, HH:mm");
    }
  }

  // Calculate number of spaces remaining in the class
  calculateSpaces(maxCapacity, numAttending): void {
    if(maxCapacity == numAttending){
      this.numSpaces = 0;
    }
    else if(maxCapacity > numAttending){
      this.numSpaces = maxCapacity - numAttending;
    }
  }

  // Book the class the user has selected
  bookClass(bookingId): void{
    this.bookingDialogService.bookClass(bookingId, this.data.userId).subscribe(data => {
      console.log("POST request successful", data);
      this.dialogRef.close('attending');
    }, error => {
      console.log("An error occurred", error);
      this.dialogRef.close('attending');
    });
  }

  // Add the user to the waiting list for the class selected
  bookClassWaitingList(bookingId): void {
    this.bookingDialogService.bookClassWaitingList(bookingId, this.data.userId).subscribe(data => {
      console.log("POST request successful", data);
      this.dialogRef.close('waiting');
    }, error => {
      console.log("An error occurred", error);
      this.dialogRef.close('waiting');
    });
  }
}
