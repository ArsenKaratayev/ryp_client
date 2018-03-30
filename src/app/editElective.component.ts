import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SubjectHours, SubjectType, Subject } from './Subject';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { AddSubjectDialog } from './createRyp.component';
import { ElectiveGroup } from './ElectiveGroup';
import { UserService } from './user.service';
import { DataService } from './data.service';

@Component({
    selector: 'editElective',
    templateUrl: './createElective.component.html',
    styleUrls: ['./app.component.css']
})
export class EditElectiveComponent implements OnInit {
    constructor(private http: HttpClient, private router: Router, private dialog: MatDialog, private US : UserService, private DS : DataService) {}

    Name : string = this.DS.getElective().name;
    Type : SubjectType = this.DS.getElective().type;
    Pr : number = this.DS.getElective().credits;
    Shifr : string = this.DS.getElective().shifr;
    Electives : Subject[] = this.DS.getElective().subjects;
    Subjects : Subject[] = [];
    ConstSubjects : Subject[] = [];

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
            this.ConstSubjects = data;    
        })
    }

    ngOnInit(): void {
        this.loadSubjects();
    }

    addSubject(s : Subject) : void {
        this.Electives.push(s);
        this.Subjects.splice(this.Subjects.indexOf(s), 1);
        this.Type = s.type;
        this.Pr = s.credits;
        this.filterSubjects();
    }

    deleteSubject(s : Subject) : void {
        this.Subjects.push(s);
        this.Electives.splice(this.Electives.indexOf(s), 1);
        if(this.Electives.length == 0) {
            this.Type = undefined;
            this.Pr = undefined;
        }
    }

    filterSubjects() : void {
        var arr = [];
        
        for (let i = 0; i < this.Subjects.length; i++) {
            console.log(this.Subjects[i].type.name, this.Type.name)
            if (this.Subjects[i].type.name == this.Type.name && this.Subjects[i].credits == this.Pr) {
                arr.push(this.Subjects[i]);
            }
        }
        this.Subjects = arr;
    }

    save() : void {
        if(this.Name == null) {
            alert('Введите название предмета!');
            return;
        } else {
            this.http
                .put('http://localhost:5001/api/electivegroups/' + this.DS.getElective().id, 
                    new ElectiveGroup(this.Name, this.Type, new SubjectHours(0, 0, this.Pr), this.Shifr, this.Electives, this.US.getUser()))
                .subscribe(() => {
                    console.log('here!');
            })
        }
    }
}