import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SubjectHours, SubjectType, Subject } from './Subject';
import { Router } from '@angular/router';
import { Specialty } from './Specialty';
import { Ryp } from './Ryp';

@Component({
  selector: 'createRyp',
  templateUrl: './createRyp.component.html',
  styleUrls: ['./app.component.css']
})
export class CreateRypComponent implements OnInit {
    constructor(private http: HttpClient, private router: Router, private dialog: MatDialog) {  }
    
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
    
    Ryps : Ryp[] = [];
    AllSubjects : Subject[][] = [[], [], [], [], [], [], [], []];
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
            this.loadSpecialtys();
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
    loadRyps() : void {
        this.http.get('http://localhost:5001/api/ryps').subscribe((data : Ryp[]) => {
            this.Ryps = data;
            this.setRyp();
        })
    }
    setRyp() : void {
        this.update = false;
        // this.AllSubjects = [[], [], [], [], [], [], [], []];
        // this.BaseCredits = 0;
        // this.ProfilingCredits = 0;
        // this.GeneralCredits = 0;
        // this.TotalCredits = 9;
        // this.semesterCredits = 0;
        this.Subjects = this.ConstSubjects;
        for (let k = 0; k < this.Ryps.length; k++) {
            if (this.Ryps[k].specialty.id == this.Specialty.id && this.Ryps[k].year == this.Year) {
                // var arr = this.Ryps[k].subjects;
                // this.id = this.Ryps[k].id;
                // var a = [];
                // var b = [];
                // for (let i = 0; i < arr.length; i++) {
                //     for (let j = 0; j < arr[i].length; j++) {
                //         if (this.Subjects.map((el)=>el.id).indexOf(arr[i][j].id) != -1) {
                //             a.push(arr[i][j].id);
                //             console.log(arr[i][j].id)
                //             if (arr[i][j].type.name == "Базовая") { 
                //                 this.BaseCredits += arr[i][j].credits; 
                //             } else if (arr[i][j].type.name == "Профилирующая") {
                //                 this.ProfilingCredits += arr[i][j].credits;
                //             } else if (arr[i][j].type.name == "Общеобразовательная") {
                //                 this.GeneralCredits += arr[i][j].credits;
                //             }
                //             this.TotalCredits += arr[i][j].credits;
                //             this.semesterCredits += arr[i][j].credits;
                //         }
                //     }
                // }
                // for (let i = 0; i < this.Subjects.length; i++) {
                //     if (this.Subjects.map((el)=>el.id).indexOf(a[i]) == -1) {
                //         b.push(this.Subjects[i]);
                //     }
                // }
                // this.Subjects = b;
                // this.AllSubjects = arr;
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
    addSubject(s : Subject) : void {
        this.AllSubjects[this.semesterNumber - 1].push(s);
        // var arr = [];
        // for (let i = 0; i < this.Subjects.length; i++) {
        //     if (s.id != this.Subjects[i].id) {
        //         arr.push(this.Subjects[i])
        //     }
        // }
        // this.Subjects = arr;
        this.Subjects.splice(this.Subjects.indexOf(s), 1);
        if (s.type.name == "Базовая") { 
            this.BaseCredits += s.credits; 
        } else if (s.type.name == "Профилирующая") {
            this.ProfilingCredits += s.credits;
        } else if (s.type.name == "Общеобразовательная") {
            this.GeneralCredits += s.credits;
        }
        this.TotalCredits += s.credits;
        this.semesterCredits += s.credits;
        
    }
    deleteSubject(s : Subject) : void {
        this.AllSubjects[this.semesterNumber - 1].splice(this.AllSubjects[this.semesterNumber - 1].indexOf(s), 1);
        // var arr = [];
        // for (let i = 0; i < this.AllSubjects[this.semesterNumber - 1].length; i++) {
        //     if (s.id != this.AllSubjects[this.semesterNumber - 1][i].id) {
        //         arr.push(this.AllSubjects[this.semesterNumber - 1][i])
        //     }
        // }
        // this.AllSubjects[this.semesterNumber - 1] = arr;
        this.Subjects.push(s);
        if (s.type.name == "Базовая") { 
            this.BaseCredits -= s.credits; 
        } else if (s.type.name == "Профилирующая") {
            this.ProfilingCredits -= s.credits;
        } else if (s.type.name == "Общеобразовательная") {
            this.GeneralCredits -= s.credits;
        }
        this.TotalCredits -= s.credits;
        this.semesterCredits -= s.credits;
    }
    goToPrint() : void {
        if (this.Specialty != null && this.Year != null && this.AllSubjects != null) {
            var ryp = new Ryp(this.Specialty, this.Year, this.AllSubjects);
            localStorage.setItem('ryp', JSON.stringify(ryp));
            var creditsInfo = [this.GeneralCredits, this.BaseCredits, this.ProfilingCredits];
            localStorage.setItem('creditsInfo', JSON.stringify(creditsInfo));
            this.router.navigate(['/print']);
        }
    }
    save() : void {
        console.log(this.update)
        var ryp = new Ryp(this.Specialty, this.Year, this.AllSubjects);
        console.log(ryp)
        // if (this.update) {
        //     ryp.id = this.id;
        //     this.http
        //         .put('http://localhost:5001/api/ryps/' + this.id, ryp)
        //         .subscribe(() => {
        //             console.log('here!');
        //     })
        // } else {
            this.http
                .post('http://localhost:5001/api/ryps', ryp)
                .subscribe(() => {
                    console.log('here!');
            })
        // }
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

    closeDialog() : void {
        this.dialogRef.close(this.Subject);
    }
    cancelDialog() : void {
        this.dialogRef.close();
    }
}