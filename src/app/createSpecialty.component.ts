import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Specialty } from './Specialty';
import { UserService } from './user.service';

@Component({
    selector: 'createSpecialty',
    templateUrl: './createSpecialty.component.html',
    styleUrls: ['./app.component.css']
})
export class CreateSpecialtyComponent {
    constructor(private http: HttpClient, private router: Router, private US : UserService) {}

    Name : string;
    Shifr : string;

    save() : void {
        if(this.Name == null) {
            alert('Введите название специальности!');
            return;
        } else {
            this.http
            .post('http://localhost:5001/api/specialtys', 
                new Specialty(this.Name, this.Shifr, this.US.getUser()))
            .subscribe(() => {
                console.log('here!');
            })
        }
    }
}
