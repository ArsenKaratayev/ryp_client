import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Specialty } from './Specialty';
import { UserService } from './user.service';
import { User } from './User';
import { DataService } from './data.service';
import { environment } from '../environments/environment';
import { Ryp } from './Ryp';

@Component({
  selector: 'rypList',
  templateUrl: './rypList.component.html',
  styleUrls: ['./app.component.css'],
})
export class RypListComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router, private US : UserService, private DS : DataService) {

  }
  Ryps : Ryp[] = [];
  CheckedRyps : Ryp[] = [];
  PrototypeRyps : Ryp[] = [];
  user : User = this.US.getUser();

  loadRyps() : void {
    this.http.get(environment.apiUrl + '/api/check')
    .catch((res : any) => {
      if (res.status == 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.US.setUser(undefined);
          return window.location.href = "http://localhost:4200";
      }   
    })
    .subscribe((data : Ryp[]) => { 
      this.Ryps = [];
      this.PrototypeRyps = []
      for (let i = 0; i < data.length; i++) {
        if (data[i].prototype == 0) {
          this.Ryps.push(data[i])
        } else {
          this.PrototypeRyps.push(data[i])
        }
      }
      this.loadClosedRyps();
    })
  }

  loadClosedRyps() : void {
    this.http.get(environment.apiUrl + '/api/fullcheck')
    .catch((res : any) => {
      if (res.status == 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.US.setUser(undefined);
          return window.location.href = "http://localhost:4200";
      }   
    })
    .subscribe((data : Ryp[]) => { 
      this.CheckedRyps = data;
    })
  }

  ngOnInit() : void {
    this.loadRyps();
  }

  showRyp(r : Ryp) : void {
    this.DS.setRyp(r);
    this.router.navigate(['/ryp']);
  }

  deleteRyp(r : Ryp) : void {
    this.http.delete(environment.apiUrl + '/api/ryps/' + r.id).subscribe(() => {
      this.ngOnInit();
    })
  }

  updateRyp(r : Ryp) : void {
    this.DS.setRyp(r);
    this.router.navigate(['/editRyp']);
  }

  updateRypPrototype(r : Ryp) : void {
    this.DS.setRyp(r);
    this.router.navigate(['/editRypPrototype']);
  }

  checkRyp(r : Ryp) : void {
    this.http.post(environment.apiUrl + '/api/check', r.id, {responseType: 'text'})
    .catch((res : any) => {
      if (res.status == 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.US.setUser(undefined);
          return window.location.href = "http://localhost:4200";
      }   
    })
    .subscribe(() => {
      this.ngOnInit();
    })
  }
  closeRyp(r : Ryp) : void {
    this.http.post(environment.apiUrl + '/api/fullcheck', r, {responseType: 'text'})
    .catch((res : any) => {
      if (res.status == 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.US.setUser(undefined);
          return window.location.href = "http://localhost:4200";
      }   
    })
    .subscribe(() => {
      this.ngOnInit();
    })
  }
  reRyp(r : Ryp) : void {
    this.http.put(environment.apiUrl + '/api/check/' + r.id, r, {responseType: 'text'})
    .catch((res : any) => {
      if (res.status == 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.US.setUser(undefined);
          return window.location.href = "http://localhost:4200";
      }   
    })
    .subscribe(() => {
      this.ngOnInit();
    })
  }
  openRyp(r : any) : void {
    this.http.put(environment.apiUrl + '/api/fullcheck/' + r.rypId, r, {responseType: 'text'})
    .catch((res : any) => {
      if (res.status == 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.US.setUser(undefined);
          return window.location.href = "http://localhost:4200";
      }   
    })
    .subscribe(() => {
      this.ngOnInit();
    })
  }
  createByRypPrototype(r : any) : void {
    this.DS.setRypPrototype(r);
    this.router.navigate(['/createRyp']);
  }
  createRyp() : void {
    this.DS.setRypPrototype(undefined);
    this.router.navigate(['/createRyp']);
  }
  createRypPrototype() : void {
    this.router.navigate(['/createRypPrototype']);
  }
}
