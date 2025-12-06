import { Component, input } from '@angular/core';

import { JvmMetrics } from 'app/admin/metrics/metrics.model';
import SharedModule from 'app/shared/shared.module';

@Component({
  selector: 'jhi-jvm-memory',
  templateUrl: './jvm-memory.html',
  imports: [SharedModule],
})
export class JvmMemory {
  /**
   * Object containing all jvm memory metrics
   */
  jvmMemoryMetrics = input<Record<string, JvmMetrics>>();

  /**
   * Boolean field saying if the metrics are in the process of being updated
   */
  updating = input<boolean>();
}
