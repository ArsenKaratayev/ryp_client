import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './User';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { DataService } from './data.service';
import { environment } from '../environments/environment';

@Component({
    selector: 'userList',
    templateUrl: './userList.component.html',
    styleUrls: ['./app.component.css'],
})
export class UserListComponent implements OnInit {
    constructor(private http: HttpClient, private router: Router, private US : UserService, private DS : DataService) { }

    Users : User[] = [];

    ngOnInit(): void {
        if (this.US.getUser().role != 'Admin') {
            this.router.navigate(['']);
        }
        this.http.get(environment.apiUrl + '/api/users').subscribe((data : User[]) => { 
            this.Users = data;
            this.Users.splice(this.Users.map((el)=>el.role).indexOf(this.US.getUser().role), 1);
        })
    }

    deleteUser(u : User) : void {
        this.http.delete(environment.apiUrl + '/api/users/' + u.id).subscribe(() => {
            this.ngOnInit();
        })
    }

    updateUser(u : User) : void {
        this.DS.setUser(u);
        this.router.navigate(['/editUser']);
    }

    createUser() : void {
        this.router.navigate(['/createUser']);
    }
}
