/* Angular Imports */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
/* HTTP Options - required for PUT requests */
const httpOptions = {
  headers: new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token'
    }
  )
};

@Injectable()
export class EditClassDialogService {

  constructor(private http: HttpClient) {
  }

  private classAPI = "api/classdata";

  saveChanges(id, name, desc, focus, diff){
    return this.http.put(this.classAPI + "/updateclassinfo?id=" + id
      + "&name=" + name + "&desc=" + desc + "&focus=" + focus + "&diff=" + diff, httpOptions);
  }
}
