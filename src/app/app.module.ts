import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { CreateSubjectComponent } from './createSubject.component';
import { CreateRypComponent, AddSubjectDialog } from './createRyp.component';
import { MatDialogModule, MatDialogConfig, MAT_DIALOG_DEFAULT_OPTIONS, PageEvent } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PrintRypComponent } from './printRyp.component';
import { SubjectListComponent } from './subjectList.component';

const appRoutes: Routes = [
  { path : '', component : CreateRypComponent },
  { path : 'createSubject', component : CreateSubjectComponent },
  { path : 'addSubject', component :  AddSubjectDialog},
  { path : 'print', component : PrintRypComponent },
  { path : 'subjectList', component : SubjectListComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    CreateSubjectComponent,
    CreateRypComponent,
    AddSubjectDialog,
    PrintRypComponent,
    SubjectListComponent
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
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }
  ],
  bootstrap: [
    AppComponent, []
  ]
})
export class AppModule { }
