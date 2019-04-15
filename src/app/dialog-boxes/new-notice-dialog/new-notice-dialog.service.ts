/* Angular Imports */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
/* HTTP Options - required for POST requests */
const httpOptions = {
  headers: new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token'
    }
  )
};

@Injectable()
export class NewNoticeDialogService {

  constructor(private http: HttpClient) {}

  private noticesAPI = "api/noticesdata";

  // Add notice to notice board
  addNotice(userType, message){
    console.log('add notice - service');
    return this.http.post(this.noticesAPI + "/addnotice?userType=" +
      userType + "&message=" + message, httpOptions);
  }
}
