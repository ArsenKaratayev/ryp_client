import { User } from "./User";

export class Specialty {
    id : number;
    name : string;
    shifr : string;
    user : User

    constructor(name : string, shifr : string, user : User) {
        this.id;
        this.name = name;
        this.shifr = shifr;
        this.user = user;
    }
}