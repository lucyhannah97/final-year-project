/* Angular Imports */
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable()
export class ClassOverviewSectionService {

  constructor(private http: HttpClient) {}

  private classAPI = "api/classdata";

  getAllClasses() {
    return this.http.get(this.classAPI + "/getallclasses");
  }
}
