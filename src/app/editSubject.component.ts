import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SubjectHours, SubjectType, Subject } from './Subject';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { AddSubjectDialog } from './createRyp.component';
import { UserService } from './user.service';
import { User } from './User';
import { DataService } from './data.service';

@Component({
  selector: 'editSubject',
  templateUrl: './createSubject.component.html',
  styleUrls: ['./app.component.css'],
})
export class EditSubjectComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router, private dialog: MatDialog, private US : UserService, private DS : DataService) {}

  Name : string = this.DS.getSubject().name;
  Type : string = this.DS.getSubject().type.name;
  Lec : number = this.DS.getSubject().hours.lec;
  Lab : number = this.DS.getSubject().hours.lab;
  Pr : number = this.DS.getSubject().hours.pr;
  Shifr : string = this.DS.getSubject().shifr;
  Prerequisites : Subject[] = this.DS.getSubject().prerequisites;
  Subjects : Subject[] = [];

  openDialog(): void {
    let dialogRef = this.dialog.open(AddSubjectDialog, {    
        width: '750px',
        data: { Subjects : this.Subjects, type : false }
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
        var sub = new Subject(this.Name, new SubjectType(this.Type), new SubjectHours(this.Lec, this.Lab, this.Pr), this.Shifr, this.Prerequisites, this.US.getUser());
        this.http
        .put('http://localhost:5001/api/subjects/' + this.DS.getSubject().id, sub)
        .subscribe(() => {
          console.log('here!');
        })
    }
  }
}
