import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Databases } from 'app/admin/metrics/metrics.model';
import { filterNaN } from 'app/core/util/operators';
import SharedModule from 'app/shared/shared.module';

@Component({
  selector: 'jhi-metrics-datasource',
  templateUrl: './metrics-datasource.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedModule],
})
export class MetricsDatasource {
  /**
   * Object containing all datasource related metrics
   */
  datasourceMetrics = input<Databases>();

  /**
   * Boolean field saying if the metrics are in the process of being updated
   */
  updating = input<boolean>();

  filterNaN = (n: number): number => filterNaN(n);
}
