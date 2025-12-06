import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { StateStorageService } from 'app/core/auth/state-storage.service';
import { LoginService } from 'app/login/login.service';

@Injectable()
export class AuthExpiredInterceptor implements HttpInterceptor {
  private readonly loginService = inject(LoginService);
  private readonly stateStorageService = inject(StateStorageService);
  private readonly router = inject(Router);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap({
        error: (err: HttpErrorResponse) => {
          if (err.status === 401 && err.url && !err.url.includes('api/account')) {
            this.stateStorageService.storeUrl(this.router.routerState.snapshot.url);
            this.loginService.login();
          }
        },
      }),
    );
  }
}
