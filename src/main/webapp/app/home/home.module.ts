import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterOauth2SampleApplicationSharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [JhipsterOauth2SampleApplicationSharedModule, RouterModule.forChild([HOME_ROUTE])],
  declarations: [HomeComponent],
})
export class JhipsterOauth2SampleApplicationHomeModule {}
