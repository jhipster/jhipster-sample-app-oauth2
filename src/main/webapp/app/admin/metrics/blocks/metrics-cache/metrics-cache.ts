import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CacheMetrics } from 'app/admin/metrics/metrics.model';
import { filterNaN } from 'app/core/util/operators';
import SharedModule from 'app/shared/shared.module';

@Component({
  selector: 'jhi-metrics-cache',
  templateUrl: './metrics-cache.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedModule],
})
export class MetricsCache {
  /**
   * Object containing all cache related metrics
   */
  cacheMetrics = input<Record<string, CacheMetrics>>();

  /**
   * Boolean field saying if the metrics are in the process of being updated
   */
  updating = input<boolean>();

  filterNaN = (n: number): number => filterNaN(n);
}
