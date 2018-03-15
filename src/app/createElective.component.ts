import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SubjectHours, SubjectType, Subject } from './Subject';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { AddSubjectDialog } from './createRyp.component';
import { ElectiveGroup } from './ElectiveGroup';

@Component({
    selector: 'createElective',
    templateUrl: './createElective.component.html',
    styleUrls: ['./app.component.css']
})
export class CreateElectiveComponent implements OnInit {
    constructor(private http: HttpClient, private router: Router, private dialog: MatDialog) {}

    Name : string;
    Type : SubjectType;
    Pr : number;
    Shifr : string;
    Electives : Subject[] = [];
    Subjects : Subject[] = [];
    ConstSubjects : Subject[] = [];

    openDialog(): void {
        let dialogRef = this.dialog.open(AddSubjectDialog, {    
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
        // var a = new ElectiveGroup(this.Name, this.Type, new SubjectHours(0, 0, this.Pr), this.Shifr, this.Electives);
        // console.log(a)
        if(this.Name == null) {
            alert('Введите название предмета!');
            return;
        } else {
            this.http
                .post('http://localhost:5001/api/electivegroups', 
                    new ElectiveGroup(this.Name, this.Type, new SubjectHours(0, 0, this.Pr), this.Shifr, this.Electives))
                .subscribe(() => {
                    console.log('here!');
            })
        }
    }
}