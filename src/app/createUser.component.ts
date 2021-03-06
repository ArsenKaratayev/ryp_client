import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Specialty } from './Specialty';
import { UserService } from './user.service';
import { User } from './User';
import { environment } from '../environments/environment';

@Component({
    selector: 'createUser',
    templateUrl: './createUser.component.html',
    styleUrls: ['./app.component.css']
})
export class CreateUserComponent implements OnInit {
    constructor(private http: HttpClient, private router: Router, private US : UserService) {}

    Name : string;
    Password : string;
    RePassword : string;
    Role : string;

    ngOnInit(): void {
        if (this.US.getUser().role != 'Admin') {
            this.router.navigate(['']);
        }
    }

    save() : void {
        if(this.Password != this.RePassword) {
            alert('Неверный пароль при подтверждении');
        } else {
            this.http
            .post(environment.apiUrl + '/api/users', 
                new User(this.Name, this.Password, this.Role))
            .subscribe(() => {
                this.router.navigate(['/userList']);
            })
        }
    }
}
