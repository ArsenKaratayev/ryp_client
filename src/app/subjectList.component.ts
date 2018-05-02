import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SubjectType, Subject } from './Subject';
import { Router } from '@angular/router';
import { ElectiveGroup } from './ElectiveGroup';
import { UserService } from './user.service';
import { User } from './User';
import { DataService } from './data.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'subjectList',
  templateUrl: './subjectList.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class SubjectListComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router, private US : UserService, private DS : DataService) {

  }
  Subjects : Subject[] = [];
  Electives : ElectiveGroup[] = [];
  ReqEl : boolean = true;
  Pre : Subject[] = [];
  showPre : boolean = false;
  user : string = this.US.getUser().id;

  loadSubjects() : void {
    this.http.get(environment.apiUrl + '/api/subjects')
    .catch((res : any) => {
      if (res.status == 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.US.setUser(undefined);
          return window.location.href = "http://localhost:4200";
      }   
    })
    .subscribe((data : Subject[]) => { 
      this.Subjects = data;
      this.loadElectives();
    })
  }

  loadElectives() : void {
    this.http.get(environment.apiUrl + '/api/electivegroups')
    .catch((res : any) => {
      if (res.status == 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.US.setUser(undefined);
          return window.location.href = "http://localhost:4200";
      }   
    })
    .subscribe((data : ElectiveGroup[]) => { 
      this.Electives = data;
      for (let i = 0; i < this.Electives.length; i++) {
        var arr = [];
        this.Electives[i].prerequisites = [];
        for (let k = 0; k < this.Electives[i].subjects.length; k++) {
          for (let j = 0; j < this.Electives[i].subjects[k].prerequisites.length; j++) {
            if (arr.indexOf(this.Electives[i].subjects[k].prerequisites[j].id) == -1) {
                arr.push(this.Electives[i].subjects[k].prerequisites[j])
            }
          }
        }
        this.Electives[i].prerequisites = arr;
      }
    })
  }

  changeReqEl() : void {
    this.ReqEl = !this.ReqEl;
  }

  mouseEnter(pre : Subject[]) : void {
    this.showPre = true;
    this.Pre = pre;
  }

  mouseLeave() : void {
    this.showPre = false;
  }

  ngOnInit() : void {
    this.loadSubjects();
    
  }

  deleteSubject(s : Subject) : void {
    this.http.delete(environment.apiUrl + '/api/subjects/' + s.id).subscribe(() => {
      this.ngOnInit();
    })
  }

  updateSubject(s : Subject) : void {
    this.DS.setSubject(s);
    this.router.navigate(['/editSubject']);
  }

  deleteElective(e : ElectiveGroup) : void {
    this.http.delete(environment.apiUrl + '/api/electivegroups/' + e.id).subscribe(() => {
      this.ngOnInit();
    })
  }
  
  updateElective(s : ElectiveGroup) : void {
    this.DS.setElective(s);
    this.router.navigate(['/editElective']);
  }

  createSubject() : void {
    this.router.navigate(['/createSubject']);
  }
  createElectiveGroup() : void {
    this.router.navigate(['/createElective']);
  }
}
