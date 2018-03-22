import { Injectable } from '@angular/core';
import { User } from './User';

@Injectable()
export class UserService {
  constructor() { }

  User : User;

  getUser(): User {
    return this.User;
  }
  setUser(u : User) : void {
    this.User = u;
  }
}
