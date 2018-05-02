import { SubjectType, Subject } from "./Subject";
import { User } from "./User";

export interface IElectiveGroup {
    subjects;
}

export class ElectiveGroup implements IElectiveGroup {
    id :  number;
    name : string;
    type : SubjectType;
    pr : number;
    lec : number;
    lab : number;
    credits : number;
    shifr : string;
    subjects : Subject[] = [];
    prerequisites : Subject[] = [];
    userId : string;

    constructor(name : string, type : SubjectType, pr : number, shifr : string, sub : Subject[], user : string) {
        this.id;
        this.name = name;
        this.type = type;
        this.pr = pr;
        this.credits = pr;
        this.shifr = shifr;
        this.subjects = sub;
        this.userId = user;
    }
}