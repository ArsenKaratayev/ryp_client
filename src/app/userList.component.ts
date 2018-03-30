import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './User';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { DataService } from './data.service';

@Component({
    selector: 'userList',
    templateUrl: './userList.component.html',
    styleUrls: ['./app.component.css'],
})
export class UserListComponent implements OnInit {
    constructor(private http: HttpClient, private router: Router, private US : UserService, private DS : DataService) { }

    Users : User[] = [];

    ngOnInit(): void {
        this.http.get('http://localhost:5001/api/users').subscribe((data : User[]) => { 
            this.Users = data;
            this.Users.splice(this.Users.map((el)=>el.role).indexOf(this.US.getUser().role), 1);
        })
    }

    deleteUser(u : User) : void {
        this.http.delete('http://localhost:5001/api/users/' + u.id).subscribe(() => {
            this.ngOnInit();
        })
    }

    updateUser(u : User) : void {
        this.DS.setUser(u);
        this.router.navigate(['/editUser']);
    }
}
