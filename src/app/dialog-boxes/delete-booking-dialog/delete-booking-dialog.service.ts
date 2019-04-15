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
export class DeleteBookingDialogService {

  constructor(private http: HttpClient) {}

  private bookingAPI = "api/bookingdata";

  // Delete user from attending list for a booking
  deleteBooking(bookingId, userId) {
    return this.http.delete(this.bookingAPI + "/deletebooking/?bookingId=" + bookingId + "&userId=" + userId, httpOptions);
  }

  // Delete user from a waiting list for a booking
  deleteWaiting(bookingId, userId) {
    return this.http.delete(this.bookingAPI + "/deletewaiting/?bookingId=" + bookingId + "&userId=" + userId, httpOptions);
  }
}
