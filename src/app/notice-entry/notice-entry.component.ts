import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NoticeEntry} from "../noticeEntry";
import * as moment from "moment/moment";

@Component({
  selector: 'notice-entry',
  templateUrl: 'notice-entry.component.html',
  styleUrls: ['notice-entry.component.css']
})

export class NoticeEntryComponent implements OnInit {
  // Input
  @Input() noticeEntry: NoticeEntry;
  @Input() userType;
  // Output
  @Output() deleteNotice: EventEmitter<any> = new EventEmitter<any>();
  @Output() approveNotice: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
    this.noticeEntry.dateTime = moment(this.noticeEntry.dateTime).format("ddd Do MMM, HH:mm");
  }

  deleteThisNotice(){
    this.deleteNotice.emit(this.noticeEntry.id);
  }

  approveThisNotice(){
    this.approveNotice.emit(this.noticeEntry.id);
  }
}
