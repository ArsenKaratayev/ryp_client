import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SubjectHours, SubjectType, Subject } from './Subject';
import { Router } from '@angular/router';
import { ElectiveGroup } from './ElectiveGroup';

@Component({
  selector: 'subjectList',
  templateUrl: './subjectList.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class SubjectListComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router) {

  }
  Subjects : Subject[] = [];
  Electives : ElectiveGroup[] = [];
  ReqEl : boolean = true;
  Pre : Subject[] = [];
  showPre : boolean = false;

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

  updateSubject() : void {
    this.router.navigate(['/updateSubject']);
  }

  deleteElective(s : ElectiveGroup) : void {
    this.http.delete('http://localhost:5001/api/electivegroups/' + s.id).subscribe(() => {
      this.ngOnInit();
    })
  }
  
  updateElective() : void {
    this.router.navigate(['/updateElective']);
  }
}
