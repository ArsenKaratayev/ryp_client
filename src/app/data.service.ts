import { Injectable } from '@angular/core';
import { Subject } from './Subject';
import { Specialty } from './Specialty';
import { Ryp } from './Ryp';
import { ElectiveGroup } from './ElectiveGroup';
import { User } from './User';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { UserService } from './user.service';

@Injectable()
export class DataService {
    constructor(private http: HttpClient, private router: Router, private US : UserService) {}

    subject : Subject;
    specialty : Specialty;
    elective : ElectiveGroup;
    ryp : Ryp;
    user : User;
    subjects : Subject[] = [];
    specialtys : Specialty[] = [];
    electives : ElectiveGroup[] = [];
    ryps : Ryp[] = [];
    rypPrototype : Ryp;

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

    getRypPrototype() : Ryp {
        return this.rypPrototype;
    }
    setRypPrototype(r : Ryp) : void {
        this.rypPrototype = r;
    }

    getUser() : User {
        return this.user;
    }
    setUser(u : User) : void {
        this.user = u;
    }

    loadSubjects() : void {
        this.http.get(environment.apiUrl + '/api/subjects')
        .catch((res : any) => {
            if (res.status == 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                this.US.setUser(undefined);
                return this.router.navigate(['']);
            }   
        })
        .subscribe((data : Subject[]) => { 
            this.subjects = data;
        })
        // return this.subjects;
    }

    loadSpecialtys() : void {
        this.http.get(environment.apiUrl + '/api/specialtys')
        .catch((res : any) => {
            if (res.status == 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                this.US.setUser(undefined);
                return this.router.navigate(['']);
            }   
        })
        .subscribe((data : Specialty[]) => {
            this.specialtys = data;
        })
        // return this.specialtys;
    }

    loadElectives() : void {
        this.http.get(environment.apiUrl + '/api/electivegroups')
        .catch((res : any) => {
            if (res.status == 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                this.US.setUser(undefined);
                return this.router.navigate(['']);
            }   
        })
        .subscribe((data : ElectiveGroup[]) => { 
            this.electives = data;
            for (let i = 0; i < this.electives.length; i++) {
                var arr = [];
                this.electives[i].prerequisites = [];
                for (let k = 0; k < this.electives[i].subjects.length; k++) {
                    for (let j = 0; j < this.electives[i].subjects[k].prerequisites.length; j++) {
                        if (arr.indexOf(this.electives[i].subjects[k].prerequisites[j].id) == -1) {
                            arr.push(this.electives[i].subjects[k].prerequisites[j])
                        }
                    }
                }
                this.electives[i].prerequisites = arr
            }
        })
        // return this.electives;
    }

    loadRyps() : void {
        this.http.get(environment.apiUrl + '/api/ryps')
        .catch((res : any) => {
            if (res.status == 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                this.US.setUser(undefined);
                return this.router.navigate(['']);
            }   
        })
        .subscribe((data : Ryp[]) => {
            this.ryps = data;
        })
        // return this.ryps;
    }

    getSubjects() : Subject[] {
        this.loadSubjects;
        return this.subjects;
    }
    getSpecialtys() : Specialty[] {
        this.loadSpecialtys;
        return this.specialtys;
    }
    getElectives() : ElectiveGroup[] {
        this.loadElectives;
        return this.electives;
    }
    getRyps() : Ryp[] {
        this.loadRyps;
        return this.ryps;
    }
}
