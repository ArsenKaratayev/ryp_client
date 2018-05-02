import { Component, OnInit } from '@angular/core';
import { SubjectType, Subject } from './Subject';
import { Specialty } from './Specialty';
import { Ryp } from './Ryp';

@Component({
  selector: 'print',
  templateUrl: './printRyp.component.html',
//   styleUrls: ['./app.component.css']
})


export class PrintRypComponent implements OnInit {

    constructor() {  }

    ryp : Ryp;
    even : sem[] = [];
    odd : sem[] = [];
    semestersCredits : number[] = [0, 0, 0, 0, 0, 0, 0, 0];
    creditsInfo : number[];
    elCreditsInfo : number[];
    GeneralCredits : number = 0;
    BaseCredits : number = 0;
    ProfilingCredits : number = 0;
    PractiseCredits : number = 6;
    AttestationCredits : number = 3;
    TotalCredits : number = 0;
    GeneralElCredits : number = 0;
    BaseElCredits : number = 0;
    ProfilingElCredits : number = 0;
    TotalElCredits : number = 0;

    ngOnInit(): void {
        if (localStorage.getItem('ryp') != null) {
            this.ryp = JSON.parse(localStorage.getItem('ryp'));
            for (let i = 0; i < this.ryp.semesters.length; i++) {
                for (let j = 0; j < this.ryp.semesters[i].all.length; j++) {
                    this.semestersCredits[i] += this.ryp.semesters[i].all[j].credits;
                }
                
            }
            this.even = [new sem(this.ryp.semesters[1].all, []), new sem(this.ryp.semesters[3].all, []), new sem(this.ryp.semesters[5].all, []), new sem(this.ryp.semesters[7].all, [])];
            this.odd = [new sem(this.ryp.semesters[0].all, []), new sem(this.ryp.semesters[2].all, []), new sem(this.ryp.semesters[4].all, []), new sem(this.ryp.semesters[6].all, [])];
            for (let i = 0; i < this.even.length; i++) {
                this.even[i].number = [];
                for (let j = 0; j < 7 - this.even[i].sem.length; j++) {
                    this.even[i].number.push(1);
                }
            }

            for (let i = 0; i < this.odd.length; i++) {
                this.odd[i].number = [];
                for (let j = 0; j < 7 - this.odd[i].sem.length; j++) {
                    this.odd[i].number.push(1);
                }
            }
            

            this.creditsInfo = JSON.parse(localStorage.getItem('creditsInfo'));
            this.GeneralCredits = this.creditsInfo[0];
            this.BaseCredits = this.creditsInfo[1];
            this.ProfilingCredits = this.creditsInfo[2];
            this.TotalCredits += this.creditsInfo[3];

            this.elCreditsInfo = JSON.parse(localStorage.getItem('elCreditsInfo'));
            this.GeneralElCredits = this.elCreditsInfo[0];
            this.BaseElCredits = this.elCreditsInfo[1];
            this.ProfilingElCredits = this.elCreditsInfo[2];
            this.TotalElCredits += this.elCreditsInfo[3];
        }
    }
    
}


export class sem {
    sem : any[] = [];
    number : number[] = [];
    constructor(sem : any[], num: number[]) {
        this.sem = sem;
        this.number = num;
    }
}