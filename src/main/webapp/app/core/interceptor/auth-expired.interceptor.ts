import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

import { tap } from 'rxjs';

import { AuthServerProvider, StateStorageService } from 'app/core/auth';

export const authExpiredInterceptor: HttpInterceptorFn = (req, next) => {
  const authServerProvider = inject(AuthServerProvider);
  const stateStorageService = inject(StateStorageService);
  const router = inject(Router);

  return next(req).pipe(
    tap({
      error(err: HttpErrorResponse) {
        if (err.status === 401 && err.url && !err.url.includes('api/account')) {
          stateStorageService.storeUrl(router.routerState.snapshot.url);
          authServerProvider.login();
        }
      },
    }),
  );
};
