import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { HttpServerRequests } from 'app/admin/metrics/metrics.model';
import { filterNaN } from 'app/core/util/operators';
import SharedModule from 'app/shared/shared.module';

@Component({
  selector: 'jhi-metrics-request',
  templateUrl: './metrics-request.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedModule],
})
export class MetricsRequest {
  /**
   * Object containing http request related metrics
   */
  requestMetrics = input<HttpServerRequests>();

  /**
   * Boolean field saying if the metrics are in the process of being updated
   */
  updating = input<boolean>();

  filterNaN = (n: number): number => filterNaN(n);
}
