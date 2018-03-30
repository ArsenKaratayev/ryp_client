export enum UserRole {
    mg,
    or,
    op
}
export class User {
    id : number;
    name : string;
    password : string;
    role : UserRole;

    constructor(name : string, password : string, role : UserRole) {
        this.name = name;
        this.password = password;
        this.role = role;
    }
}