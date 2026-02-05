import { DecimalPipe, KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { HttpServerRequests } from 'app/admin/metrics/metrics.model';
import { filterNaN } from 'app/core/util/operators';
import { TranslateDirective } from 'app/shared/language';

@Component({
  selector: 'jhi-metrics-request',
  templateUrl: './metrics-request.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbModule, KeyValuePipe, DecimalPipe, TranslateDirective, TranslateModule],
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
