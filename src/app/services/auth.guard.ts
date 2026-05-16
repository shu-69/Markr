import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Params } from '../Params';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<any> {
    if (this.authService.isAuthenticate) {
      return true;
    } else {
      // Try loggin again if user details are availalbe

      (await this.authService.autoAuthUser()).subscribe({
        next: (result: any) => {
          if (result.success) {
            return true;
          } else {
            this.router.navigate(['/' + Params.PageNames.login], {
              queryParams: { returnUrl: state.url },
            });
            return false;
          }
        },
        error: (error: any) => {
          this.router.navigate(['/' + Params.PageNames.login], {
            queryParams: { returnUrl: state.url },
          });
          return false;
        },
      });
    }
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true;
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true;
  }
}
