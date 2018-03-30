import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Specialty } from './Specialty';
import { UserService } from './user.service';
import { UserRole, User } from './User';

@Component({
    selector: 'createUser',
    templateUrl: './createUser.component.html',
    styleUrls: ['./app.component.css']
})
export class CreateUserComponent {
    constructor(private http: HttpClient, private router: Router, private US : UserService) {}

    Name : string;
    Password : string;
    RePassword : string;
    Role : UserRole;

    save() : void {
        if(this.Password != this.RePassword) {
            alert('Неверный пароль!');
            return;
        } else {
            this.http
            .post('http://localhost:5001/api/users', 
                new User(this.Name, this.Password, this.Role))
            .subscribe(() => {
                console.log('here!');
            })
        }
    }
}
