import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { CreateSubjectComponent } from './createSubject.component';
import { CreateRypComponent, AddSubjectDialog } from './createRyp.component';
// import { MatDialogModule, MatDialogConfig, MAT_DIALOG_DEFAULT_OPTIONS, PageEvent } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PrintRypComponent } from './printRyp.component';
import { SubjectListComponent } from './subjectList.component';
import { CreateElectiveComponent } from './createElective.component';
import { CreateSpecialtyComponent } from './createSpecialty.component';
import { SpecialtyListComponent } from './specialtyList.component';
import { UserService } from './user.service';
import { EditSubjectComponent } from './editSubject.component';
import { DataService } from './data.service';
import { EditElectiveComponent } from './editElective.component';
import { EditSpecialtyComponent } from './editSpecialty.component';
import { UserListComponent } from './userList.component';
import { CreateUserComponent } from './createUser.component';

const appRoutes: Routes = [
  { path : '', component : CreateRypComponent },
  { path : 'createSubject', component : CreateSubjectComponent },
  { path : 'createSpecialty', component : CreateSpecialtyComponent },
  { path : 'createElective', component : CreateElectiveComponent },
  { path : 'createUser', component : CreateUserComponent },
  { path : 'addSubject', component :  AddSubjectDialog },
  { path : 'print', component : PrintRypComponent },
  { path : 'subjectList', component : SubjectListComponent },
  { path : 'specialtyList', component : SpecialtyListComponent },
  { path : 'userList', component : UserListComponent },
  { path : 'editSubject', component : EditSubjectComponent },
  { path : 'editElective', component : EditElectiveComponent },
  { path : 'editSpecialty', component : EditSpecialtyComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    CreateSubjectComponent,
    CreateElectiveComponent,
    CreateRypComponent,
    AddSubjectDialog,
    PrintRypComponent,
    SubjectListComponent,
    CreateSpecialtyComponent,
    SpecialtyListComponent,
    EditSubjectComponent,
    EditElectiveComponent,
    EditSpecialtyComponent,
    UserListComponent,
    CreateUserComponent
  ],
  imports: [
    BrowserModule, 
    FormsModule, 
    HttpClientModule,
    // MatDialogModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    )
  ],
  providers: [
    // { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    UserService,
    DataService
  ],
  bootstrap: [
    AppComponent, []
  ]
})
export class AppModule { }
