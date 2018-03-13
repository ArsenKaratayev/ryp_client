import { Component, OnInit } from '@angular/core';
import { SubjectHours, SubjectType, Subject } from './Subject';
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
    even : Subject[][];
    odd : Subject[][];
    semestersCredits : number[] = [0, 0, 0, 0, 0, 0, 0, 0];
    creditsInfo : number[];
    GeneralCredits : number = 0;
    BaseCredits : number = 0;
    ProfilingCredits : number = 0;
    PractiseCredits : number = 6;
    AttestationCredits : number = 3;
    TotalCredits : number = 9;

    ngOnInit(): void {
        if (localStorage.getItem('ryp') != null) {
            this.ryp = JSON.parse(localStorage.getItem('ryp'));
            for (let i = 0; i < this.ryp.subjects.length; i++) {
                for (let j = 0; j < this.ryp.subjects[i].length; j++) {
                    this.semestersCredits[i] += this.ryp.subjects[i][j].credits;
                }
                
            }
            this.even = [this.ryp.subjects[1], this.ryp.subjects[3], this.ryp.subjects[5], this.ryp.subjects[7]];
            this.odd = [this.ryp.subjects[0], this.ryp.subjects[2], this.ryp.subjects[4], this.ryp.subjects[6]];

            this.creditsInfo = JSON.parse(localStorage.getItem('creditsInfo'));
            this.GeneralCredits = this.creditsInfo[0];
            this.BaseCredits = this.creditsInfo[1];
            this.ProfilingCredits = this.creditsInfo[2];
            this.TotalCredits += this.GeneralCredits + this.BaseCredits + this.ProfilingCredits;
        }
    }
    
}