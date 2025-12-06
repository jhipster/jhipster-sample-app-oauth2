import { Component, input } from '@angular/core';

import { GarbageCollector } from 'app/admin/metrics/metrics.model';
import SharedModule from 'app/shared/shared.module';

@Component({
  selector: 'jhi-metrics-garbagecollector',
  templateUrl: './metrics-garbagecollector.html',
  imports: [SharedModule],
})
export class MetricsGarbageCollector {
  /**
   * Object containing garbage collector related metrics
   */
  garbageCollectorMetrics = input<GarbageCollector>();

  /**
   * Boolean field saying if the metrics are in the process of being updated
   */
  updating = input<boolean>();
}
