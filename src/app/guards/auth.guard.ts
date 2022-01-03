import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// Services
import { LocalStorageService, FirebaseAuthService } from "../providers";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private FBauth: FirebaseAuthService, private lsServ: LocalStorageService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.FBauth.authState().pipe(map(auth => {
      if (!auth || auth === null || auth === undefined) {
        this.FBauth.logout().finally(() => {
          this.lsServ.deleteActiveUser();
          this.router.navigate(['/login']);
        })
        return false;
      } else {
        return true;
      }
    }));

  }

}
