import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';
import { SubjectType, Subject } from './Subject';
import { Router } from '@angular/router';
import { Specialty } from './Specialty';
import { Ryp, Semester } from './Ryp';
import { ElectiveGroup } from './ElectiveGroup';
import { UserService } from './user.service';
import { environment } from '../environments/environment';
import { DataService } from './data.service';

@Component({
  selector: 'ryp',
  templateUrl: './ryp.component.html',
  styleUrls: ['./app.component.css']
})
export class RypComponent implements OnInit {
    constructor(private http: HttpClient, private router: Router, private US : UserService, private DS : DataService) {  }

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
                    this.Semesters[i].all.push(this.Semesters[i].subjects[j])
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
                }
            }
            this.calculateCredits();
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
            }
        }
        this.setSemester(1);
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
}
