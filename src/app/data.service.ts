import { Injectable } from '@angular/core';
import { Subject } from './Subject';
import { Specialty } from './Specialty';
import { Ryp } from './Ryp';
import { ElectiveGroup } from './ElectiveGroup';
import { User } from './User';

@Injectable()
export class DataService {
    constructor() {}

    subject : Subject;
    specialty : Specialty;
    elective : ElectiveGroup;
    ryp : Ryp;
    user : User;

    getSubject() : Subject {
        return this.subject;
    }
    setSubject(s : Subject) : void {
        this.subject = s;
    }

    getSpecialty() : Specialty {
        return this.specialty;
    }
    setSpecialty(s : Specialty) : void {
        this.specialty = s;
    }

    getElective() : ElectiveGroup {
        return this.elective;
    }
    setElective(e : ElectiveGroup) : void {
        this.elective = e;
    }

    getRyp() : Ryp {
        return this.ryp;
    }
    setRyp(r : Ryp) : void {
        this.ryp = r;
    }

    getUser() : User {
        return this.user;
    }
    setUser(u : User) : void {
        this.user = u;
    }
}
