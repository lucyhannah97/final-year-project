/* Angular Imports */
import { MatDialog } from "@angular/material";
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
/* Services */
import { ClassService } from "./class.service";
/* Classes */
import { Class } from "../class";
/* Components */
import { EditClassDialogComponent } from "../../dialog-boxes/edit-class-dialog/edit-class-dialog.component";

export interface EditClassDialogData {
  id;
  name;
  description;
  focus;
  difficulty;
}

@Component({
  selector: 'class',
  templateUrl: 'class.component.html',
  styleUrls: ['class.component.css'],
  providers: [ ClassService ]
})

export class ClassComponent implements OnInit {
  // Input
  @Input() class: Class;
  @Input() userType: String;
  @Input() userId: number;

  // Output
  @Output() openBookingModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() editDescription: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteClass: EventEmitter<any> = new EventEmitter<any>();
  @Output() approveClass: EventEmitter<any> = new EventEmitter<any>();

  // Other variables
  sessions;         // List of sessions available for the class

  constructor(private classService: ClassService,
              public dialog: MatDialog) {}

  // When the component initialises - get list of sessions for this class from the database
  ngOnInit() {
    this.classService.getSessions(this.class.classId, this.userId).subscribe(listOfSessions => {
      this.sessions = listOfSessions;
    });
  }

  // Open the booking modal for this class (passed as classId)
  sendData(classId){
    this.openBookingModal.emit(classId);
  }

  // Open edit description dialog box - for trainers and admins, to edit details of a class
  editDescriptionDialog(){
    const dialogRef = this.dialog.open(EditClassDialogComponent, {
      width: '600px',
      data: {id: this.class.classId, name: this.class.className,
        description: this.class.classDesc, focus: this.class.focus,
        difficulty: this.class.difficulty}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.editDescription.emit();
      }
    });
  }

  // Delete this class (passed as classId)
  deleteClassRequest(classId){
    this.deleteClass.emit(classId);
  }

  // Approve this class (passed as classId)
  approveClassRequest(classId){
    this.approveClass.emit(classId);
  }
}
