/* Angular Imports */
import { Component } from '@angular/core';
import { MatDialogRef } from "@angular/material";
/* Services */
import { SuggestNewClassDialogService } from "./suggest-new-class-dialog.service";

@Component({
  selector: 'suggest-new-class-dialog',
  templateUrl: 'suggest-new-class-dialog.component.html',
  styleUrls: ['../dialog-boxes.css'],
  providers : [ SuggestNewClassDialogService ]
})

export class SuggestNewClassDialogComponent {
  // Variables
  focusSelected;              // Focus selected for new class (from list of options available)
  difficultySelected;         // Difficulty selected for new class (from list of options available)

  constructor(public dialogRef: MatDialogRef<SuggestNewClassDialogComponent>,
              private suggestNewClassDialogService: SuggestNewClassDialogService) {}

  // Close modal if user clicks outside of it
  onNoClick(): void {
    this.dialogRef.close();
  }

  // Suggest new class
  suggestClass(title, desc, focus, diff): void {
    // If any of the fields are blank, display error message
    if(title == '' || desc == '' || focus == '' || diff == ''){
      document.getElementById('error-message').classList.remove('hide');
    }
    else {  // All fields have been completed
      let approved = 0;           // Suggestion requires approval by default (if trainer makes the suggestion)
      let userType = window.sessionStorage.getItem("Type");
      if(userType == 'admin'){    // If user is an admin
        approved = 1;             // Suggestion automatically approved
      }
      this.suggestNewClassDialogService.suggestClass(title, desc, focus, diff, approved).subscribe(result => {
        console.log("POST request successful", result);
        this.dialogRef.close();
      }, error => {
        console.log("An error occurred", error);
        this.dialogRef.close();
      });
    }
  }
}
