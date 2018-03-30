import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Specialty } from './Specialty';
import { UserService } from './user.service';
import { User } from './User';
import { DataService } from './data.service';

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
  user : User = this.US.getUser();

  loadSpecialtys() : void {
    this.http.get('http://localhost:5001/api/specialtys').subscribe((data : Specialty[]) => { 
      this.Specialtys = data;
    })
  }

  ngOnInit() : void {
    this.loadSpecialtys();
  }

  deleteSpecialty(s : Specialty) : void {
    this.http.delete('http://localhost:5001/api/specialtys/' + s.id).subscribe(() => {
      this.ngOnInit();
    })
  }

  updateSpecialty(s : Specialty) : void {
    this.DS.setSpecialty(s);
    this.router.navigate(['/editSpecialty']);
  }
}
