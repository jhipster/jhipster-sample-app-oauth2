import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';

import { combineLatest } from 'rxjs';

import SharedModule from 'app/shared/shared.module';

import { JvmMemory } from './blocks/jvm-memory/jvm-memory';
import { JvmThreads } from './blocks/jvm-threads/jvm-threads';
import { MetricsCache } from './blocks/metrics-cache/metrics-cache';
import { MetricsDatasource } from './blocks/metrics-datasource/metrics-datasource';
import { MetricsEndpointsRequests } from './blocks/metrics-endpoints-requests/metrics-endpoints-requests';
import { MetricsGarbageCollector } from './blocks/metrics-garbagecollector/metrics-garbagecollector';
import { MetricsRequest } from './blocks/metrics-request/metrics-request';
import { MetricsSystem } from './blocks/metrics-system/metrics-system';
import { MetricsModel, Thread } from './metrics.model';
import { MetricsService } from './metrics.service';

@Component({
  selector: 'jhi-metrics',
  templateUrl: './metrics.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SharedModule,
    JvmMemory,
    JvmThreads,
    MetricsCache,
    MetricsDatasource,
    MetricsEndpointsRequests,
    MetricsGarbageCollector,
    MetricsRequest,
    MetricsSystem,
  ],
})
export default class Metrics implements OnInit {
  metrics = signal<MetricsModel | undefined>(undefined);
  threads = signal<Thread[] | undefined>(undefined);
  updatingMetrics = signal(true);

  private readonly metricsService = inject(MetricsService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.updatingMetrics.set(true);
    combineLatest([this.metricsService.getMetrics(), this.metricsService.threadDump()]).subscribe(([metrics, threadDump]) => {
      this.metrics.set(metrics);
      this.threads.set(threadDump.threads);
      this.updatingMetrics.set(false);
      this.changeDetector.markForCheck();
    });
  }

  metricsKeyExistsAndObjectNotEmpty(key: keyof MetricsModel): boolean {
    return Boolean(this.metrics()?.[key] && JSON.stringify(this.metrics()?.[key]) !== '{}');
  }
}
