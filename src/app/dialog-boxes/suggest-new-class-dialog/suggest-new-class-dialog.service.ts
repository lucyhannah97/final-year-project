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
export class SuggestNewClassDialogService {

  constructor(private http: HttpClient) {}

  private classAPI = "api/classdata";

  // Suggest new class
  suggestClass(title, desc, focus, diff, approved){
    return this.http.post(this.classAPI + "/suggestclass/?title=" + title + "&desc="
    + desc + "&focus=" + focus + "&diff=" + diff + "&approved=" + approved, httpOptions);
  }
}
