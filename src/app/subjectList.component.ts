import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SubjectHours, SubjectType, Subject } from './Subject';
import { Router } from '@angular/router';
import { ElectiveGroup } from './ElectiveGroup';
import { UserService } from './user.service';
import { User } from './User';
import { DataService } from './data.service';

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
  user : User = this.US.getUser();

  loadSubjects() : void {
    this.http.get('http://localhost:5001/api/subjects').subscribe((data : Subject[]) => { 
      this.Subjects = data;
      this.loadElectives();
    })
  }

  loadElectives() : void {
    this.http.get('http://localhost:5001/api/electivegroups').subscribe((data : ElectiveGroup[]) => { 
      this.Electives = data;
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
    this.http.delete('http://localhost:5001/api/subjects/' + s.id).subscribe(() => {
      this.ngOnInit();
    })
  }

  updateSubject(s : Subject) : void {
    this.DS.setSubject(s);
    this.router.navigate(['/editSubject']);
  }

  deleteElective(e : ElectiveGroup) : void {
    this.http.delete('http://localhost:5001/api/electivegroups/' + e.id).subscribe(() => {
      this.ngOnInit();
    })
  }
  
  updateElective(s : ElectiveGroup) : void {
    this.DS.setElective(s);
    this.router.navigate(['/editElective']);
  }
}
