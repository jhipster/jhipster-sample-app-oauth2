import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ProcessMetrics } from 'app/admin/metrics/metrics.model';
import SharedModule from 'app/shared/shared.module';

@Component({
  selector: 'jhi-metrics-system',
  templateUrl: './metrics-system.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedModule],
})
export class MetricsSystem {
  /**
   * Object containing thread related metrics
   */
  systemMetrics = input<ProcessMetrics>();

  /**
   * Boolean field saying if the metrics are in the process of being updated
   */
  updating = input<boolean>();

  convertMillisecondsToDuration(ms: number): string {
    const times = {
      year: 31557600000,
      month: 2629746000,
      day: 86400000,
      hour: 3600000,
      minute: 60000,
      second: 1000,
    };
    let timeString = '';
    for (const [key, value] of Object.entries(times)) {
      if (Math.floor(ms / value) > 0) {
        let plural = '';
        if (Math.floor(ms / value) > 1) {
          plural = 's';
        }
        timeString += `${Math.floor(ms / value).toString()} ${key}${plural} `;
        ms = ms - value * Math.floor(ms / value);
      }
    }
    return timeString;
  }
}
