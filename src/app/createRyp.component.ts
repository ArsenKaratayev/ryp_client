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

@Component({
  selector: 'createRyp',
  templateUrl: './createRyp.component.html',
  styleUrls: ['./app.component.css']
})
export class CreateRypComponent implements OnInit {
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
    semesterCreditsMessage : string = "";
    prototype : boolean;

    loadSubjects() : void {
        // this.ConstSubjects = this.DS.getSubjects();
        // this.Subjects = this.ConstSubjects;
        // this.loadSpecialtys();
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
        // this.Specialtys = this.DS.getSpecialtys();
        // this.Specialty = this.Specialtys[0];
        // this.loadElectives();
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
        // this.Electives = this.DS.getElectives();
        // this.loadRyps();
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
        // this.Ryps = this.DS.getRyps();
        // this.setRyp();
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
        for (let k = 0; k < this.Ryps.length; k++) {
            if (this.Ryps[k].specialty.id == this.Specialty.id && this.Ryps[k].year == this.Year && this.Ryps[k].prototype == 0) {
                this.update = true;
            }
        }
    }
    ngOnInit(): void {
        for (let i = 0; i < 8; i++) {
            this.Semesters.push(new Semester([], [], []));
        }
        if (this.DS.getRypPrototype() != undefined) {
            this.Specialty = this.DS.getRypPrototype().specialty;
            this.Year = this.DS.getRypPrototype().year;
            this.Semesters = this.DS.getRypPrototype().semesters;
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
        }
        this.loadSubjects();
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
        if (this.semesterCredits > 22) {
            this.semesterCreditsMessage = "Слишком много кредитов"
        } else {
            this.semesterCreditsMessage = ""
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
    checkSemesters() : boolean {
        for (let i = 0; i < this.Semesters.length; i++) {
            var sum = 0;
            for (let j = 0; j < this.Semesters[i].all.length; j++) {
                sum += this.Semesters[i].all[j].credits;
            }
            if (sum > 22) {
                return false;
            }
        }
        return true;
    }
    // goToPrint() : void {
    //     if (this.Specialty != null && this.Year != null && this.Semesters != null) {
    //         for (let i = 0; i < this.Semesters.length; i++) {
    //             this.Semesters[i].subjects = this.SubjectsForSave[i];
    //             this.Semesters[i].electives = this.ElectivesForSave[i];
    //         }
    //         var ryp = new Ryp(this.Specialty, this.Year, this.Semesters, this.US.getUser().id);
    //         localStorage.setItem('ryp', JSON.stringify(ryp));
    //         var creditsInfo = [this.GeneralCredits, this.BaseCredits, this.ProfilingCredits, this.TotalCredits];
    //         localStorage.setItem('creditsInfo', JSON.stringify(creditsInfo));
    //         var elCreditsInfo = [this.GeneralElCredits, this.BaseElCredits, this.ProfilingElCredits, this.TotalElCredits];
    //         localStorage.setItem('elCreditsInfo', JSON.stringify(elCreditsInfo));
    //         this.router.navigate(['/print']);
    //     }
    // }
    save() : void {
        if(this.Specialty == null) {
            alert('Выберите специальность');
        } else if(this.Year == null) {
            alert('Выберите год');
        } else if(this.checkSemesters() == false) {
            alert('Слишком много кредитов в семестре (не должно превышать 22 кредита)');
        } else if(this.TotalCredits + this.TotalElCredits < 129) {
            alert('Итоговое количество кредитов не должно быть меньше 129');
        } else {
            for (let i = 0; i < this.Semesters.length; i++) {
                this.Semesters[i].subjects = this.SubjectsForSave[i];
                this.Semesters[i].electives = this.ElectivesForSave[i];
            }
            var ryp = new Ryp(this.Specialty, this.Year, this.Semesters, this.US.getUser().id);
            this.http
                .post(environment.apiUrl + '/api/ryps', ryp, {responseType: 'text'})
                .subscribe(() => {
                    this.router.navigate(['']);
            })
        }
    }
}


@Component({
    selector: 'addSubject',
    templateUrl: 'addSubject.dialog.html',
})
export class AddSubjectDialog implements OnInit {
    constructor(public dialogRef: MatDialogRef<AddSubjectDialog>, @Inject(MAT_DIALOG_DATA) public data: any) { }

    ExportSubjects : Subject[] = [];
    Subject : Subject;
    Subjects : Subject[] = this.data.Subjects;
    Elective : ElectiveGroup;
    Electives : ElectiveGroup[] = this.data.Electives;
    ReqEl : boolean = true;
    Type : boolean = this.data.type;
    Export : any[] = [];
    PreSubs : Subject[][] = this.data.PreSubs;
    semNum : number = this.data.Sem;
    filter : string;
    VisibleSubjects : Subject[] = [];
    VisibleElectives : ElectiveGroup[] = [];

    ngOnInit(): void {
        if (this.Type) {
            var arr = [];
            for (let i = 0; i < this.Subjects.length; i++) {
                if (this.Subjects[i].prerequisites.length > 0) {
                    var t = 0;
                    for (let j = 0; j < this.PreSubs.length; j++) {
                        if (j + 1 < this.semNum) {
                            for (let k = 0; k < this.PreSubs[j].length; k++) {
                                if (this.Subjects[i].prerequisites.map((el)=>el.id).indexOf(this.PreSubs[j][k].id) != -1) {
                                    t++;
                                    if (this.Subjects[i].prerequisites.length == t) {
                                        arr.push(this.Subjects[i])
                                    }
                                }
                            }
                        }
                    }
                } else {
                    arr.push(this.Subjects[i])
                }
            }
            this.Subjects = arr;

            var arr = [];
            for (let i = 0; i < this.Electives.length; i++) {
                this.Electives[i].lec = 0;
                this.Electives[i].lab = 0;
                if (this.Electives[i].prerequisites.length > 0) {
                    var t = 0;
                    for (let j = 0; j < this.PreSubs.length; j++) {
                        if (j + 1 < this.semNum) {
                            for (let k = 0; k < this.PreSubs[j].length; k++) {
                                if (this.Electives[i].prerequisites.map((el)=>el.id).indexOf(this.PreSubs[j][k].id) != -1) {
                                    t++;
                                    if (this.Electives[i].prerequisites.length == t) {
                                        arr.push(this.Electives[i])
                                    }
                                }
                            }
                        }
                        
                    }
                } else {
                    arr.push(this.Electives[i])
                }
            }
            this.Electives = arr;
            
        }  
        this.VisibleSubjects = this.Subjects;
        this.VisibleElectives = this.Electives; 
    }

    addExport(s : any) : void {
        if (this.Type) {
            s.type.color = 'black';
        }
        if (this.Export.indexOf(s) != -1) {
            this.returnStyle(s);
            this.Export.splice(this.Export.indexOf(s), 1);
        } else {
            this.Export.push(s);
        }
    }

    deleteExport(s : any) : void {
        this.Export.splice(this.Export.indexOf(s), 1);
    }

    onChange() : void {
        this.VisibleSubjects = this.Subjects;
        this.VisibleElectives = this.Electives;
        var arr = [];
        for (let i = 0; i < this.Subjects.length; i++) {
            if (this.Subjects[i].name.indexOf(this.filter) != -1 || this.Subjects[i].name.indexOf(this.filter[0].toUpperCase() + this.filter.substring(1, this.filter.length)) != -1) {
                arr.push(this.Subjects[i]);
            }
        }
        this.VisibleSubjects = arr;
        if (this.Type) {
            var arr = [];
            for (let i = 0; i < this.Electives.length; i++) {
                if (this.Electives[i].name.indexOf(this.filter) != -1 || this.Subjects[i].name.indexOf(this.filter[0].toUpperCase() + this.filter.substring(1, this.filter.length)) != -1) {
                    arr.push(this.Electives[i]);
                }
            }
            this.VisibleElectives = arr;
        }
    }

    changeToReq() : void {
        this.ReqEl = true;
    }
    changeToEl() : void {
        this.ReqEl = false;
    }

    closeDialog() : void {
        for (let i = 0; i < this.Export.length; i++) {
            this.returnStyle(this.Export[i]);
        }
        if (this.Type) {
            this.dialogRef.close(this.Export);
        } else {
            if (this.Subject != undefined) {
                this.dialogRef.close(this.Subject);
            } else {
                this.dialogRef.close();
            }
        }
    }
    otm() : void {
        for (let i = 0; i < this.Export.length; i++) {
            this.returnStyle(this.Export[i]);
        }
        this.dialogRef.close();
    }

    returnStyle(s : any) : void {
        if (s.type.name == "Базовая") {
            s.type.color = "#64B5F6";
        } else if (s.type.name == "Профилирующая") {
            s.type.color = "#7986CB";
        } else if (s.type.name == "Общеобразовательная") {
            s.type.color = "#81C784";
        } else {
            s.type.color = "#FF7043";
        }
    }
}
