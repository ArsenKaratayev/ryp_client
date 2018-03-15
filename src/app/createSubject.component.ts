import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SubjectHours, SubjectType, Subject } from './Subject';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { AddSubjectDialog } from './createRyp.component';

@Component({
  selector: 'createSubject',
  templateUrl: './createSubject.component.html',
  styleUrls: ['./app.component.css']
})
export class CreateSubjectComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router, private dialog: MatDialog) {}

  Name : string;
  Type : string;
  Lec : number;
  Lab : number;
  Pr : number;
  Shifr : string;
  Prerequisites : Subject[] = [];
  Subjects : Subject[] = [];

  openDialog(): void {
    let dialogRef = this.dialog.open(AddSubjectDialog, {    
        // height: '400px',
        width: '750px',
        data: { Subjects : this.Subjects }
    });
    
    dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
            this.addSubject(result);
        }
    });
}

  loadSubjects() : void {
    this.http.get('http://localhost:5001/api/subjects').subscribe((data : Subject[]) => { 
        this.Subjects = data;       
    })
  }
  ngOnInit(): void {
    this.loadSubjects();
  }

  addSubject(s : Subject) : void {
    this.Prerequisites.push(s);
    this.Subjects.splice(this.Subjects.indexOf(s), 1);
  }

  deleteSubject(s : Subject) : void {
    this.Subjects.push(s);
    this.Prerequisites.splice(this.Prerequisites.indexOf(s), 1);
  }

  save() : void {
    if(this.Name == null) {
        alert('Введите название предмета!');
      return;
    } else {
        this.http
        .post('http://localhost:5001/api/subjects', 
            new Subject(this.Name, new SubjectType(this.Type), new SubjectHours(this.Lec, this.Lab, this.Pr), this.Shifr, this.Prerequisites))
        .subscribe(() => {
          console.log('here!');
        })
    }
  }
}
