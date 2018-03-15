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

  // transformElectiveToSubject(e : ElectiveGroup) : Subject {
  //   var pre = [];
  //   for (let i = 0; i < e.subjects.length; i++) {
  //     if (e.subjects[i].prerequisites !=  null) {
  //       pre.push(e.subjects[i].prerequisites);
  //       continue;
  //     }
  //   }
  //   var s = new Subject(e.name, e.type, new SubjectHours(0, 0, e.credits), e.shifr, pre);
  //   s.id = e.id;
  //   return s;
  // }

  changeReqEl() : void {
    this.ReqEl = !this.ReqEl;
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
