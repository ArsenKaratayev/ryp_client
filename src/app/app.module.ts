import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA, ClassProvider } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { CreateSubjectComponent } from './createSubject.component';
import { CreateRypComponent, AddSubjectDialog } from './createRyp.component';
import { MatDialogModule, MatDialogConfig, MAT_DIALOG_DEFAULT_OPTIONS, PageEvent } from '@angular/material';
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
import { AuthInterceptor } from './Interceptors/auth-interceptor';
import { LoginComponent } from './login.component';
import { RypListComponent } from './rypList.component';
import { RypComponent } from './ryp.component';
import { EditRypComponent } from './editRyp.component';
import { CreateRypPrototypeComponent } from './createRypPrototype.component';
import { EditRypPrototypeComponent } from './editRypPrototype.component';
import { EditUserComponent } from './editUser.component';

const appRoutes: Routes = [
  { path : '', component : RypListComponent },
  { path : 'ryp', component : RypComponent },
  { path : 'editRyp', component : EditRypComponent },
  { path : 'editRypPrototype', component : EditRypPrototypeComponent },
  { path : 'createRyp', component : CreateRypComponent },
  { path : 'createRypPrototype', component : CreateRypPrototypeComponent },
  { path : 'login', component : LoginComponent },
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
  { path : 'editUser', component : EditUserComponent },
  { path : 'editElective', component : EditElectiveComponent },
  { path : 'editSpecialty', component : EditSpecialtyComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    RypListComponent,
    RypComponent,
    LoginComponent,
    EditRypComponent,
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
    CreateUserComponent,
    CreateRypPrototypeComponent,
    EditRypPrototypeComponent,
    EditUserComponent
  ],
  imports: [
    BrowserModule, 
    FormsModule, 
    HttpClientModule,
    MatDialogModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    )
  ],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    UserService,
    DataService,
    <ClassProvider> {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [
    AppComponent, []
  ]
})
export class AppModule { }
