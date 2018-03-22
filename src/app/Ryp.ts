import { Specialty } from "./Specialty";
import { Subject } from "./Subject";
import { ElectiveGroup } from "./ElectiveGroup";
import { User } from "./User";

export class Ryp {
    id : number;
    specialty : Specialty;
    year : string;
    subjects : Subject[][];
    electives : ElectiveGroup[][];
    user : User

    constructor(specialty : Specialty, year : string, subjects : Subject[][], electives : ElectiveGroup[][], user : User) {
        this.id;
        this.specialty = specialty;
        this.year = year;
        this.subjects = subjects;
        this.electives = electives;
        this.user = user;
    }
}