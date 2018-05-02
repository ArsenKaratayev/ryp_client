import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';
import { SubjectType, Subject } from './Subject';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Specialty } from './Specialty';
import { Ryp, Semester } from './Ryp';
import { ElectiveGroup } from './ElectiveGroup';
import { UserService } from './user.service';
import { environment } from '../environments/environment';
import { DataService } from './data.service';
import { AddSubjectDialog } from './createRyp.component';

@Component({
  selector: 'editRypPrototype',
  templateUrl: './editRyp.component.html',
  styleUrls: ['./app.component.css']
})
export class EditRypPrototypeComponent implements OnInit {
    constructor(private http: HttpClient, private router: Router, private dialog: MatDialog, private US : UserService, private DS : DataService) {  }

    SubjectsForSave : Subject[][] = [[], [], [], [], [], [], [], []];
    ElectivesForSave : ElectiveGroup[][] = [[], [], [], [], [], [], [], []];
    Electives : ElectiveGroup[] = [];
    Subjects : Subject[] = [];
    ConstSubjects : Subject[] = [];
    Semesters : Semester[];
    Specialty : Specialty;
    Year : string;
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
    Pre : Subject[] = [];
    showPre : boolean = false;
    semesterCreditsMessage : string = "";

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
            for (let i = 0; i < this.SubjectsForSave.length; i++) {
                for (let j = 0; j < this.SubjectsForSave[i].length; j++) {
                    data.splice(data.map((el)=>el.id).indexOf(this.SubjectsForSave[i][j].id), 1)
                }
            }
            this.Subjects = data;
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
            for (let i = 0; i < this.ElectivesForSave.length; i++) {
                for (let j = 0; j < this.ElectivesForSave[i].length; j++) {
                    data.splice(data.map((el)=>el.id).indexOf(this.ElectivesForSave[i][j].id), 1)
                }
            }
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
        })
    }

    ngOnInit(): void {
        if (this.DS.getRyp() == undefined) {
            window.location.href = "http://localhost:4200"
        } else {
            this.Semesters = this.DS.getRyp().semesters;
            this.Specialty = this.DS.getRyp().specialty;
            this.Year = this.DS.getRyp().year;
            for (let i = 0; i < this.Semesters.length; i++) {
                this.Semesters[i].all = [];
                for (let j = 0; j < this.Semesters[i].subjects.length; j++) {
                    this.Semesters[i].all.push(this.Semesters[i].subjects[j]);
                    this.SubjectsForSave[i].push(this.Semesters[i].subjects[j]);
                }
                for (let j = 0; j < this.Semesters[i].electives.length; j++) {
                    var arr = [];
                    this.Semesters[i].electives[j].prerequisites = [];
                    this.Semesters[i].electives[j].lec = 0;
                    this.Semesters[i].electives[j].lab = 0;
                    for (let k = 0; k < this.Semesters[i].electives[j].subjects.length; k++) {
                        for (let t = 0; t < this.Semesters[i].electives[j].subjects[k].prerequisites.length; t++) {
                            if (arr.indexOf(this.Semesters[i].electives[j].subjects[k].prerequisites[t].id) == -1) {
                                arr.push(this.Semesters[i].electives[j].subjects[k].prerequisites[t])
                            }
                        }
                    }
                    this.Semesters[i].electives[j].prerequisites = arr
                    this.Semesters[i].all.push(this.Semesters[i].electives[j])
                    this.ElectivesForSave[i].push(this.Semesters[i].electives[j]);
                }
            }
            this.calculateCredits();
            this.setSemester(1);
            this.loadSubjects();
        }
    }
    calculateCredits() : void {
        for (let i = 0; i < this.Semesters.length; i++) {
            for (let j = 0; j < this.Semesters[i].all.length; j++) {
                if (this.Semesters[i].all[j].type.name == "Базовая") { 
                    this.BaseCredits += this.Semesters[i].all[j].credits; 
                } else if (this.Semesters[i].all[j].type.name == "Профилирующая") {
                    this.ProfilingCredits += this.Semesters[i].all[j].credits;
                } else if (this.Semesters[i].all[j].type.name == "Общеобразовательная") {
                    this.GeneralCredits += this.Semesters[i].all[j].credits;
                }
                this.TotalCredits += this.Semesters[i].all[j].credits;
                this.semesterCredits += this.Semesters[i].all[j].credits;
            }
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
    setSemester(sb : number) : void {
        this.semesterNumber = sb;
        this.semesterCredits = 0;
        var size = this.Semesters[this.semesterNumber - 1].all.length;
        for (var i = 0; i < size; i++) {
            this.semesterCredits += this.Semesters[this.semesterNumber - 1].all[i].credits;
        }
    }
    mouseEnter(pre : Subject[]) : void {
        this.showPre = true;
        this.Pre = pre;
      }
    
    mouseLeave() : void {
        this.showPre = false;
    }
    goToPrint() : void {
        if (this.Specialty != null && this.Year != null && this.Semesters != null) {
            var ryp = new Ryp(this.Specialty, this.Year, this.Semesters, this.US.getUser().id);
            localStorage.setItem('ryp', JSON.stringify(ryp));
            var creditsInfo = [this.GeneralCredits, this.BaseCredits, this.ProfilingCredits, this.TotalCredits];
            localStorage.setItem('creditsInfo', JSON.stringify(creditsInfo));
            var elCreditsInfo = [this.GeneralElCredits, this.BaseElCredits, this.ProfilingElCredits, this.TotalElCredits];
            localStorage.setItem('elCreditsInfo', JSON.stringify(elCreditsInfo));
            this.router.navigate(['/print']);
        }
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
            console.log(ryp)
            this.http
                .put(environment.apiUrl + '/api/ryps/' + this.DS.getRyp().id, ryp, {responseType: 'text'})
                .subscribe(() => {
                    this.router.navigate(['']);
            })
        }
    }
}
