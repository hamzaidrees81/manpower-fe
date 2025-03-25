import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { switchMap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: NbAuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.getToken().pipe(
      switchMap((token: NbAuthJWTToken) => {
        let clonedReq = req;

        if (token.isValid()) {
          clonedReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token.getValue()}`,
            },
          });
        }

        return next.handle(clonedReq).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) { // Token expired or invalid
              this.authService.logout('email'); // Logout user from Nebular Auth
              this.router.navigate(['/auth/login']); // Redirect to login
            }
            return throwError(error);
          })
        );
      })
    );
  }
}
