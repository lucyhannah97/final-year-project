/* Angular Imports */
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
/* Services */
import { DeleteSessionDialogService } from "./delete-session-dialog.service";
/* Dialog Data */
import { DeleteSessionDialogData } from "../../page-section/page-section.component";

@Component({
  selector: 'delete-session-dialog',
  templateUrl: 'delete-session-dialog.component.html',
  styleUrls: ['../dialog-boxes.css'],
  providers: [ DeleteSessionDialogService ]
})

export class DeleteSessionDialogComponent {
  // Variables
  hasDeleted: boolean = false;      // Boolean var - whether session has been deleted from the database or not

  constructor(public dialogRef: MatDialogRef<DeleteSessionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DeleteSessionDialogData,
              private deleteSessionDialogService: DeleteSessionDialogService) {}

  // Close dialog if user clicks outside of it
  onNoClick(): void {
    this.dialogRef.close();
  }

  // Delete the session, giving a reason for deleting
  deleteSession(bookingId, message){
    this.deleteSessionDialogService.deleteSession(bookingId).subscribe(data => {
      this.hasDeleted = true;
      // this.notifyUsers(bookingId, message);
      console.log("DELETE request successful", this.hasDeleted);
      this.dialogRef.close();
    }, error => {
      console.log("An error occurred", error);
      this.dialogRef.close();
    });
  }

  // Notify users who were attending the session that it has been deleted
  notifyUsers(bookingId, message){
    this.deleteSessionDialogService.getUsers(bookingId).subscribe(data => {
      console.log(data);
    });
  }
}
