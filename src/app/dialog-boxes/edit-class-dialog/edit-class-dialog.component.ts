/* Angular Imports */
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
/* Services */
import { EditClassDialogService } from "./edit-class-dialog.service";
/* Dialog Data */
import { EditClassDialogData } from "../../class-overview-section/class/class.component";

@Component({
  selector: 'edit-class-dialog',
  templateUrl: 'edit-class-dialog.component.html',
  styleUrls: ['../dialog-boxes.css'],
  providers: [ EditClassDialogService ]
})

export class EditClassDialogComponent {

  constructor(public dialogRef: MatDialogRef<EditClassDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: EditClassDialogData,
              private editClassService: EditClassDialogService) {}

  // Close modal if user clicks outside of it
  onNoClick(): void {
    this.dialogRef.close();
  }

  // Save changes made to class information
  saveChanges(id, name, desc, focus, diff) {
    this.editClassService.saveChanges(id, name, desc,
      focus, diff).subscribe(result => {
        if(result){
          console.log('UPDATE successful');
          this.dialogRef.close(result);
        }
        else {
          console.log('Unable to update');
        }
    });
  }
}
