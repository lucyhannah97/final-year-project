/* Angular Imports */
import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
/* Services */
import { DeleteBookingDialogService } from "./delete-booking-dialog.service";
/* Dialog Data */
import { DeleteBookingDialogData } from "../../page-section/page-section.component";

@Component({
  selector: 'delete-booking-dialog',
  templateUrl: 'delete-booking-dialog.component.html',
  styleUrls: ['../dialog-boxes.css'],
  providers: [ DeleteBookingDialogService ]
})

export class DeleteBookingDialogComponent {
  // Variables
  hasDeleted: boolean = false;          // Boolean var - to stop te dialog box from closing until the booking has been deleted from database

  constructor(public dialogRef: MatDialogRef<DeleteBookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteBookingDialogData,
    private deleteBookingDialogService: DeleteBookingDialogService) {}

  // Close dialog box if user clicks outside of it
  onNoClick(): void {
    this.dialogRef.close();
  }

  // User confirms they want to delete the booking
  deleteBooking(bookingId, waiting){
    if(waiting){    // User wants to delete their spot on a waiting list
      this.deleteBookingDialogService.deleteWaiting(bookingId, this.data.userId).subscribe(data => {
        this.hasDeleted = true;
        console.log("DELETE request successful", this.hasDeleted);
        this.dialogRef.close('waiting');
      }, error => {
        console.log("An error occurred", error);
        this.dialogRef.close('waiting');
      });
    }
    else {        // User wants to delete their spot on an attending list
      this.deleteBookingDialogService.deleteBooking(bookingId, this.data.userId).subscribe(data => {
        this.hasDeleted = true;
        console.log("DELETE request successful", this.hasDeleted);
        this.dialogRef.close('attending');
      }, error => {
        console.log("An error occurred", error);
        this.dialogRef.close('attending');
      });
    }
  }
}
