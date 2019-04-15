/* Modules */
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MatButtonModule, MatCardModule, MatDatepickerModule, MatDialogModule, MatExpansionModule, MatIconModule,
  MatInputModule, MatMenuModule, MatProgressSpinnerModule, MatRadioModule,
  MatSelectModule, MatTabsModule, MatToolbarModule
} from '@angular/material';

/* Components */
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ClassComponent } from './class-overview-section/class/class.component';
import { LoginComponent } from "./login/login.component";
import { PageSectionComponent } from './page-section/page-section.component';
import { NoticeEntryComponent } from "./notice-entry/notice-entry.component";
import { UserDetailsComponent } from "./user-details/user-details.component";
import { ClassBookingComponent } from './page-section/class-booking/class-booking.component';
import { BookingDialogComponent } from "./dialog-boxes/booking-dialog/booking-dialog.component";
import { TrainerSessionComponent } from "./page-section/trainer-session/trainer-session.component";
import { EditClassDialogComponent } from "./dialog-boxes/edit-class-dialog/edit-class-dialog.component";
import { NewNoticeDialogComponent } from "./dialog-boxes/new-notice-dialog/new-notice-dialog.component";
import { ErrorMessageDialogComponent } from "./dialog-boxes/error-message-dialog/error-message-dialog.component";
import { DeleteBookingDialogComponent } from "./dialog-boxes/delete-booking-dialog/delete-booking-dialog.component";
import { DeleteSessionDialogComponent } from "./dialog-boxes/delete-session-dialog/delete-session-dialog.component";
import { ClassOverviewSectionComponent } from './class-overview-section/class-overview-section.component';
import { SuccessMessageDialogComponent } from "./dialog-boxes/success-message-dialog/success-message-dialog.component";
import { ScheduleSessionDialogComponent } from "./dialog-boxes/schedule-session-dialog/schedule-session-dialog.component";
import { SuggestNewClassDialogComponent } from "./dialog-boxes/suggest-new-class-dialog/suggest-new-class-dialog.component";

/* Services */
import { HomeService } from "./home/home.service";
import { LoginService } from "./login/login.service";
import { AuthGuardService } from "./authenticate-guard.service";
import { PageSectionService } from "./page-section/page-section.service";
import { EditClassDialogService } from "./dialog-boxes/edit-class-dialog/edit-class-dialog.service";
import { NewNoticeDialogService } from "./dialog-boxes/new-notice-dialog/new-notice-dialog.service";
import { ClassOverviewSectionService } from "./class-overview-section/class-overview-section.service";
import { SuggestNewClassDialogService } from "./dialog-boxes/suggest-new-class-dialog/suggest-new-class-dialog.service";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ClassComponent,
    LoginComponent,
    NoticeEntryComponent,
    UserDetailsComponent,
    PageSectionComponent,
    ClassBookingComponent,
    BookingDialogComponent,
    TrainerSessionComponent,
    NewNoticeDialogComponent,
    EditClassDialogComponent,
    ErrorMessageDialogComponent,
    DeleteBookingDialogComponent,
    DeleteSessionDialogComponent,
    ClassOverviewSectionComponent,
    SuccessMessageDialogComponent,
    ScheduleSessionDialogComponent,
    SuggestNewClassDialogComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatMenuModule,
    MatRadioModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatToolbarModule,
    HttpClientModule,
    MatExpansionModule,
    MatMomentDateModule,
    MatDatepickerModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent },
      { path: '', component: HomeComponent, canActivate: [ AuthGuardService ]},
      { path: '**', redirectTo: ''}   // Otherwise redirect to home
    ])
  ],
  providers: [ ClassOverviewSectionService, PageSectionService, LoginService, HomeService, AuthGuardService,
    EditClassDialogService, NewNoticeDialogService, SuggestNewClassDialogService ],
  bootstrap: [ AppComponent ],
  entryComponents: [ BookingDialogComponent, DeleteBookingDialogComponent, DeleteSessionDialogComponent,
    EditClassDialogComponent, ScheduleSessionDialogComponent, ErrorMessageDialogComponent, NewNoticeDialogComponent,
    SuggestNewClassDialogComponent, SuccessMessageDialogComponent ]
})

export class AppModule { }
