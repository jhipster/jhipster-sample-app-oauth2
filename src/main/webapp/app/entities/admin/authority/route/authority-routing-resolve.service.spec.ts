import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, convertToParamMap } from '@angular/router';

import { of } from 'rxjs';

import { IAuthority } from '../authority.model';
import { AuthorityService } from '../service/authority.service';

import authorityResolve from './authority-routing-resolve.service';

describe('Authority routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let service: AuthorityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate');
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    service = TestBed.inject(AuthorityService);
  });

  describe('resolve', () => {
    it('should return IAuthority returned by find', async () => {
      // GIVEN
      service.find = jest.fn(name => of(new HttpResponse({ body: { name } })));
      mockActivatedRouteSnapshot.params = { name: 'ABC' };

      // WHEN
      await new Promise<void>(resolve => {
        TestBed.runInInjectionContext(() => {
          authorityResolve(mockActivatedRouteSnapshot).subscribe({
            next(result) {
              // THEN
              expect(service.find).toHaveBeenCalledWith('ABC');
              expect(result).toEqual({ name: 'ABC' });
              resolve();
            },
          });
        });
      });
    });

    it('should return null if id is not provided', async () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      await new Promise<void>(resolve => {
        TestBed.runInInjectionContext(() => {
          authorityResolve(mockActivatedRouteSnapshot).subscribe({
            next(result) {
              // THEN
              expect(service.find).not.toHaveBeenCalled();
              expect(result).toEqual(null);
              resolve();
            },
          });
        });
      });
    });

    it('should route to 404 page if data not found in server', async () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IAuthority>({ body: null })));
      mockActivatedRouteSnapshot.params = { name: 'ABC' };

      // WHEN
      await new Promise<void>(resolve => {
        TestBed.runInInjectionContext(() => {
          authorityResolve(mockActivatedRouteSnapshot).subscribe({
            complete() {
              // THEN
              expect(service.find).toHaveBeenCalledWith('ABC');
              expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
              resolve();
            },
          });
        });
      });
    });
  });
});
