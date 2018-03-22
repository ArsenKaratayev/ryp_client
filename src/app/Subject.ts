import { User } from "./User";

export class SubjectType {
    name : string;
    code : string;
    color : string;

    constructor(name : string) {
        this.name = name;
        this.code = name[0];
        if (name == "Базовая") {
            this.color = "#64B5F6";
        } else if (name == "Профилирующая") {
            this.color = "#7986CB";
        } else if (name == "Общеобразовательная") {
            this.color = "#81C784";
        } else {
            this.color = "#FF7043";
        }
    }
}
export class SubjectHours {
    lec : number;
    lab : number;
    pr : number;

    constructor(lec : number, lab : number, pr : number) {
        this.lec = lec;
        this.lab = lab;
        this.pr = pr;
    }
}
export class Subject {
    id :  number;
    name : string;
    type : SubjectType;
    hours : SubjectHours;
    credits : number;
    shifr : string;
    prerequisites : Subject[] = [];
    user : User;
    // date : string;

    constructor(name : string, type : SubjectType, hours : SubjectHours, shifr : string, pre : Subject[], user : User) {
        this.id;
        this.name = name;
        this.type = type;
        this.hours = hours;
        this.credits = hours.lec+hours.lab+hours.pr;
        this.shifr = shifr;
        this.prerequisites = pre;
        this.user = user;
        // this.date = date.toLocaleDateString();
    }
}