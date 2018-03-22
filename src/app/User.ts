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

    constructor(name : string, password : string) {
        this.name = name;
        this.password = password;
    }
}