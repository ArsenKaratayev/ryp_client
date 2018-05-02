import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SubjectType, Subject } from './Subject';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { AddSubjectDialog } from './createRyp.component';
import { ElectiveGroup } from './ElectiveGroup';
import { UserService } from './user.service';
import { environment } from '../environments/environment';

@Component({
    selector: 'createElective',
    templateUrl: './createElective.component.html',
    styleUrls: ['./app.component.css']
})
export class CreateElectiveComponent implements OnInit {
    constructor(private http: HttpClient, private router: Router, private dialog: MatDialog, private US : UserService) {}

    Name : string;
    Type : SubjectType;
    Pr : number;
    Shifr : string;
    Electives : Subject[] = [];
    Subjects : Subject[] = [];
    ConstSubjects : Subject[] = [];

    openDialog(): void {
        console.log(this.Subjects)
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
            this.ConstSubjects = data;  
            this.Subjects = this.ConstSubjects;
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
        this.Subjects = this.ConstSubjects;
        this.ConstSubjects.push(s);
        this.Electives.splice(this.Electives.indexOf(s), 1);
        this.filterSubjects();
    }

    filterSubjects() : void {
        if (this.Electives.length == 0) {
            this.Type = undefined;
            this.Pr = undefined;
        } else {
            var arr = [];
            for (let i = 0; i < this.Subjects.length; i++) {
                if (this.Subjects[i].type.name == this.Type.name && this.Subjects[i].credits == this.Pr) {
                    arr.push(this.Subjects[i]);
                }
            }
            this.Subjects = arr;
        }
    }

    save() : void {
        if(this.Name == null) {
            alert('Введите название элективной группы');
        } else if(this.Shifr == null) {
            alert('Введите шифр элективной группы');
        } else {
            this.http
                .post(environment.apiUrl + '/api/electivegroups', 
                    new ElectiveGroup(this.Name, this.Type, this.Pr, this.Shifr, this.Electives, this.US.getUser().id),
                    {responseType: 'text'})
                .subscribe(() => {
                    this.router.navigate(['/subjectList']);
            })
        }
    }
}