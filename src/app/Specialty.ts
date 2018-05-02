import { User } from "./User";

export class Specialty {
    id : number;
    name : string;
    shifr : string;
    userId : string

    constructor(name : string, shifr : string, user : string) {
        this.id;
        this.name = name;
        this.shifr = shifr;
        this.userId = user;
    }
}