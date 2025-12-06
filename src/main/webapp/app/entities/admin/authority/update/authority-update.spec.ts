import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IAuthority } from '../authority.model';
import { AuthorityService } from '../service/authority.service';

import { AuthorityFormService } from './authority-form.service';
import { AuthorityUpdate } from './authority-update';

describe('Authority Management Update Component', () => {
  let comp: AuthorityUpdate;
  let fixture: ComponentFixture<AuthorityUpdate>;
  let activatedRoute: ActivatedRoute;
  let authorityFormService: AuthorityFormService;
  let authorityService: AuthorityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(AuthorityUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    authorityFormService = TestBed.inject(AuthorityFormService);
    authorityService = TestBed.inject(AuthorityService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const authority: IAuthority = { name: 'c56c1cf7-aca8-48fe-ad81-eeebbf872cb1' };

      activatedRoute.data = of({ authority });
      comp.ngOnInit();

      expect(comp.authority).toEqual(authority);
    });
  });

  describe('save', () => {
    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IAuthority>>();
      const authority = { name: '572a7ecc-bf76-43f4-8026-46b42fba586d' };
      jest.spyOn(authorityFormService, 'getAuthority').mockReturnValue({ name: null });
      jest.spyOn(authorityService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ authority: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: authority }));
      saveSubject.complete();

      // THEN
      expect(authorityFormService.getAuthority).toHaveBeenCalled();
      expect(authorityService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });
  });
});
