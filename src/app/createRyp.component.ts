import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SubjectHours, SubjectType, Subject } from './Subject';
import { Router } from '@angular/router';
import { Specialty } from './Specialty';
import { Ryp } from './Ryp';
import { ElectiveGroup } from './ElectiveGroup';

@Component({
  selector: 'createRyp',
  templateUrl: './createRyp.component.html',
  styleUrls: ['./app.component.css']
})
export class CreateRypComponent implements OnInit {
    constructor(private http: HttpClient, private router: Router, private dialog: MatDialog) {  }

    openDialog(): void {
        let dialogRef = this.dialog.open(AddSubjectDialog, {    
            width: '750px',
            height: '320px',
            data: { Subjects : this.Subjects, Electives : this.Electives }
        });
        
        dialogRef.afterClosed().subscribe(result => {
            if (result != null) {
                this.addSubject(result);
            }
        });
    }
    
    Ryps : Ryp[] = [];
    AllSubjects : any[][] = [[], [], [], [], [], [], [], []];
    SubjectsForSave : Subject[][] = [[], [], [], [], [], [], [], []];
    ElectivesForSave : ElectiveGroup[][] = [[], [], [], [], [], [], [], []];
    Electives : ElectiveGroup[] = [];
    Subjects : Subject[] = [];
    ConstSubjects : Subject[] = [];
    Specialtys : Specialty[] = [];
    Specialty : Specialty;
    Years : string[] = ["2018-2019", "2019-2020", "2020-2021"];
    Year : string = this.Years[0];
    GeneralCredits : number = 0;
    BaseCredits : number = 0;
    ProfilingCredits : number = 0;
    PractiseCredits : number = 6;
    AttestationCredits : number = 3;
    TotalCredits : number = 9;
    SemBtns : number[] = [1, 2, 3, 4, 5, 6, 7, 8];
    semesterNumber : number = 1;
    semesterCredits : number = 0;
    update : boolean = false;
    id : number;

    loadSubjects() : void {
        this.http.get('http://localhost:5001/api/subjects').subscribe((data : Subject[]) => { 
            this.ConstSubjects = data;
            this.Subjects = data;       
            this.loadElectives();
        })
    }
    loadSpecialtys() : void {
        this.http.get('http://localhost:5001/api/specialtys').subscribe((data : Specialty[]) => {
            this.Specialtys = data;
            if (this.Specialtys.length > 0) {
                this.Specialty = this.Specialtys[0];
                this.loadRyps();
            }
        })
    }
    loadElectives() : void {
        this.http.get('http://localhost:5001/api/electivegroups').subscribe((data : ElectiveGroup[]) => { 
            this.Electives = data;
            this.loadSpecialtys();
        })
    }
    loadRyps() : void {
        this.http.get('http://localhost:5001/api/ryps').subscribe((data : Ryp[]) => {
            this.Ryps = data;
            this.setRyp();
        })
    }
    setRyp() : void {
        this.update = false;
        this.Subjects = this.ConstSubjects;
        for (let k = 0; k < this.Ryps.length; k++) {
            if (this.Ryps[k].specialty.id == this.Specialty.id && this.Ryps[k].year == this.Year) {
                this.update = true;
                this.setSemester(1);
            }
        }
    }
    ngOnInit(): void {
        this.loadSubjects();
    }
    onChangeSpecialty(sp : Specialty) : void {
        this.Specialty = sp;
        this.setRyp();
    }
    onChangeYear(y : string) : void {
        this.Year = y;
        this.setRyp();
    }
    setSemester(sb : number) : void {
        this.semesterNumber = sb;
        this.semesterCredits = 0;
        var size = this.AllSubjects[this.semesterNumber - 1].length;
        for (var i = 0; i < size; i++) {
            this.semesterCredits += this.AllSubjects[this.semesterNumber - 1][i].credits;
        }
    }
    addSubject(s : any) : void {
        this.AllSubjects[this.semesterNumber - 1].push(s);
        if (s.type.name == "Базовая") { 
            this.BaseCredits += s.credits; 
        } else if (s.type.name == "Профилирующая") {
            this.ProfilingCredits += s.credits;
        } else if (s.type.name == "Общеобразовательная") {
            this.GeneralCredits += s.credits;
        }
        this.TotalCredits += s.credits;
        this.semesterCredits += s.credits;
        if (s.subjects == undefined) {
            this.SubjectsForSave[this.semesterNumber - 1].push(s);
            this.Subjects.splice(this.Subjects.indexOf(s), 1);
        } else {
            this.ElectivesForSave[this.semesterNumber - 1].push(s);
            this.Electives.splice(this.Subjects.indexOf(s), 1);
        }
    }
    deleteSubject(s : any) : void {
        this.AllSubjects[this.semesterNumber - 1].splice(this.AllSubjects[this.semesterNumber - 1].indexOf(s), 1);
        if (s.type.name == "Базовая") { 
            this.BaseCredits -= s.credits; 
        } else if (s.type.name == "Профилирующая") {
            this.ProfilingCredits -= s.credits;
        } else if (s.type.name == "Общеобразовательная") {
            this.GeneralCredits -= s.credits;
        }
        this.TotalCredits -= s.credits;
        this.semesterCredits -= s.credits;
        if (s.subjects == undefined) {
            this.SubjectsForSave[this.semesterNumber - 1].splice(this.SubjectsForSave[this.semesterNumber - 1].indexOf(s), 1);
            this.Subjects.push(s);
        } else {
            this.ElectivesForSave[this.semesterNumber - 1].splice(this.ElectivesForSave[this.semesterNumber - 1].indexOf(s), 1);
            this.Electives.push(s);
        }
    }
    goToPrint() : void {
        if (this.Specialty != null && this.Year != null && this.AllSubjects != null) {
            var ryp = new Ryp(this.Specialty, this.Year, this.AllSubjects, this.ElectivesForSave);
            localStorage.setItem('ryp', JSON.stringify(ryp));
            var creditsInfo = [this.GeneralCredits, this.BaseCredits, this.ProfilingCredits];
            localStorage.setItem('creditsInfo', JSON.stringify(creditsInfo));
            this.router.navigate(['/print']);
        }
    }
    save() : void {
        console.log(this.update)
        var ryp = new Ryp(this.Specialty, this.Year, this.SubjectsForSave, this.ElectivesForSave);
        console.log(ryp)
        this.http
            .post('http://localhost:5001/api/ryps', ryp)
            .subscribe(() => {
                console.log('here!');
        })
        // window.location.href = "http://localhost:4200/createRyp";
    }
}


@Component({
    selector: 'addSubject',
    templateUrl: 'addSubject.dialog.html',
})
export class AddSubjectDialog {
    constructor(public dialogRef: MatDialogRef<AddSubjectDialog>, @Inject(MAT_DIALOG_DATA) public data: any) { }

    Subject : Subject;
    Subjects : Subject[] = this.data.Subjects;
    Elective : ElectiveGroup;
    Electives : ElectiveGroup[] = this.data.Electives;
    ReqEl : boolean = true;

    changeToReq() : void {
        this.ReqEl = true;
        this.Elective = undefined;
    }
    changeToEl() : void {
        this.ReqEl = false;
        this.Subject = undefined;
    }

    closeDialog() : void {
        if (this.Subject != undefined && this.Elective == undefined) {
            this.dialogRef.close(this.Subject);
        } else if (this.Elective != undefined && this.Subject == undefined) {
            this.dialogRef.close(this.Elective);
        } else {
            this.dialogRef.close();
        }
    }
}