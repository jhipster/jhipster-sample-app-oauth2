import { DecimalPipe, KeyValuePipe } from '@angular/common';
import { Component, input } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { JvmMetrics } from 'app/admin/metrics/metrics.model';
import { TranslateDirective } from 'app/shared/language';

@Component({
  selector: 'jhi-jvm-memory',
  templateUrl: './jvm-memory.html',
  imports: [NgbModule, KeyValuePipe, DecimalPipe, TranslateDirective, TranslateModule],
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
