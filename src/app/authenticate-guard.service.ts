import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService } from "./login/login.service";

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    let currentUser;
    let currentUserType;
    let currentUserId;

    if(window.sessionStorage.getItem("Logged in") != null){
      currentUser = window.sessionStorage.getItem("Logged in");
      currentUserType = window.sessionStorage.getItem("Type");
      currentUserId = window.sessionStorage.getItem("ID");
    }
    else {
      currentUser = this.loginService.currentUserValue;
      currentUserType = this.loginService.currentUserType;
      currentUserId = this.loginService.currentUserId;
    }

    if(currentUser){
      window.sessionStorage.setItem("Logged in", currentUser);
      window.sessionStorage.setItem("Type", currentUserType);
      window.sessionStorage.setItem("ID", currentUserId);
      return true;
    }
    else {
      this.router.navigate(['login'], {
        queryParams: {return: state.url}
      });
      return false;
    }
  }
}
