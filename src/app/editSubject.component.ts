import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SubjectType, Subject } from './Subject';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { AddSubjectDialog } from './createRyp.component';
import { UserService } from './user.service';
import { User } from './User';
import { DataService } from './data.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'editSubject',
  templateUrl: './createSubject.component.html',
  styleUrls: ['./app.component.css'],
})
export class EditSubjectComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router, private dialog: MatDialog, private US : UserService, private DS : DataService) {}

  Name : string = this.DS.getSubject().name;
  Type : string = this.DS.getSubject().type.name;
  Lec : number = this.DS.getSubject().lec;
  Lab : number = this.DS.getSubject().lab;
  Pr : number = this.DS.getSubject().pr;
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
    this.http.get(environment.apiUrl + '/api/subjects').subscribe((data : Subject[]) => { 
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
      alert('Введите название предмета');
    } else if(this.Lec + this.Lab + this.Pr == 0) {
      alert('Неверное количество кредитов');
    } else if(this.Shifr == null) {
      alert('Введите шифр предмета');
    } else if(this.Type == null) {
      alert('Выберите тип предмета');
    } else if(this.Lec == null) {
      alert('Введите количество лекций');
    } else if(this.Lab == null) {
      alert('Введите количество лабораторных');
    } else if(this.Pr == null) {
      alert('Введите количество практик');
    } else {
        var sub = new Subject(this.Name, new SubjectType(this.Type), this.Lec, this.Lab, this.Pr, this.Shifr, this.Prerequisites, this.US.getUser().id);
        this.http
        .put(environment.apiUrl + '/api/subjects/' + this.DS.getSubject().id, sub, {responseType: 'text'})
        .subscribe(() => {
          this.router.navigate(['/subjectList']);
        })
    }
  }
}
