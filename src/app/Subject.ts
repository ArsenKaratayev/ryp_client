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

export class Subject {
    id :  number;
    name : string;
    type : SubjectType;
    lec : number;
    lab : number;
    pr : number;
    credits : number;
    shifr : string;
    prerequisites : Subject[] = [];
    userId : string;
    // date : string;

    constructor(name : string, type : SubjectType, lec : number, lab : number, pr : number, shifr : string, pre : Subject[], user : string) {
        this.id;
        this.name = name;
        this.type = type;
        this.lec = lec;
        this.lab = lab;
        this.pr = pr;
        this.credits = lec + lab + pr;
        this.shifr = shifr;
        this.prerequisites = pre;
        this.userId = user;
        // this.date = date.toLocaleDateString();
    }
}
