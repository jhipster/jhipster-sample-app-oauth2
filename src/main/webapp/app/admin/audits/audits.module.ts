import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhipsterOauth2SampleApplicationSharedModule } from 'app/shared/shared.module';

import { AuditsComponent } from './audits.component';

import { auditsRoute } from './audits.route';

@NgModule({
  imports: [JhipsterOauth2SampleApplicationSharedModule, RouterModule.forChild([auditsRoute])],
  declarations: [AuditsComponent],
})
export class AuditsModule {}
