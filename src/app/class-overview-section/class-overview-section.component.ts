/* Angular Imports */
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
/* Classes */
import { Class } from "./class";
/* Services */
import { ClassOverviewSectionService } from "./class-overview-section.service";

@Component({
  selector: 'class-overview-section',
  templateUrl: 'class-overview-section.component.html',
  styleUrls: ['class-overview-section.component.css'],
  providers: [ ClassOverviewSectionService ]
})

export class ClassOverviewSectionComponent implements OnInit {
  // Output
  @Output() openBookingModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteClass: EventEmitter<any> = new EventEmitter<any>();

  // Other Variables
  userType;                               // User Type of user currently logged in
  userId;                                 // User Id of user currently logged in

  classesList;                            // List of classes - retrieved from database
  gotClasses = false;                     // Boolean var - whether classes have been retrieved or not
  focusSelected = 'All';                  // Default focus selected is 'All' (so all classes are shown initially)
  difficultySelected = 'All';             // Default difficulty selected is 'All' (so all classes are shown initially)

  filteredClasses: Class[] = [];          // List of classes filtered by filters selected

  focusList: string[] = [];               // List of all possible class focuses to choose from
  uniqueFocusList: string[] = [];         // Duplicates removed from focusList (above)
  difficultyList: string[] = [];          // List of all possible class difficulties to choose from
  uniqueDifficultyList: string[] = [];    // Duplicates removed from difficultyList (above)

  constructor(private classOverviewService: ClassOverviewSectionService) {}

  // When component initialises, get all class info from database (function)
  ngOnInit() {
    this.getClassInfo();
    this.userType = window.sessionStorage.getItem("Type");
    this.userId = window.sessionStorage.getItem("ID");
  }

  // Get all class info from database
  getClassInfo(){
    this.classOverviewService.getAllClasses().subscribe(listOfClasses => {
      this.classesList = listOfClasses;
      this.gotClasses = true;

      this.filteredClasses = this.classesList;
      for (let i=0; i < this.classesList.length; i++) {
        this.focusList[i] = this.classesList[i].focus;
        this.difficultyList[i] = this.classesList[i].difficulty;
      }
      this.uniqueFocusList.push('All');
      for(let i=0;i<this.focusList.length;i++){
        if(this.uniqueFocusList.indexOf(this.focusList[i]) == -1){
          this.uniqueFocusList.push(this.focusList[i]);
        }
      }

      this.uniqueDifficultyList.push('All');
      for(let i=0;i<this.difficultyList.length;i++){
        if(this.uniqueDifficultyList.indexOf(this.difficultyList[i]) == -1){
          this.uniqueDifficultyList.push(this.difficultyList[i]);
        }
      }
      this.filterResults();
    });
  }

  // Filter list of classes based on options selected
  filterResults() {
    this.filteredClasses = [];
    let newFocusClassList: any[] = [];
    for(let i=0; i< this.classesList.length; i++) {
      if(this.classesList[i].focus == this.focusSelected || this.focusSelected == "All"){
        newFocusClassList.push(this.classesList[i]);
      }
    }
    for(let i=0; i< newFocusClassList.length; i++) {
      if(newFocusClassList[i].difficulty == this.difficultySelected || this.difficultySelected == "All"){
        this.filteredClasses.push(newFocusClassList[i]);
      }
    }
    return this.filteredClasses;
  }

  // Open booking modal for this class (passed as classId)
  sendData(classId){
    this.openBookingModal.emit(classId);
  }

  // Delete this class (passed as classId)
  deleteClassRequest(classId){
    this.deleteClass.emit(classId);
  }
}
