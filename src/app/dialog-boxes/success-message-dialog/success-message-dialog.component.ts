/* Angular Imports */
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
/* Dialog Data */
import { SuccessMessageDialogData } from "../../home/home.component";

@Component({
  selector: 'success-message-dialog',
  templateUrl: 'success-message-dialog.component.html',
  styleUrls: ['../dialog-boxes.css']
})

export class SuccessMessageDialogComponent {
  constructor(public dialogRef: MatDialogRef<SuccessMessageDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: SuccessMessageDialogData) {}

  // Close modal if user clicks outside of it
  onNoClick(): void {
    this.dialogRef.close();
  }
}
