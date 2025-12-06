import { NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AlertModel, AlertService } from 'app/core/util/alert.service';

@Component({
  selector: 'jhi-alert',
  templateUrl: './alert.html',
  imports: [NgClass, NgbModule],
})
export class Alert implements OnInit, OnDestroy {
  alerts = signal<AlertModel[]>([]);

  private readonly alertService = inject(AlertService);

  ngOnInit(): void {
    this.alerts.set(this.alertService.get());
  }

  setClasses(alert: AlertModel): Record<string, boolean> {
    const classes = { 'jhi-toast': Boolean(alert.toast) };
    if (alert.position) {
      return { ...classes, [alert.position]: true };
    }
    return classes;
  }

  ngOnDestroy(): void {
    this.alertService.clear();
  }

  close(alert: AlertModel): void {
    alert.close?.(this.alerts());
  }
}
