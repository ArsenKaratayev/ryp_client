import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Specialty } from './Specialty';
import { UserService } from './user.service';
import { User } from './User';
import { DataService } from './data.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'specialtyList',
  templateUrl: './specialtyList.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class SpecialtyListComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router, private US : UserService, private DS : DataService) {

  }
  Specialtys : Specialty[] = [];
  user : string = this.US.getUser().id;

  loadSpecialtys() : void {
    this.http.get(environment.apiUrl + '/api/specialtys')
    .catch((res : any) => {
      if (res.status == 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.US.setUser(undefined);
          return window.location.href = "http://localhost:4200";
      }   
    })
    .subscribe((data : Specialty[]) => { 
      this.Specialtys = data;
    })
  }

  ngOnInit() : void {
    this.loadSpecialtys();
  }

  deleteSpecialty(s : Specialty) : void {
    this.http.delete(environment.apiUrl + '/api/specialtys/' + s.id).subscribe(() => {
      this.ngOnInit();
    })
  }

  updateSpecialty(s : Specialty) : void {
    this.DS.setSpecialty(s);
    this.router.navigate(['/editSpecialty']);
  }

  createSpecialty() : void {
    this.router.navigate(['/createSpecialty']);
  }
}
