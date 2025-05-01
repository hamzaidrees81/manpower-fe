import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: NbAuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.getToken().pipe(
      map((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          const payload = token.getPayload();

          if (payload) {

            // Optionally store in localStorage
            localStorage.setItem('isAllowAccess', JSON.stringify(payload?.roles[0]));

          }
          return true; // Allow access
        } else {
          this.router.navigate(['/auth/login']);
          return false; // Redirect to login
        }
      })
    );
  }
}
