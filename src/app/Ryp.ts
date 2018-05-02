import { Specialty } from "./Specialty";
import { Subject } from "./Subject";
import { ElectiveGroup } from "./ElectiveGroup";
import { User } from "./User";

export class Ryp {
    id : number;
    specialty : Specialty;
    year : string;
    semesters : Semester[];
    userId : string;
    operatorCheck : number = 0;
    fullCheck : number = 0;
    isOpen : number;
    prototype : number;

    constructor(specialty : Specialty, year : string, sems : Semester[], user : string) {
        this.id;
        this.specialty = specialty;
        this.year = year;
        this.semesters = sems;
        this.userId = user;
    }
}

export class Semester {
    subjects : Subject[];
    electives : ElectiveGroup[];
    all : any[] = [];

    constructor(subs : Subject[], elecs : ElectiveGroup[], all : any[]) {
        this.all = all;
        this.subjects = subs;
        this.electives = elecs;
    }
}