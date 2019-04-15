import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

const httpOptions = {
  headers: new HttpHeaders(
    {
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token'
    }
  )
};

@Injectable()
export class HomeService {

  constructor(private http: HttpClient) {}

  private bookingAPI = "api/bookingdata";
  private classAPI = "api/classdata";
  private loginAPI = "api/logindata";
  private noticesAPI = "api/noticesdata";
  private recommendationsAPI = "api/recommendclass";

  getAllSessions(userId){
    return this.http.get(this.bookingAPI + "/getallsessions?userId=" + userId);
  }

  getAllClassIds(){
    return this.http.get(this.classAPI + "/getallclassids");
  }

  getClassVal(classIds){
    return this.http.post(this.bookingAPI + "/getclassval", classIds);
  }

  getRecommendedClasses(userId){
    return this.http.get(this.recommendationsAPI + "/returnuserclassrecommendations/" + userId);
  }

  getUserBookings(id) {
    return this.http.get(this.bookingAPI + "/getuserbookings/" + id);
  }

  getUserWaiting(id) {
    return this.http.get(this.bookingAPI + "/getuserwaiting/" + id);
  }

  getApprovedNotices(){
    return this.http.get(this.noticesAPI + "/approvednotices");
  }

  getNoticesAwaiting(){
    return this.http.get(this.noticesAPI + "/noticesawaiting");
  }

  getTrainerSessions(id) {
    return this.http.get(this.bookingAPI + "/gettrainersessions/" + id);
  }

  getAllClassNames() {
    return this.http.get(this.classAPI + "/getallclassnames");
  }

  getAllRooms() {
    return this.http.get(this.classAPI + "/getallrooms");
  }

  getAllClassesAwaitingApproval() {
    return this.http.get(this.classAPI + "/getallclassesawaitingapproval");
  }

  checkExisting(userType, email){
    return this.http.get(this.loginAPI + "/checkexisting/?userType=" + userType
    + "&email=" + email);
  }

  createNewUser(firstName, surname, email, password) {
    return this.http.post(this.loginAPI + "/createnewuser/?firstname=" + firstName
    + "&surname=" + surname + "&email=" + email + "&password=" + password, httpOptions);
  }

  createNewTrainer(firstName, surname, email, password) {
    return this.http.post(this.loginAPI + "/createnewtrainer/?firstname=" + firstName
      + "&surname=" + surname + "&email=" + email + "&password=" + password, httpOptions);
  }

  createNewAdmin(firstName, surname, email, password) {
    return this.http.post(this.loginAPI + "/createnewadmin/?firstname=" + firstName
      + "&surname=" + surname + "&email=" + email + "&password=" + password, httpOptions);
  }

  deleteNotice(noticeId) {
    return this.http.delete(this.noticesAPI + "/deletenotice/" + noticeId, httpOptions);
  }

  approveNotice(noticeId) {
    return this.http.put(this.noticesAPI + "/approvenotice/" + noticeId, httpOptions);
  }

  deleteClass(classId) {
    return this.http.delete(this.classAPI + "/deleteclass/" + classId, httpOptions);
  }

  approveClass(classId) {
    return this.http.put(this.classAPI + "/approveclass/" + classId, httpOptions);
  }

  getExistingUsers() {
    return this.http.get(this.loginAPI + "/getexistingusers");
  }

  getExistingTrainers() {
    return this.http.get(this.loginAPI + "/getexistingtrainers");
  }

  getExistingAdmins() {
    return this.http.get(this.loginAPI + "/getexistingadmins");
  }

  deleteUser(userId){
    return this.http.delete(this.loginAPI + "/deleteuser/" + userId, httpOptions);
  }

  deleteTrainer(trainerId){
    return this.http.delete(this.loginAPI + "/deletetrainer/" + trainerId, httpOptions);
  }

  deleteAdmin(adminId){
    return this.http.delete(this.loginAPI + "/deleteadmin/" + adminId, httpOptions);
  }

  getAllPossibleSessions(){
    return this.http.get(this.bookingAPI + "/getallpossiblesessions");
  }
}
