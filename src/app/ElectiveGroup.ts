import { SubjectType, SubjectHours, Subject } from "./Subject";

export interface IElectiveGroup {
    subjects;
}

export class ElectiveGroup implements IElectiveGroup {
    id :  number;
    name : string;
    type : SubjectType;
    hours : SubjectHours;
    credits : number;
    shifr : string;
    subjects : Subject[];
    prerequisites : Subject[];

    constructor(name : string, type : SubjectType, hours : SubjectHours, shifr : string, sub : Subject[]) {
        this.id;
        this.name = name;
        this.type = type;
        this.hours = hours;
        this.credits = hours.lec+hours.lab+hours.pr;
        this.shifr = shifr;
        this.subjects = sub;
        var arr = [];
        for (let i = 0; i < sub.length; i++) {
            if (sub[i].prerequisites != null) {
                for (let j = 0; j < sub[i].prerequisites.length; j++) {
                    if (arr.map((el)=>el.id).indexOf(sub[i].prerequisites[j].id) == -1) {
                        arr.push(sub[i].prerequisites[j])
                    }
                }
            }
        }
        this.prerequisites = arr;
    }
}