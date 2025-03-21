import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: NbAuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.getToken().pipe(
      switchMap((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          // Clone the request and add the Authorization header
          const clonedReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token.getValue()}`,
            },
          });
          return next.handle(clonedReq);
        }
        return next.handle(req); // If token is invalid, proceed without modifying
      })
    );
  }
}
