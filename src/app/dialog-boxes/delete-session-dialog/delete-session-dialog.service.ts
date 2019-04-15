/* Angular Imports */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
/* HTTP Options - required for DELETE requests */
const httpOptions = {
  headers: new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token'
    }
  )
};

@Injectable()
export class DeleteSessionDialogService {

  constructor(private http: HttpClient) {}

  private bookingAPI = "api/bookingdata";

  // Delete session
  deleteSession(bookingId) {
    return this.http.delete(this.bookingAPI + "/deletesession/" + bookingId, httpOptions);
  }

  // Get list of users attending the session to be deleted
  getUsers(bookingId) {
    return this.http.get(this.bookingAPI + "/getusers/" + bookingId);
  }


}
