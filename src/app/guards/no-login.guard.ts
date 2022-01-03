import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// Services
import { FirebaseAuthService } from "../providers";

@Injectable({
  providedIn: 'root'
})
export class NoLoginGuard implements CanActivate {

  constructor(private FBauth: FirebaseAuthService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.FBauth.authState().pipe(map(auth => {
      if (!auth || auth === null || auth === undefined) {
        return true;
      } else {
        this.router.navigate(['home']);
        return false;
      }
    }));

  }

}
