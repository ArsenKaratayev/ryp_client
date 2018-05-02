import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './User';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { environment } from '../environments/environment';
import { DataService } from './data.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./app.component.css'],
})
export class LoginComponent implements OnInit {
    constructor(private http: HttpClient, private router: Router, private US : UserService, private DS : DataService) { }

    Token : string;
    Name : string;
    Password : string;
    ErrorMessage : string = "";
    error : boolean = false;

    ngOnInit(): void {
        if (this.US.getUser()) {
            this.router.navigate(['']);
        }
    }

    login() : void {
        this.http.post(environment.apiUrl + '/api/token', { username : this.Name, password : this.Password}, {responseType: 'text'})
        .catch((res : any) => {
            if (res.status == 400) {
                this.error = true;
                return this.ErrorMessage = "Неверный логин или пароль"
            }   
        })
        .subscribe((res : any) => {
            localStorage.setItem('token', res); 
            this.Token = res;
            if (this.Token) {
                this.http.get(environment.apiUrl + '/api/currentuser').subscribe((res : User) => {
                    this.US.setUser(res);
                    localStorage.setItem('user', JSON.stringify(res)); 
                    this.Password = undefined;
                    window.location.href = "http://localhost:4200";
                })
            }
            
        })
    }
}
