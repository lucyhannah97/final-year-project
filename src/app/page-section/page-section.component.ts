import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PageSectionService} from "./page-section.service";
import {MatDialog} from "@angular/material";
import {DeleteBookingDialogComponent} from "../dialog-boxes/delete-booking-dialog/delete-booking-dialog.component";
import {DeleteSessionDialogComponent} from "../dialog-boxes/delete-session-dialog/delete-session-dialog.component";
// import {TrainerSession} from "./trainerSession";

export interface DeleteBookingDialogData {
  bookingId: number;
  waiting: boolean;
  userId: number;
}

export interface DeleteSessionDialogData {
  bookingId: number;
  userId: number;
}

@Component({
  selector: 'page-section',
  templateUrl: 'page-section.component.html',
  styleUrls: ['page-section.component.css'],
  providers: [PageSectionService]
})

export class PageSectionComponent implements OnInit {
  @Input() userSessions;
  @Input() userWaiting;
  @Input() hasSessions;

  @Input() userType;
  @Input() userId;

  @Input() trainerSessions;

  @Output() reloadBookings: EventEmitter<any> = new EventEmitter<any>();
  @Output() reloadWaitings: EventEmitter<any> = new EventEmitter<any>();
  @Output() reloadSessions: EventEmitter<any> = new EventEmitter<any>();
  @Output() reloadTrainerSessions: EventEmitter<any> = new EventEmitter<any>();

  bookingId;

  trainersList: string[] = [];
  trainerSelected = 'All';
  gotTrainers = false;

  roomList: string[] = [];
  roomSelected = 'All';
  gotRooms = false;

  filteredResults;


  constructor(private pageSectionService: PageSectionService,
              public dialog: MatDialog) {}

  ngOnInit(): void {
    // this.filteredResults = this.trainerSessions;
    // // console.log(this.filteredResults);
    // if(this.userType == 'admin'){
    //   for(let i=0; i<this.filteredResults.length;){
    //     if(!(this.trainersList.includes(this.filteredResults[i].trainerName))){
    //       this.trainersList.push(this.filteredResults[i].trainerName);
    //     }
    //     if(!(this.roomList.includes((this.filteredResults[i].roomName)))){
    //       this.roomList.push(this.filteredResults[i].roomName);
    //     }
    //   }
    //   this.gotTrainers = true;
    //   this.gotRooms = true;
    //
    //   // this.getTrainers();
    //   // this.getRooms();
    // }
  }

  // getTrainers(): void {
  //   // this.pageSectionService.getTrainers().subscribe(result => {
  //   //   this.trainersList = result;
  //   //   this.trainersList.push('All');
  //   //   this.gotTrainers = true;
  //   // });
  //
  // }

  // getRooms(): void {
  //   // this.pageSectionService.getRooms().subscribe(result => {
  //   //   this.roomList = result;
  //   //   this.roomList.push('All');
  //   //   this.gotRooms = true;
  //   // });
  // }

  deleteBooking(booking) {
    const dialogRef = this.dialog.open(DeleteBookingDialogComponent, {
      width: '500px',
      data: {bookingId: booking.bookingId, waiting: booking.waiting, userId: this.userId}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result == 'waiting'){
        this.reloadWaitings.emit();
      }
      else if(result == 'attending'){
        this.reloadBookings.emit();
      }
      this.reloadSessions.emit();
      console.log('The dialog was closed');
    });
  }

  deleteSession(booking){
    // Open dialog to confirm deletion
    // Send email to all attendees of the session (if they exist) - give message/reason

    const dialogRef = this.dialog.open(DeleteSessionDialogComponent, {
      width: '500px',
      data: {bookingId: booking.bookingId, userId: this.userId}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('delete session dialog closed');
      this.reloadTrainerSessions.emit();
    //   if(result == 'waiting'){
    //     this.reloadWaitings.emit();
    //   }
    //   else if(result == 'attending'){
    //     this.reloadBookings.emit();
    //   }
    //   this.reloadSessions.emit();
    //   console.log('The dialog was closed');
    });
  }

  // filterResults(): void {
  //   console.log('filtering results');
  //   console.log(this.trainerSelected);
  //   console.log(this.roomSelected);
  //   this.filteredResults = [];
  //
  //   for(let i=0; i<this.trainerSessions.length; i++){
  //     if(this.trainerSessions[i].trainerName == this.trainerSelected || this.trainerSelected == 'All'){
  //   //
  //   //     for(let i=0; i<this.trainerSessions.length; i++){
  //         if(this.trainerSessions[i].roomName == this.roomSelected || this.roomSelected == 'All'){
  //           this.filteredResults.push(this.trainerSessions[i]);
  //         }
  //   //     }
  //   //
  //     }
  //   }
  //   console.log(this.filteredResults);
  //
  //
  // }
}
