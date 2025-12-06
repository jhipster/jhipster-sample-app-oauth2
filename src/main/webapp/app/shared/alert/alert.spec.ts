import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertService } from 'app/core/util/alert.service';

import { Alert } from './alert';

describe('Alert Component', () => {
  let comp: Alert;
  let fixture: ComponentFixture<Alert>;
  let mockAlertService: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AlertService,
          useValue: {
            clear: jest.fn(),
            get: jest.fn(),
          },
        },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Alert);
    comp = fixture.componentInstance;
    mockAlertService = TestBed.inject(AlertService);
  });

  it('should call alertService.get on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(mockAlertService.get).toHaveBeenCalled();
  });

  it('should call alertService.clear on destroy', () => {
    // WHEN
    comp.ngOnDestroy();

    // THEN
    expect(mockAlertService.clear).toHaveBeenCalled();
  });
});
