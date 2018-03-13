import { Specialty } from "./Specialty";
import { Subject } from "./Subject";

export class Ryp {
    id : number;
    specialty : Specialty;
    year : string;
    subjects : Subject[][];

    constructor(specialty : Specialty, year : string, subjects : Subject[][]) {
        this.id;
        this.specialty = specialty;
        this.year = year;
        this.subjects = subjects;
    }
}