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
export class BookingDialogService {

  constructor(private http: HttpClient) {}

  private bookingAPI = "api/bookingdata";

  // Book place on attending list for booking
  bookClass(bookingId, userId) {
    return this.http.post(this.bookingAPI + "/bookclass/?bookingId=" + bookingId +
      "&userId=" + userId, bookingId, httpOptions);
  }

  // Book place on waiting list for booking
  bookClassWaitingList(bookingId, userId) {
    return this.http.post(this.bookingAPI + "/bookclasswaitinglist/?bookingId=" + bookingId +
      "&userId=" + userId, bookingId, httpOptions);
  }
}
