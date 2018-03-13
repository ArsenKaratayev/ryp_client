import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SubjectHours, SubjectType, Subject } from './Subject';
import { Router } from '@angular/router';

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
  ngOnInit(): void {
    this.http.get('http://localhost:5001/api/subjects').subscribe((data : Subject[]) => { 
      this.Subjects = data;//.map((el) => el.firstname);
    })
  }
  deleteSubject(s : Subject) : void {
    this.http.delete('http://localhost:5001/api/subjects/' + s.id).subscribe(() => {
      this.ngOnInit();
    })
  }
  updateSubject() : void {
    this.router.navigate(['/updateSubject']);
  }
}
