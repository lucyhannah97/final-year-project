import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'user-details',
  templateUrl: 'user-details.component.html',
  styleUrls: ['user-details.component.css']
})

export class UserDetailsComponent implements OnInit {
  // Input
  @Input() userInfo;
  @Input() userType;
  @Input() loggedInUserId;
  @Input() loggedInUserType;
  // Output
  @Output() deleteUser: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  deleteThisUser() {
    this.deleteUser.emit(this.userInfo.id);
  }
}
