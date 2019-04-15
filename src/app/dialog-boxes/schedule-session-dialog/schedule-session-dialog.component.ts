/* Angular Imports */
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
/* Services */
import { ScheduleSessionDialogService}  from "./schedule-session-dialog.service";
/* Dialog Data & Data Formatting */
import * as moment from "moment/moment";
import { ScheduleSessionDialogData } from "../../home/home.component";

@Component({
  selector: 'schedule-session-dialog',
  templateUrl: 'schedule-session-dialog.component.html',
  styleUrls: ['../dialog-boxes.css'],
  providers: [ ScheduleSessionDialogService ]
})

export class ScheduleSessionDialogComponent {

  userType;                             // User Type of user currently logged in

  classSelected;                        // Class selected (name of class)
  rooms = [];                           // List of possible rooms session can take place in
  roomSelected;                         // Room selected for session to take place
  timeSelected;                         // Time selected for session to take place (from list of possible times)
  dateInput = "";                       // Value entered for date session will take place
  maxCapacity = "";                     // Max capacity for session
  frequencySelected;                    // Frequency selected for the session (one-off, weekly or fortnightly)
  trainers;                             // List of trainers to choose from who can take the session
  trainerSelected;                      // ID of trainer selected to take session

  // Possible times a class can take place (6 possible sessions per day)
  possibleTimes = ["10:00", "11:00", "13:00", "14:00", "17:00", "18:00"];
  occupiedDays = [];                    // List of days selected room is occupied
  occupiedTimes;                        // List of times selected room is occupied on selected date
  noTimesAvailable = false;             // Boolean var - whether or not there are any sessions available on the date selected for the room selected

  constructor(public dialogRef: MatDialogRef<ScheduleSessionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ScheduleSessionDialogData,
              private scheduleSessionDialogService: ScheduleSessionDialogService) {
    this.userType = window.sessionStorage.getItem("Type");
  }

  // Close modal if user clicks outside of it
  onNoClick(): void {
    this.dialogRef.close();
  }

  // Return the rooms to choose from based on the class selected
  // If the class has a specified room requirement, that is the only option
  // If no room specified they can select from all rooms except for 'Pool'
  returnRoom(): void {
    this.rooms = [];
    this.dateInput = "";
    this.timeSelected = "";
    this.resetPossibleTimes();
    this.maxCapacity = "";

    // If room requirement is specified for a class, return that room
    // Else return all other rooms, apart from pool
    // Unless specified, a class should not take place in the pool as it is not water-based
    for(let i=0; i<this.data.classes.length; i++){
      if(this.classSelected == this.data.classes[i].id){
        if(this.data.classes[i].roomReq != ""){
          for(let j = 0; j < this.data.rooms.length; j++){
            if(this.data.rooms[j].name == this.data.classes[i].roomReq){
              this.rooms = [this.data.rooms[j]];
            }
          }
        }
        else{
          this.rooms = this.removePool();
        }
      }
    }
  }

  // Remove the room 'Pool' from the list of rooms to choose from
  // Unless the Pool is the required room, another class cannot take place in the pool (as they are not water-based activities)
  removePool(): any[] {
    let possibleRooms = [];
    for(let i=0; i<this.data.rooms.length; i++){
      if(this.data.rooms[i].name != 'Pool'){
        possibleRooms.push(this.data.rooms[i]);
      }
    }
    return possibleRooms;
  }

  // Return the times the room selected is available
  returnTimesAvailable(): void {
    this.getMaxCapacity();
    this.dateInput = "";
    this.timeSelected = "";
    this.resetPossibleTimes();

    this.scheduleSessionDialogService.getOccupiedTimeSlots(this.roomSelected.id).subscribe(result => {
      this.occupiedTimes = result;
      if(this.occupiedTimes.length > 0){
        this.setOccupiedDays();
      }
    });
  }

  // Reset the list of possible times a class can take place
  resetPossibleTimes(): void {
    this.possibleTimes = ["10:00", "11:00", "13:00", "14:00", "17:00", "18:00"];
  }

  // Get the maximum capacity for a class (based on the room selected for it to take place in)
  getMaxCapacity(): void {
    for(let i=0; i < this.rooms.length; i++){
      if(this.rooms[i].id == this.roomSelected.id){
        this.maxCapacity = this.rooms[i].maxCapacity;
      }
    }
  }

  // Set occupied days
  // List of days where the room already has a session booked in
  setOccupiedDays(): void {
    this.occupiedDays = [];
    for(let i = 0; i < this.occupiedTimes.length; i++){
      let occupiedDay = moment(this.occupiedTimes[i].dateTime).format("ddd Do MMM");
      if(!(this.occupiedDays.includes(occupiedDay))){
        this.occupiedDays.push(occupiedDay);
      }
    }
  }

  // Remove occupied slots
  // For the date selected, remove the occupied slots from the list of possible times a class can take place in that room
  removeOccupiedSlots(): void {
    this.resetPossibleTimes();
    this.timeSelected = '';
    this.noTimesAvailable = false;

    for(let j=0; j<this.occupiedDays.length; j++){
      // Format date input
      let date = moment(this.dateInput).format("ddd Do MMM");
      // If date selected has an occupied session (the date is included in 'occupiedDays' list)
      if(date == this.occupiedDays[j]){
        // For each time the room is occupied
        for(let i = 0; i < this.occupiedTimes.length; i++) {
          // Format the date
          let occupiedDate = moment(this.occupiedTimes[i].dateTime).format("ddd Do MMM");
          // Compare the occupied date to the date selected
          if(occupiedDate == date){
            // Format the occupied time
            let occupiedTime = moment(this.occupiedTimes[i].dateTime).format("HH:mm");
            // If the occupied time is included in the list of possible times to choose from
            if (this.possibleTimes.includes(occupiedTime)) {
              // Get the index of this time in the possible times list
              const index = this.possibleTimes.indexOf(occupiedTime, 0);
              if (index > -1) {
                // Remove the occupied time from the list of possible times
                this.possibleTimes.splice(index, 1);
              }
            }
          }
        }
        // If there are no possible times left available on that date (the room is occupied for all sessions that day)
        if(this.possibleTimes.length == 0){
          this.noTimesAvailable = true;       // No times available on that date
        }
      }
    }
  }

  // If the user is an administrator, they need to select the trainer who will be taking the session
  getTrainers(){
    let dateTime = moment(this.dateInput).format("YYYY-MM-DD") + "T" + this.timeSelected + ":00.000";
    this.scheduleSessionDialogService.getTrainers(dateTime).subscribe(result => {
      this.trainers = result;
      console.log(this.trainers);
    });
  }

  // Schedule a new occurrence of this class
  scheduleClass(): void {
    // Format date & time selected so it's in correct format for database
    let dateTime = moment(this.dateInput).format("YYYY-MM-DD") + "T" + this.timeSelected + ":00.000";
    let trainerId = 0;
    if(this.userType == 'admin'){
      trainerId = this.trainerSelected;
    }
    else {
      trainerId = this.data.trainerId;
    }
    if(this.frequencySelected == 1){
      this.scheduleSessionDialogService.scheduleClass(this.classSelected, trainerId,
        this.roomSelected.id, dateTime).subscribe(result => {
        console.log('New session scheduled');
        this.dialogRef.close();
      } , error => {
        console.log("An error occurred", error);
        this.dialogRef.close();
      });
    }
    else if(this.frequencySelected == 2){
      for(let i=0; i < 4; i++){
        let newDate = moment(this.dateInput).add(i*7, 'days');
        let dateTime = moment(newDate).format("YYYY-MM-DD") + "T" + this.timeSelected + ":00.000";
        this.scheduleSessionDialogService.scheduleClass(this.classSelected, trainerId,
          this.roomSelected.id, dateTime).subscribe(result => {
          console.log('New session scheduled');
          if(i == 3){
            this.dialogRef.close();
          }
        });
      }
    }
    else if(this.frequencySelected == 3){
      for(let i=0; i < 4; i++){
        let newDate = moment(this.dateInput).add(i*14, 'days');
        let dateTime = moment(newDate).format("YYYY-MM-DD") + "T" + this.timeSelected + ":00.000";
        this.scheduleSessionDialogService.scheduleClass(this.classSelected, trainerId,
          this.roomSelected.id, dateTime).subscribe(result => {
          console.log('New session scheduled');
          if(i == 3){
            this.dialogRef.close();
          }
        });
      }
    }
  }
}
