import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './User';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { environment } from '../environments/environment';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router, private US : UserService, private DS : DataService) { }
  
  User : User = this.US.getUser();;
  Token : string;

  ngOnInit(): void {
    var user = localStorage.getItem('user');
    if (user) {
      this.User = JSON.parse(user);
      this.US.setUser(this.User);
    } else {
      this.logOut();
    }
  }

  // login() : void {
  //   this.http.post(environment.apiUrl + '/api/token', { username : this.Name, password : this.Password}, {responseType: 'text'}).subscribe((res : any) => {
  //      localStorage.setItem('token', res); 
  //      this.Token = res;
  //      this.http.get(environment.apiUrl + '/api/currentuser').subscribe((res : User) => {
  //        this.User = res;
  //        this.US.setUser(res);
  //        localStorage.setItem('user', JSON.stringify(res)); 
  //        this.Password = undefined;
  //      })
  //     //  this.router.navigate(['']);
  //     })
  // }

  logOut() : void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.User = undefined;
    this.US.setUser(undefined);
    this.router.navigate(['login']);
  }
}
