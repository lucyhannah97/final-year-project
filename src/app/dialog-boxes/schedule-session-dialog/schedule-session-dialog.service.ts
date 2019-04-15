/* Angular Imports */
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
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
export class ScheduleSessionDialogService {

  constructor(private http: HttpClient) {}

  private bookingAPI = "api/bookingdata";

  // Get time slots a room is occupied
  getOccupiedTimeSlots(roomId){
    return this.http.get(this.bookingAPI + "/getoccupiedtimeslots/" + roomId);
  }

  // Get trainers available at a certain time on a specified date
  getTrainers(dateTime){
    return this.http.get(this.bookingAPI + "/gettrainers/" + dateTime);
  }

  // Schedule a class
  scheduleClass(classId, trainerId, roomId, dateTime) {
    return this.http.post(this.bookingAPI + "/schedulesession/?classId=" + classId +
      "&trainerId=" + trainerId + "&roomId=" + roomId + "&dateTime=" + dateTime,
      httpOptions);
  }
}
