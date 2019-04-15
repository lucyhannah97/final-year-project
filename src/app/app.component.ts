import {Component, OnInit} from '@angular/core';
import {AppService} from "./app.service";
import {LoginService} from "./login/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ AppService ]
})

export class AppComponent implements OnInit {

  loggedIn;

  constructor(private loginService: LoginService, private router: Router) {
    // this.loggedIn = this.loginService.currentUserValue;
    this.loggedIn = window.sessionStorage.getItem("Logged in");
  }

  ngOnInit(): void {}

  logout(): void {
    console.log('log out');
    let icon = document.getElementById('menu-icon');
    icon.classList.remove('show');
    window.sessionStorage.clear();
    this.loginService.logout();
    this.router.navigate(['login']);
  }

  changePassword(): void {

  }

}



