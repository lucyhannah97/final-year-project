import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable()
export class PageSectionService {

  constructor(private http: HttpClient) {}

  private loginAPI = "api/logindata";
  private bookingAPI = "api/bookingdata";


  getTrainers() {
    return this.http.get(this.loginAPI + "/getalltrainers");
  }

  getRooms() {
    return this.http.get(this.bookingAPI + "/getallrooms");
  }


}
