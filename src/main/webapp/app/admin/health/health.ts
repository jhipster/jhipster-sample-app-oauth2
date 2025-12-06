import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';

import { HealthDetails, HealthModel, HealthStatus } from './health.model';
import { HealthService } from './health.service';
import HealthModal from './modal/health-modal';

@Component({
  selector: 'jhi-health',
  templateUrl: './health.html',
  imports: [SharedModule],
})
export default class Health implements OnInit {
  health?: HealthModel;

  private readonly modalService = inject(NgbModal);
  private readonly healthService = inject(HealthService);

  ngOnInit(): void {
    this.refresh();
  }

  getBadgeClass(statusState: HealthStatus): string {
    if (statusState === 'UP') {
      return 'bg-success';
    }
    return 'bg-danger';
  }

  refresh(): void {
    this.healthService.checkHealth().subscribe({
      next: health => (this.health = health),
      error: (error: HttpErrorResponse) => {
        if (error.status === 503) {
          this.health = error.error;
        }
      },
    });
  }

  showHealth(health: { key: string; value: HealthDetails }): void {
    const modalRef = this.modalService.open(HealthModal);
    modalRef.componentInstance.health = health;
  }
}
