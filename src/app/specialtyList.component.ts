import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Specialty } from './Specialty';

@Component({
  selector: 'specialtyList',
  templateUrl: './specialtyList.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})
export class SpecialtyListComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router) {

  }
  Specialtys : Specialty[] = [];

  loadSpecialtys() : void {
    this.http.get('http://localhost:5001/api/specialtys').subscribe((data : Specialty[]) => { 
      this.Specialtys = data;
    })
  }

  ngOnInit() : void {
    this.loadSpecialtys();
  }

  deleteSpecialty(s : Specialty) : void {
    this.http.delete('http://localhost:5001/api/Specialtys/' + s.id).subscribe(() => {
      this.ngOnInit();
    })
  }

  updateSpecialty() : void {
    this.router.navigate(['/updateSpecialty']);
  }
}
