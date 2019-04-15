import { Router } from "@angular/router";
import { MatDialog } from "@angular/material";
import { LoginService } from "./login.service";
import { Component, OnInit } from '@angular/core';
import { ErrorMessageDialogComponent } from "../dialog-boxes/error-message-dialog/error-message-dialog.component";

export interface ErrorMessageDialogData {
  message: string;
}

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})

export class LoginComponent implements OnInit {

  user;
  loading = false;

  constructor(private loginService: LoginService,
              private router: Router,
              public dialog: MatDialog) {}

  ngOnInit() {}

  // Log in function - check if user exists in database
  login(type, email, password) {
    this.loading = true;    // Display loading wheel while request is made to database
    // Check user's credentials
    this.loginService.login(type, email, password).subscribe(result => {
      this.user = result;
      if(this.user.length == 0){  // No matching user found in database
        this.loading = false;     // Hide loading wheel
        // Show error modal - incorrect credentials
        this.openErrorModal("Incorrect credentials entered. Please check your username and password, and " +
          "confirm you are logging in via the correct portal, and try again.")
      }
      else {  // User found in database
        this.loginService.currentUserValue = true;
        this.loginService.currentUserType = this.user[0].type;
        this.loginService.currentUserId = this.user[0].id;

        this.router.navigate([''])
          .then((e) => {
              if(e) {
                console.log('Navigation successful');
              }
              else {
                console.log('Navigation failed!');
              }
          });
      }
    });
  }

  // Open error modal - message to be displayed is passed as a parameter
  openErrorModal(message) {
    const dialogRef = this.dialog.open(ErrorMessageDialogComponent, {
      width: '500px',
      data: {message: message}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
