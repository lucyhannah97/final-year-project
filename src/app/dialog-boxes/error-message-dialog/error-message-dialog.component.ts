/* Angular Imports */
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
/* Dialog Data */
import { ErrorMessageDialogData } from "../../login/login.component";

@Component({
  selector: 'error-message-dialog',
  templateUrl: 'error-message-dialog.component.html',
  styleUrls: ['../dialog-boxes.css']
})

export class ErrorMessageDialogComponent {
  constructor(public dialogRef: MatDialogRef<ErrorMessageDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ErrorMessageDialogData) {
  }

  // Close modal if user clicks outside of it
  onNoClick(): void {
    this.dialogRef.close();
  }
}
