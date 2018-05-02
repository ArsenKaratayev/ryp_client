import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Specialty } from './Specialty';
import { UserService } from './user.service';
import { environment } from '../environments/environment';

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
            alert('Введите название специальности');
        } else if(this.Shifr == null) {
            alert('Введите шифр специальности');
        } else {
            this.http
            .post(environment.apiUrl + '/api/specialtys', 
                new Specialty(this.Name, this.Shifr, this.US.getUser().id), {responseType: 'text'})
            .subscribe(() => {
                this.router.navigate(['/specialtyList']);
            })
        }
    }
}
