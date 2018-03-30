import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SubjectHours, SubjectType, Subject } from './Subject';
import { Router } from '@angular/router';
import { Specialty } from './Specialty';
import { Ryp } from './Ryp';
import { ElectiveGroup } from './ElectiveGroup';
import { UserService } from './user.service';

@Component({
  selector: 'createRyp',
  templateUrl: './createRyp.component.html',
  styleUrls: ['./app.component.css']
})
export class CreateRypComponent implements OnInit {
    constructor(private http: HttpClient, private router: Router, private dialog: MatDialog, private US : UserService) {  }

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
            this.semesterCredits += s.credits;
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
            this.semesterCredits += s.credits;
        }
    }
    deleteSubject(s : any) : void {
        this.AllSubjects[this.semesterNumber - 1].splice(this.AllSubjects[this.semesterNumber - 1].indexOf(s), 1);
        if (s.subjects == undefined) {
            this.SubjectsForSave[this.semesterNumber - 1].splice(this.SubjectsForSave[this.semesterNumber - 1].indexOf(s), 1);
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
        } else {
            this.ElectivesForSave[this.semesterNumber - 1].splice(this.ElectivesForSave[this.semesterNumber - 1].indexOf(s), 1);
            this.Electives.push(s);
            if (s.type.name == "Базовая") { 
                this.BaseElCredits -= s.credits; 
            } else if (s.type.name == "Профилирующая") {
                this.ProfilingElCredits -= s.credits;
            } else if (s.type.name == "Общеобразовательная") {
                this.GeneralElCredits -= s.credits;
            }
            this.TotalElCredits -= s.credits;
            this.semesterCredits -= s.credits;
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
        if (this.Specialty != null && this.Year != null && this.AllSubjects != null) {
            var ryp = new Ryp(this.Specialty, this.Year, this.AllSubjects, this.ElectivesForSave, this.US.getUser());
            localStorage.setItem('ryp', JSON.stringify(ryp));
            var creditsInfo = [this.GeneralCredits, this.BaseCredits, this.ProfilingCredits, this.TotalCredits];
            localStorage.setItem('creditsInfo', JSON.stringify(creditsInfo));
            var elCreditsInfo = [this.GeneralElCredits, this.BaseElCredits, this.ProfilingElCredits, this.TotalElCredits];
            localStorage.setItem('elCreditsInfo', JSON.stringify(elCreditsInfo));
            this.router.navigate(['/print']);
        }
    }
    save() : void {
        console.log(this.update)
        var ryp = new Ryp(this.Specialty, this.Year, this.SubjectsForSave, this.ElectivesForSave, this.US.getUser());
        console.log(ryp)
        this.http
            .post('http://localhost:5001/api/ryps', ryp)
            .subscribe(() => {
                console.log('here!');
        })
        window.location.href = "http://localhost:4200";
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
                    var k = 0;
                    for (let j = 0; j < this.PreSubs.length; j++) {
                        if (j + 1 < this.semNum) {
                            for (let k = 0; k < this.PreSubs[j].length; k++) {
                                if (this.Subjects[i].prerequisites.map((el)=>el.id).indexOf(this.PreSubs[j][k].id) != -1) {
                                    k++;
                                    if (this.Subjects[i].prerequisites.length == k) {
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
                if (this.Electives[i].prerequisites.length > 0) {
                    var k = 0;
                    for (let j = 0; j < this.PreSubs.length; j++) {
                        if (j + 1 < this.semNum) {
                            for (let k = 0; k < this.PreSubs[j].length; k++) {
                                if (this.Electives[i].prerequisites.map((el)=>el.id).indexOf(this.PreSubs[j][k].id) != -1) {
                                    k++;
                                    if (this.Electives[i].prerequisites.length == k) {
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
