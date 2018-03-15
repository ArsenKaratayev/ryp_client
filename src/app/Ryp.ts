import { Specialty } from "./Specialty";
import { Subject } from "./Subject";
import { ElectiveGroup } from "./ElectiveGroup";

export class Ryp {
    id : number;
    specialty : Specialty;
    year : string;
    subjects : Subject[][];
    electives : ElectiveGroup[][];

    constructor(specialty : Specialty, year : string, subjects : Subject[][], electives : ElectiveGroup[][]) {
        this.id;
        this.specialty = specialty;
        this.year = year;
        this.subjects = subjects;
        this.electives = electives;
    }
}