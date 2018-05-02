import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Specialty } from './Specialty';
import { UserService } from './user.service';
import { User } from './User';
import { environment } from '../environments/environment';
import { DataService } from './data.service';

@Component({
    selector: 'editUser',
    templateUrl: './createUser.component.html',
    styleUrls: ['./app.component.css']
})
export class EditUserComponent implements OnInit {
    constructor(private http: HttpClient, private router: Router, private US : UserService, private DS : DataService) {}

    Name : string = this.DS.getUser().name;
    Password : string;
    RePassword : string;
    Role : string = this.DS.getUser().role;

    ngOnInit(): void {
        console.log(this.DS.getUser().password)
        if (this.US.getUser().role != 'Admin') {
            this.router.navigate(['']);
        }
    }

    save() : void {
        if(this.Password != this.RePassword) {
            alert('Неверный пароль при подтверждении');
        } else {
            this.http
            .put(environment.apiUrl + '/api/users/' + this.DS.getUser().id, 
                new User(this.Name, this.Password, this.Role))
            .subscribe(() => {
                this.router.navigate(['/userList']);
            })
        }
    }
}
