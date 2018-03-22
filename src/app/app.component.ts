import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './User';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router, private US : UserService) { }
  
  User : User;
  Name : string;
  Password : string;
  Users : User[] = [];

  ngOnInit(): void {
    this.http.get('http://localhost:5001/api/users').subscribe((data : User[]) => { 
      this.Users = data;       
    })
    // let options: Intl.DateTimeFormatOptions = {
    //   day: "numeric", month: "numeric", year: "numeric",
    //   hour: "2-digit", minute: "2-digit"
    // };
    // console.log(new Date().toLocaleDateString("en-GB", options))
  }

  login() : void {
    var id;
    for (let i = 0; i < this.Users.length; i++) {
        if (this.Users[i].name == this.Name && this.Users[i].password == this.Password) {
            id = this.Users[i].id;
            break;
        }
    }
    this.http.get('http://localhost:5001/api/users/' + id).subscribe((res : User) => { this.US.setUser(res); this.User = this.US.getUser(); console.log(this.US.getUser()) })
  }
}
