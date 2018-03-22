import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from './User';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./app.component.css']
})
export class LoginComponent implements OnInit {
    constructor(private http: HttpClient, private router: Router) {}

    Users : User[] = [];
    Name : string;
    Password : string;

    ngOnInit(): void {
        this.http.get('http://localhost:5001/api/users').subscribe((data : User[]) => { 
            this.Users = data;       
        })
    }

    login() : void {
        var id;
        for (let i = 0; i < this.Users.length; i++) {
            if (this.Users[i].name == this.Name && this.Users[i].password == this.Password) {
                id = this.Users[i].id;
                break;
            }
        }
        this.http.get('http://localhost:5001/api/users/' + id).subscribe(res => { this.router.navigate(['']); })
    }
}
