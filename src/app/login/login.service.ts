import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class LoginService {

  public currentUserValue;
  public currentUserType;
  public currentUserId;

  constructor(private http: HttpClient) {
    // console.log(this.currentUserValue);
  }

  private loginAPI = "api/logindata";

  login(userType: string, email: string, password: string) {
    return this.http.get(this.loginAPI + "/verifyuser?type=" + userType
      + "&email=" + email + "&pword=" + password);
  }

  logout(){
    this.currentUserValue = false;
  }
}
