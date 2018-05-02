import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SubjectType, Subject } from './Subject';
import { Router } from '@angular/router';
import { Specialty } from './Specialty';
import { Ryp, Semester } from './Ryp';
import { ElectiveGroup } from './ElectiveGroup';
import { UserService } from './user.service';
import { environment } from '../environments/environment';
import { DataService } from './data.service';
import { AddSubjectDialog } from './createRyp.component';

@Component({
  selector: 'createRypPrototype',
  templateUrl: './createRyp.component.html',
  styleUrls: ['./app.component.css']
})
export class CreateRypPrototypeComponent implements OnInit {
    constructor(private http: HttpClient, private router: Router, private dialog: MatDialog, private US : UserService, private DS : DataService) {  }

    openDialog(): void {
        let dialogRef = this.dialog.open(AddSubjectDialog, {    
            width: '750px',
            data: { Subjects : this.Subjects, Electives : this.Electives, type : true, PreSubs : this.SubjectsForSave, Sem : this.semesterNumber }
        });
        
        dialogRef.afterClosed().subscribe(result => {
            if (result != null) {
                for (let i = 0; i < result.length; i++) {
                    this.addSubject(result[i]);
                }
            }
        });
    }
    
    Ryps : Ryp[] = [];
    Semesters : Semester[] = [];
    SubjectsForSave : Subject[][] = [[], [], [], [], [], [], [], []];
    ElectivesForSave : ElectiveGroup[][] = [[], [], [], [], [], [], [], []];
    Electives : ElectiveGroup[] = [];
    Subjects : Subject[] = [];
    ConstSubjects : Subject[] = [];
    ConstElectives : ElectiveGroup[] = [];
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
    GeneralElCredits : number = 0;
    BaseElCredits : number = 0;
    ProfilingElCredits : number = 0;
    TotalElCredits : number = 0;
    SemBtns : number[] = [1, 2, 3, 4, 5, 6, 7, 8];
    semesterNumber : number = 1;
    semesterCredits : number = 0;
    update : boolean = false;
    Pre : Subject[] = [];
    showPre : boolean = false;
    prototype : boolean = false;

    loadSubjects() : void {
        this.http.get(environment.apiUrl + '/api/subjects')
        .catch((res : any) => {
            if (res.status == 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                this.US.setUser(undefined);
                return window.location.href = "http://localhost:4200";
            }   
        })
        .subscribe((data : Subject[]) => { 
            this.ConstSubjects = data;
            this.Subjects = data;
            this.loadSpecialtys();
        })
    }
    loadSpecialtys() : void {
        this.http.get(environment.apiUrl + '/api/specialtys')
        .catch((res : any) => {
            if (res.status == 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                this.US.setUser(undefined);
                return window.location.href = "http://localhost:4200";
            }   
        })
        .subscribe((data : Specialty[]) => {
            this.Specialtys = data;
            // this.Specialty = this.Specialtys[0];
            this.loadElectives();
        })
    }
    loadElectives() : void {
        this.http.get(environment.apiUrl + '/api/electivegroups')
        .catch((res : any) => {
            if (res.status == 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                this.US.setUser(undefined);
                return window.location.href = "http://localhost:4200";
            }   
        })
        .subscribe((data : ElectiveGroup[]) => { 
            this.ConstElectives = data;
            this.Electives = data;
            for (let i = 0; i < this.Electives.length; i++) {
                var arr = [];
                this.Electives[i].prerequisites = [];
                for (let k = 0; k < this.Electives[i].subjects.length; k++) {
                    for (let j = 0; j < this.Electives[i].subjects[k].prerequisites.length; j++) {
                        if (arr.indexOf(this.Electives[i].subjects[k].prerequisites[j].id) == -1) {
                            arr.push(this.Electives[i].subjects[k].prerequisites[j])
                        }
                    }
                }
                this.Electives[i].prerequisites = arr
            }
            this.loadRyps();
        })
    }
    loadRyps() : void {
        this.http.get(environment.apiUrl + '/api/ryps')
        .catch((res : any) => {
            if (res.status == 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                this.US.setUser(undefined);
                return window.location.href = "http://localhost:4200";
            }   
        })
        .subscribe((data : Ryp[]) => {
            this.Ryps = data;
            this.setRyp();
        })
    }
    setRyp() : void {
        this.update = false;
        this.Subjects = this.ConstSubjects;
        this.Electives = this.ConstElectives;
        for (let k = 0; k < this.Ryps.length; k++) {
            if (this.Ryps[k].specialty.id == this.Specialty.id && this.Ryps[k].year == this.Year && this.Ryps[k].prototype == 1) {
                this.update = true;
                this.prototype = true;
            }
        }
    }
    ngOnInit(): void {
        for (let i = 0; i < 8; i++) {
            this.Semesters.push(new Semester([], [], []));
        }
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
        var size = this.Semesters[this.semesterNumber - 1].all.length;
        for (var i = 0; i < size; i++) {
            this.semesterCredits += this.Semesters[this.semesterNumber - 1].all[i].credits;
        }
    }
    addSubject(s : any) : void {
        this.Semesters[this.semesterNumber - 1].all.push(s);
        if (s.subjects == undefined) {
            this.SubjectsForSave[this.semesterNumber - 1].push(s);
            this.Subjects.splice(this.Subjects.indexOf(s), 1);
            if (s.type.name == "Базовая") { 
                this.BaseCredits += s.credits; 
            } else if (s.type.name == "Профилирующая") {
                this.ProfilingCredits += s.credits;
            } else if (s.type.name == "Общеобразовательная") {
                this.GeneralCredits += s.credits;
            }
            this.TotalCredits += s.credits;
        } else {
            this.ElectivesForSave[this.semesterNumber - 1].push(s);
            this.Electives.splice(this.Electives.indexOf(s), 1);
            if (s.type.name == "Базовая") { 
                this.BaseElCredits += s.credits; 
            } else if (s.type.name == "Профилирующая") {
                this.ProfilingElCredits += s.credits;
            } else if (s.type.name == "Общеобразовательная") {
                this.GeneralElCredits += s.credits;
            }
            this.TotalElCredits += s.credits;
        }
        this.setSemester(this.semesterNumber)
    }
    deleteSubject(s : any) : void {
        var arr =[]
        if (s.subjects == undefined) {
            for (let i = 0; i < this.SubjectsForSave.length; i++) {
                if (this.SubjectsForSave[i].map((el)=>el.id).indexOf(s.id) != -1) {
                    this.Semesters[i].all.splice(this.Semesters[i].all.map((el)=>el.id).indexOf(s.id), 1);
                    this.SubjectsForSave[i].splice(this.SubjectsForSave[i].map((el)=>el.id).indexOf(s.id), 1);
                    this.Subjects.push(s);
                    if (s.type.name == "Базовая") { 
                        this.BaseCredits -= s.credits; 
                    } else if (s.type.name == "Профилирующая") {
                        this.ProfilingCredits -= s.credits;
                    } else if (s.type.name == "Общеобразовательная") {
                        this.GeneralCredits -= s.credits;
                    }
                    this.TotalCredits -= s.credits;
                }
                for (let j = 0; j < this.SubjectsForSave[i].length; j++) {
                    if (this.SubjectsForSave[i][j].prerequisites.map((el)=>el.id).indexOf(s.id) != -1) {
                        arr.push(this.SubjectsForSave[i][j])
                    }
                } 
                for (let j = 0; j < this.ElectivesForSave[i].length; j++) {
                    if (this.ElectivesForSave[i][j].prerequisites.map((el)=>el.id).indexOf(s.id) != -1) {
                        arr.push(this.ElectivesForSave[i][j])
                    }
                } 
            }
        } else {
            for (let i = 0; i < this.ElectivesForSave.length; i++) {
                if (this.ElectivesForSave[i].map((el)=>el.id).indexOf(s.id) != -1) {
                    this.Semesters[i].all.splice(this.Semesters[i].all.map((el)=>el.id).indexOf(s.id), 1);
                    this.ElectivesForSave[i].splice(this.ElectivesForSave[i].map((el)=>el.id).indexOf(s.id), 1);
                    this.Electives.push(s);
                    if (s.type.name == "Базовая") { 
                        this.BaseElCredits -= s.credits; 
                    } else if (s.type.name == "Профилирующая") {
                        this.ProfilingElCredits -= s.credits;
                    } else if (s.type.name == "Общеобразовательная") {
                        this.GeneralElCredits -= s.credits;
                    }
                    this.TotalCredits -= s.credits;
                }
                for (let j = 0; j < this.ElectivesForSave[i].length; j++) {
                    if (this.ElectivesForSave[i][j].prerequisites.map((el)=>el.id).indexOf(s.id) != -1) {
                        arr.push(this.ElectivesForSave[i][j])
                    }
                } 
            }
        }
        for (let i = 0; i < arr.length; i++) {
            this.deleteSubject(arr[i]);
        }
        this.setSemester(this.semesterNumber)
    }
    mouseEnter(pre : Subject[]) : void {
        this.showPre = true;
        this.Pre = pre;
      }
    
    mouseLeave() : void {
        this.showPre = false;
    }
    save() : void {
        if(this.Specialty == null) {
            alert('Выберите специальность');
        } else if(this.Year == null) {
            alert('Выберите год');
        } else {
            for (let i = 0; i < this.Semesters.length; i++) {
                this.Semesters[i].subjects = this.SubjectsForSave[i];
                this.Semesters[i].electives = this.ElectivesForSave[i];
            }
            var ryp = new Ryp(this.Specialty, this.Year, this.Semesters, this.US.getUser().id);
            ryp.prototype = 1;
            this.http
                .post(environment.apiUrl + '/api/ryps', ryp, {responseType: 'text'})
                .subscribe(() => {
                    this.router.navigate(['']);
            })
        }
    }
}