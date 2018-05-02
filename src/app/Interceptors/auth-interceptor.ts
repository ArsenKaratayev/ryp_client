import { Injectable } from "@angular/core";
import { HttpInterceptor } from "@angular/common/http";
import { HttpRequest, HttpHandler } from "@angular/common/http";




@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor() {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const token = localStorage.getItem('token');
        const isTokenUrl = req.url.toLocaleLowerCase().endsWith('token');
        if (token && !isTokenUrl) {
            const authReq = req.clone({headers: req.headers.set('Authorization', `Bearer ${token}`)});
            return next.handle(authReq);
        }

        return next.handle(req);
    }
}
