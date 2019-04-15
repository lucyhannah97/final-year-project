import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ClassBooking } from "../classBooking";
import * as moment from "moment/moment";

@Component({
  selector: 'class-booking',
  templateUrl: 'class-booking.component.html',
  styleUrls: ['class-booking.component.css']
})

export class ClassBookingComponent implements OnInit {
  // Input
  @Input() classBooking: ClassBooking;
  @Input() waiting;
  @Input() userType;
  // Output
  @Output() deleteBooking: EventEmitter<any> = new EventEmitter<any>();
  // Other Variables (used for add to calendar functionality)
  startTime;
  endTime;

  constructor() {}

  // Function called when component initialised
  ngOnInit(): void {
    this.startTime = moment(this.classBooking.dateTime).format("DD/MM/YYYY HH:mm");
    this.classBooking.dateTime = moment(this.classBooking.dateTime).format("ddd Do MMM, HH:mm");
    this.endTime = moment(this.startTime).add(1, 'hour');
  }

  // Send data to parent component - to delete the booking selected
  sendData(bookingId, waiting) {
    this.deleteBooking.emit({bookingId, waiting});
  }

}
