import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { Log, LoggersResponse } from './log.model';
import Logs from './logs';
import { LogsService } from './logs.service';

describe('Logs', () => {
  let comp: Logs;
  let fixture: ComponentFixture<Logs>;
  let service: LogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), LogsService],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Logs);
    comp = fixture.componentInstance;
    service = TestBed.inject(LogsService);
  });

  describe('OnInit', () => {
    it('should set all default values correctly', () => {
      expect(comp.filter()).toBe('');
      expect(comp.sortState().predicate).toBe('name');
      expect(comp.sortState().order).toBe('asc');
    });

    it('should call load all on init', () => {
      // GIVEN
      const log = new Log('main', 'WARN');
      jest.spyOn(service, 'findAll').mockReturnValue(
        of({
          loggers: {
            main: {
              effectiveLevel: 'WARN',
            },
          },
        } as unknown as LoggersResponse),
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.findAll).toHaveBeenCalled();
      expect(comp.loggers()?.[0]).toEqual(expect.objectContaining(log));
    });
  });

  describe('change log level', () => {
    it('should change log level correctly', () => {
      // GIVEN
      const log = new Log('main', 'ERROR');
      jest.spyOn(service, 'changeLevel').mockReturnValue(of({}));
      jest.spyOn(service, 'findAll').mockReturnValue(
        of({
          loggers: {
            main: {
              effectiveLevel: 'ERROR',
            },
          },
        } as unknown as LoggersResponse),
      );

      // WHEN
      comp.changeLevel('main', 'ERROR');

      // THEN
      expect(service.changeLevel).toHaveBeenCalled();
      expect(service.findAll).toHaveBeenCalled();
      expect(comp.loggers()?.[0]).toEqual(expect.objectContaining(log));
    });
  });
});
