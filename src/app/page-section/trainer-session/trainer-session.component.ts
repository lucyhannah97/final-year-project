import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from "moment/moment";

@Component({
  selector: 'trainer-session',
  templateUrl: 'trainer-session.component.html',
  styleUrls: ['trainer-session.component.css']
})

export class TrainerSessionComponent implements OnInit {
  // Input
  @Input() trainerSession;
  @Input() userType;
  // Output
  @Output() deleteSession: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  // Function called when component initialised
  ngOnInit(): void {
    this.trainerSession.dateTime = moment(this.trainerSession.dateTime).format("ddd Do MMM, HH:mm");
  }

  // Send data to parent component - to delete the session selected
  sendData(bookingId) {
    this.deleteSession.emit({bookingId});
  }
}
