/* Angular Imports */
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
/* Services */
import { NewNoticeDialogService } from "./new-notice-dialog.service";
/* Dialog Data */
import { NewNoticeDialogData } from "../../home/home.component";

@Component({
  selector: 'new-notice-dialog',
  templateUrl: 'new-notice-dialog.component.html',
  styleUrls: ['../dialog-boxes.css'],
  providers: [ NewNoticeDialogService ]
})

export class NewNoticeDialogComponent {
  // Variables
  message;            // Message - to be displayed on the notice

  constructor(public dialogRef: MatDialogRef<NewNoticeDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: NewNoticeDialogData,
              private newNoticeDialogService: NewNoticeDialogService) {}

  // Close modal if user clicks outside of it
  onNoClick(): void {
    this.dialogRef.close();
  }

  // Add new notice to the notice board
  addNotice(){
    this.newNoticeDialogService.addNotice(this.data.userType, this.message).subscribe(result => {
      console.log('New post sent for approval', result);
      this.dialogRef.close();
    } , error => {
      console.log("An error occurred", error);
      this.dialogRef.close();
    });

  }
}
