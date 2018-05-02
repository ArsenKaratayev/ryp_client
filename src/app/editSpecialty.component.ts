import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Specialty } from './Specialty';
import { UserService } from './user.service';
import { DataService } from './data.service';
import { environment } from '../environments/environment';

@Component({
    selector: 'editSpecialty',
    templateUrl: './createSpecialty.component.html',
    styleUrls: ['./app.component.css']
})
export class EditSpecialtyComponent {
    constructor(private http: HttpClient, private router: Router, private US : UserService, private DS : DataService) {}

    Name : string = this.DS.getSpecialty().name;
    Shifr : string = this.DS.getSpecialty().shifr;

    save() : void {
        if(this.Name == null) {
            alert('Введите название специальности');
        } else if(this.Shifr == null) {
            alert('Введите шифр специальности');
        } else {
            this.http
            .put(environment.apiUrl + '/api/specialtys/' + this.DS.getSpecialty().id, 
                new Specialty(this.Name, this.Shifr, this.US.getUser().id), {responseType: 'text'})
            .subscribe(() => {
                this.router.navigate(['/specialtyList']);
            })
        }
    }
}
