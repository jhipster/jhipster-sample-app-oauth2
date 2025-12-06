import { Component, input } from '@angular/core';

import { Services } from 'app/admin/metrics/metrics.model';
import SharedModule from 'app/shared/shared.module';

@Component({
  selector: 'jhi-metrics-endpoints-requests',
  templateUrl: './metrics-endpoints-requests.html',
  imports: [SharedModule],
})
export class MetricsEndpointsRequests {
  /**
   * Object containing service related metrics
   */
  endpointsRequestsMetrics = input<Services>();

  /**
   * Boolean field saying if the metrics are in the process of being updated
   */
  updating = input<boolean>();
}
