/* Angular Imports */
import { MatDialog } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
/* Services */
import { HomeService } from "./home.service";
/* Components */
import { BookingDialogComponent } from "../dialog-boxes/booking-dialog/booking-dialog.component";
import { NewNoticeDialogComponent } from "../dialog-boxes/new-notice-dialog/new-notice-dialog.component";
import { ErrorMessageDialogComponent } from "../dialog-boxes/error-message-dialog/error-message-dialog.component";
import { SuccessMessageDialogComponent } from "../dialog-boxes/success-message-dialog/success-message-dialog.component";
import { ClassOverviewSectionComponent } from "../class-overview-section/class-overview-section.component";
import { ScheduleSessionDialogComponent } from "../dialog-boxes/schedule-session-dialog/schedule-session-dialog.component";
import { SuggestNewClassDialogComponent } from "../dialog-boxes/suggest-new-class-dialog/suggest-new-class-dialog.component";

export interface BookingDialogData {
  uniqueClasses;
  sessions;
  userId;
}

export interface ScheduleSessionDialogData {
  classes;
  rooms;
  dateTimes;
  trainerId;
}

export interface NewNoticeDialogData {
  userId;
  userType;
}

export interface SuccessMessageDialogData {
  message;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ HomeService ]
})

export class HomeComponent implements OnInit {
  // Variables required
  @ViewChild( ClassOverviewSectionComponent ) classOverview: ClassOverviewSectionComponent;

  uniqueClasses;            // List of class names (unique)
  userBookings;             // List of user's bookings
  hasBookings = false;      // Boolean var - whether user has any bookings or not
  userWaiting;              // List of bookings user is on waiting list for

  notices;                  // List of all approved notices posted
  gotNotices = false;       // Boolean var - whether notices have been returned from database or not
  noticesAwaiting;          // List of all notices awaiting approval
  gotNoticeAwaiting = false;// Boolean var - whether notices awaiting approval have been returned from the database or not

  sessions;                 // List of all possible sessions the user could attend (that they are not already booked onto)
  classesAwaitingApproval;  // List of classes awaiting admin approval
  gotClassAwaiting = false; // Boolean var - whether classes awaiting approval have been returned from the database or not

  userId;                   // ID of the user currently logged in
  userType;                 // User type of the user currently logged in

  trainerSessions;          // List of sessions the trainer has scheduled
  hasSessions = false;      // Boolean var - whether trainer has scheduled any sessions or not

  classes;                  // List of all class names
  rooms;                    // List of all room names

  users;                    // List of existing gymUsers
  trainers;                 // List of existing gymTrainers
  admins;                   // List of existing administrators

  allSessions;              // List of all sessions currently scheduled
  classIds;                 // List of all class IDs
  topThreeClasses;          // Class info for the top three classes - Top 3 determined by highest number of users attending/waiting for the class
  hasTopThree = false;      // Boolean var - whether top three classes have been returned or not

  recommendedClasses;       // List of classes recommended for that user
  gotRecommended = false;   // Boolean var - whether recommended classes have been returned or not

  constructor(private homeService: HomeService,
              public dialog: MatDialog){
    this.userId = window.sessionStorage.getItem("ID");
    this.userType = window.sessionStorage.getItem("Type");
  }

  ngOnInit(): void {
    this.showMenuIcon();
    this.getApprovedNotices();

    if(this.userType == "user"){
      this.getUserBookings();
      this.getUserWaiting();
      this.getAllSessions();
      this.getRecommendedClasses();
    }
    else if(this.userType == "trainer"){
      this.getTrainerSessions();
      this.getAllClassNames();
      this.getAllRooms();
      this.getNoticesAwaiting();
      this.getAllClassesAwaitingApproval();
    }
    else {
      this.getNoticesAwaiting();
      this.getExistingUsers();
      this.getExistingTrainers();
      this.getExistingAdmins();
      this.getAllClassNames();
      this.getAllRooms();
      this.getAllClassesAwaitingApproval();
      this.getAllPossibleSessions();
      this.getTopBookings();
    }
  }

  // Shop menu icon in top right of screen once user logged in
  showMenuIcon(): void {
    let icon = document.getElementById('menu-icon');
    icon.classList.add('show');
  }

  // Get all approved notices
  getApprovedNotices() {
    this.homeService.getApprovedNotices().subscribe(notices => {
      this.notices = notices;
      this.gotNotices = true;
    });
  }

  // Get all bookings that the user is attending
  getUserBookings() {
    this.homeService.getUserBookings(this.userId).subscribe(result => {
      this.userBookings = result;
      this.hasBookings = true;
    });
  }

  // Get all bookings where user is on the waiting list
  getUserWaiting() {
    this.homeService.getUserWaiting(this.userId).subscribe(result => {
      this.userWaiting = result;
    });
  }

  // Get all sessions, that the user is not already booked onto, or on the waiting list for
  getAllSessions() {
    this.homeService.getAllSessions(this.userId).subscribe(result => {
      this.sessions = result;
      this.uniqueClasses = this.getUniqueClassNames(result);
    });
  }

  // Remove repeated class names where multiple sessions of a class are available
  getUniqueClassNames(list) {
    let uniqueNameArray = [];
    for (let i = 0; i < list.length; i++) {
      if (!(uniqueNameArray.includes(list[i].className))) {
        uniqueNameArray.push(list[i].className);
      }
    }
    return uniqueNameArray;
  }

  // Get a list of recommended classes for the user currently logged in
  getRecommendedClasses(){
    this.homeService.getRecommendedClasses(this.userId).subscribe(result => {
      this.recommendedClasses = result;
      this.gotRecommended = true;
    });
  }

  // Get all sessions the trainer is teaching
  getTrainerSessions() {
    this.homeService.getTrainerSessions(this.userId).subscribe(result => {
      this.trainerSessions = result;
      this.hasSessions = true;
    });
  }

  // Get all names of classes offered at the gym
  getAllClassNames(): void {
    this.homeService.getAllClassNames().subscribe(classes => {
      this.classes = classes;
    });
  }

  // Get all rooms the gym has
  getAllRooms(): void {
    this.homeService.getAllRooms().subscribe(rooms => {
      this.rooms = rooms;
    });
  }

  // Get all notices waiting for admin approval
  getNoticesAwaiting() {
    this.homeService.getNoticesAwaiting().subscribe(notices => {
      this.noticesAwaiting = notices;
      this.gotNoticeAwaiting = true;
    });
  }

  // Get all classes that are waiting for admin approval
  getAllClassesAwaitingApproval(){
    this.homeService.getAllClassesAwaitingApproval().subscribe(result => {
      this.classesAwaitingApproval = result;
      this.gotClassAwaiting = true;
    });
  }

  // Get list of existing gymUsers
  getExistingUsers(){
    this.homeService.getExistingUsers().subscribe(result => {
      this.users = result;
    });

  }

  // Get list of existing gymTrainers
  getExistingTrainers(){
    this.homeService.getExistingTrainers().subscribe(result => {
      this.trainers = result;
    });
  }

  // Get list of existing gymUsers
  getExistingAdmins(){
    this.homeService.getExistingAdmins().subscribe(result => {
      this.admins = result;
    });
  }

  // Get all sessions available
  getAllPossibleSessions() {
    this.homeService.getAllPossibleSessions().subscribe(result => {
      this.allSessions = result;
      this.hasSessions = true;
      console.log(this.allSessions);
    });
  }

  // Get class info for the top 3 classes
  getTopBookings(){
    console.log('get top three');
    this.homeService.getAllClassIds().subscribe(idList => {
      this.classIds = idList;
      this.homeService.getClassVal(this.classIds).subscribe(classVals =>
      {
        this.topThreeClasses = classVals;
        this.hasTopThree = true;
      });
    });
  }

  // Open the booking modal
  openBookingModal(classId): void {
    const dialogRef = this.dialog.open(BookingDialogComponent, {
      width: '500px',
      data: {uniqueClasses: this.uniqueClasses, sessions: this.sessions, userId: this.userId}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result == 'attending'){
        this.getUserBookings();
      }
      else if(result == 'waiting'){
        this.getUserWaiting();
      }
      this.getAllSessions();
      this.getRecommendedClasses();
    });
  }

  // Open the modal to schedule a new session of a class
  newNoticeModal(): void {
    const dialogRef = this.dialog.open(NewNoticeDialogComponent, {
      width: '500px',
      data: {userId: this.userId, userType: this.userType}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed', result);
      this.getNoticesAwaiting();
      this.getApprovedNotices();
    });
  }

  // Open the modal to create a new notice for the notice board
  scheduleSessionModal(): void {
    const dialogRef = this.dialog.open(ScheduleSessionDialogComponent, {
      width: '500px',
      data: {classes: this.classes, rooms: this.rooms, trainerId: this.userId}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed', result);
      if(this.userType == 'trainer'){
        this.getTrainerSessions();
      }
      if(this.userType == 'admin'){
        this.getAllPossibleSessions();
      }
    });
  }

  // Open modal to suggest a new class the gym should offer
  suggestNewClassModal() : void {
    const dialogRef = this.dialog.open(SuggestNewClassDialogComponent, {
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAllClassesAwaitingApproval();
      this.classOverview.getClassInfo();
      console.log('The dialog was closed', result);
    });
  }

  // Open success message modal - message to be displayed is passed as a parameter
  openSuccessModal(message){
    const dialogRef = this.dialog.open(SuccessMessageDialogComponent, {
      width: '500px',
      data: {message: message}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed', result);
    });
  }

  // Open error message modal - error message to be displayed is passed as parameter
  openErrorModal(message) {
    const dialogRef = this.dialog.open(ErrorMessageDialogComponent, {
      width: '500px',
      data: {message: message}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed', result);
    });
  }

  // Create a new account (user, trainer or admin)
  createNewAccount(userType: String, userFirstName: String,
                   userSurname: String, userEmail: String) : void {
    if(userFirstName == '' || userSurname == '' || userEmail == ''){
      this.openErrorModal('All fields are required - please enter an appropriate value for each');
    }
    else{
      // let password = this.generator.generate({length: 10, numbers: true});
      let password = 'pwrd';
      console.log(password);
      this.homeService.checkExisting(userType, userEmail).subscribe(result => {
        console.log(result);
        if (!result) {
          switch (userType){
            case 'trainer':
              this.homeService.createNewTrainer(userFirstName, userSurname,
                userEmail, password).subscribe(result => {
                console.log('New trainer created', result);
                this.openSuccessModal('New trainer created.');
                this.getExistingTrainers();
              }, error => {
                console.log("An error occurred", error);
              });
              break;

            case 'admin':
              this.homeService.createNewAdmin(userFirstName, userSurname,
                userEmail, password).subscribe(result => {
                console.log('New admin created', result);
                this.openSuccessModal('New admin created.');
                this.getExistingAdmins();
              }, error => {
                console.log("An error occurred", error);
              });
              break;

            default:
              this.homeService.createNewUser(userFirstName, userSurname,
                userEmail, password).subscribe(result => {
                console.log('New user created', result);
                this.openSuccessModal('New user created.');
                this.getExistingUsers();
              }, error => {
                console.log("An error occurred", error);
              });
              break;
          }
        }
        else {
          this.openErrorModal('Unable to create new account - An account already exists for this email address');
        }
      });
    }
  }

  // Delete a user account
  deleteUser(userId){
    this.homeService.deleteUser(userId).subscribe(result => {
      console.log('User deleted', result);
      this.getExistingUsers();
    });
  }

  // Delete a trainer account
  deleteTrainer(trainerId){
    this.homeService.deleteTrainer(trainerId).subscribe(result => {
      console.log('Trainer deleted', result);
      this.getExistingTrainers();
    });
  }

  // Delete an admin account
  deleteAdmin(adminId){
    this.homeService.deleteAdmin(adminId).subscribe(result => {
      console.log('Admin deleted', result);
      this.getExistingAdmins();
    });
  }

  // Delete notice from notice board
  deleteNotice(noticeId){
    this.homeService.deleteNotice(noticeId).subscribe(result => {
      console.log('Notice deleted', result);
      this.getNoticesAwaiting();
      this.getApprovedNotices();
    });
  }

  // Approve notice for notice board (posted by a trainer)
  approveNotice(noticeId){
    this.homeService.approveNotice(noticeId).subscribe(result => {
      console.log('Notice approved');
      if(result){
        this.getNoticesAwaiting();
        this.getApprovedNotices();
      }
    });
  }

  // Delete class from list of classes offered at the gym
  deleteClass(classId){
    this.homeService.deleteClass(classId).subscribe(result => {
      console.log('Class deleted', result);
      this.getAllClassesAwaitingApproval();
      this.classOverview.getClassInfo();

    });
  }

  // Approve class suggestion (posted by a trainer)
  approveClass(classId){
    this.homeService.approveClass(classId).subscribe(result => {
      console.log('Class approved');
      if(result){
        this.getAllClassNames();
        this.getAllClassesAwaitingApproval();
      }
    });
  }
}
