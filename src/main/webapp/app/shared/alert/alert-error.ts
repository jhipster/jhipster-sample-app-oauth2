import { NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, inject, signal } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { AlertModel, AlertService } from 'app/core/util/alert.service';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';

import { AlertErrorModel } from './alert-error.model';

@Component({
  selector: 'jhi-alert-error',
  templateUrl: './alert-error.html',
  imports: [NgClass, NgbModule],
})
export class AlertError implements OnDestroy {
  alerts = signal<AlertModel[]>([]);
  errorListener: Subscription;
  httpErrorListener: Subscription;

  private readonly alertService = inject(AlertService);
  private readonly eventManager = inject(EventManager);

  private readonly translateService = inject(TranslateService);

  constructor() {
    this.errorListener = this.eventManager.subscribe(
      'jhipsterOauth2SampleApplicationApp.error',
      (response: EventWithContent<unknown> | string) => {
        const errorResponse = (response as EventWithContent<AlertErrorModel>).content;
        this.addErrorAlert(errorResponse.message, errorResponse.key, errorResponse.params);
      },
    );

    this.httpErrorListener = this.eventManager.subscribe(
      'jhipsterOauth2SampleApplicationApp.httpError',
      (response: EventWithContent<unknown> | string) => {
        this.handleHttpError(response);
      },
    );
  }

  setClasses(alert: AlertModel): Record<string, boolean> {
    const classes = { 'jhi-toast': Boolean(alert.toast) };
    if (alert.position) {
      return { ...classes, [alert.position]: true };
    }
    return classes;
  }

  ngOnDestroy(): void {
    this.eventManager.destroy(this.errorListener);
    this.eventManager.destroy(this.httpErrorListener);
  }

  close(alert: AlertModel): void {
    alert.close?.(this.alerts());
  }

  private addErrorAlert(message?: string, translationKey?: string, translationParams?: Record<string, unknown>): void {
    this.alertService.addAlert({ type: 'danger', message, translationKey, translationParams }, this.alerts());
  }

  private handleHttpError(response: EventWithContent<unknown> | string): void {
    const httpErrorResponse = (response as EventWithContent<HttpErrorResponse>).content;
    switch (httpErrorResponse.status) {
      // connection refused, server not reachable
      case 0:
        this.addErrorAlert('Server not reachable', 'error.server.not.reachable');
        break;

      case 400: {
        this.handleBadRequest(httpErrorResponse);
        break;
      }

      case 404:
        this.addErrorAlert('Not found', 'error.url.not.found');
        break;

      default:
        this.handleDefaultError(httpErrorResponse);
    }
  }

  private handleBadRequest(httpErrorResponse: HttpErrorResponse): void {
    const arr = httpErrorResponse.headers.keys();
    let errorHeader: string | null = null;
    let entityKey: string | null = null;
    for (const entry of arr) {
      if (entry.toLowerCase().endsWith('app-error')) {
        errorHeader = httpErrorResponse.headers.get(entry);
      } else if (entry.toLowerCase().endsWith('app-params')) {
        entityKey = httpErrorResponse.headers.get(entry);
      }
    }
    if (errorHeader) {
      const alertData = entityKey ? { entityName: this.translateService.instant(`global.menu.entities.${entityKey}`) } : undefined;
      this.addErrorAlert(errorHeader, errorHeader, alertData);
    } else if (httpErrorResponse.error !== '' && httpErrorResponse.error.fieldErrors) {
      this.handleFieldsError(httpErrorResponse);
    } else if (httpErrorResponse.error !== '' && httpErrorResponse.error.message) {
      this.addErrorAlert(
        httpErrorResponse.error.detail ?? httpErrorResponse.error.message,
        httpErrorResponse.error.message,
        httpErrorResponse.error.params,
      );
    } else {
      this.addErrorAlert(httpErrorResponse.error, httpErrorResponse.error);
    }
  }

  private handleDefaultError(httpErrorResponse: HttpErrorResponse): void {
    if (httpErrorResponse.error !== '' && httpErrorResponse.error.message) {
      this.addErrorAlert(
        httpErrorResponse.error.detail ?? httpErrorResponse.error.message,
        httpErrorResponse.error.message,
        httpErrorResponse.error.params,
      );
    } else {
      this.addErrorAlert(httpErrorResponse.error, httpErrorResponse.error);
    }
  }

  private handleFieldsError(httpErrorResponse: HttpErrorResponse): void {
    const { fieldErrors } = httpErrorResponse.error;
    for (const fieldError of fieldErrors) {
      if (['Min', 'Max', 'DecimalMin', 'DecimalMax'].includes(fieldError.message)) {
        fieldError.message = 'Size';
      }
      // convert 'something[14].other[4].id' to 'something[].other[].id' so translations can be written to it
      const convertedField: string = fieldError.field.replaceAll(/\[\d*\]/g, '[]');
      const fieldName: string = this.translateService.instant(
        `jhipsterOauth2SampleApplicationApp.${fieldError.objectName as string}.${convertedField}`,
      );
      this.addErrorAlert(`Error on field "${fieldName}"`, `error.${fieldError.message as string}`, { fieldName });
    }
  }
}
