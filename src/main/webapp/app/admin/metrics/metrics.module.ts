import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhipsterOauth2SampleApplicationSharedModule } from 'app/shared/shared.module';

import { MetricsComponent } from './metrics.component';

import { metricsRoute } from './metrics.route';

@NgModule({
  imports: [JhipsterOauth2SampleApplicationSharedModule, RouterModule.forChild([metricsRoute])],
  declarations: [MetricsComponent],
})
export class MetricsModule {}
