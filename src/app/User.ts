// export enum UserRole {
//     mg,
//     or,
//     op
// }
export class User {
    id : string;
    name : string;
    password : string;
    role : string;

    constructor(name : string, password : string, role : string) {
        this.name = name;
        this.password = password;
        this.role = role;
    }
}