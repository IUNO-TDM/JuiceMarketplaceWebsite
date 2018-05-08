import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) {
    }

    getUser(): Observable<User> {
        return this.http.get<User>("/api/users/me");
    }

    isLoggedIn(): Observable<boolean> {
        return this.http.get<boolean>("/auth/loggedin", { headers: { 'Cache-Control' : 'no-cache' } } ).flatMap(loggedin => {
            return Observable.of(loggedin);
        })
    }

    isAdmin(): Observable<boolean> {
        return new Observable<boolean>(subscriber => {
            this.isLoggedIn().subscribe(loggedIn => {
                if (!loggedIn) {
                    return subscriber.next(false);
                }

                this.getUser().subscribe(user => {
                    const isAdmin = user.roles.indexOf('Admin') >= 0;
                    subscriber.next(isAdmin);
                });
            });


        });
    }
}

@Injectable()
export class AccessGuard implements CanActivate {
    constructor(private http: HttpClient, private router: Router) {

    }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.http.get<boolean>("/auth/loggedin").flatMap(loggedin => {
            if (!loggedin) {
                window.location.href = "/";
            }
            return Observable.of(loggedin);
        });
    }

    guardLoggedIn(): Observable<boolean> {
        return this.http.get<boolean>("/auth/loggedin").flatMap(loggedin => {
            if (!loggedin) {
                window.location.href = "/";
            }
            return Observable.of(loggedin);
        });
    }
}

export class User {
    id: string;
    username: string;
    firstname: string;
    lastname: string;
    useremail: string;
    oauth2provider: string;
    roles: string[];
}