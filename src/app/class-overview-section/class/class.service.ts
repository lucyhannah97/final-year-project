/* Angular Imports */
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class ClassService {

  constructor(private http: HttpClient) {}

  private bookingAPI = "api/bookingdata";

  getSessions(classId, userId) {
    return this.http.get(this.bookingAPI + "/getsessions/?classId=" + classId
    + "&userId=" + userId);
  }
}
