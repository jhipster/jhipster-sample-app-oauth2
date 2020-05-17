import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { JhipsterOauth2SampleApplicationSharedModule } from 'app/shared/shared.module';

import { DocsComponent } from './docs.component';

import { docsRoute } from './docs.route';

@NgModule({
  imports: [JhipsterOauth2SampleApplicationSharedModule, RouterModule.forChild([docsRoute])],
  declarations: [DocsComponent],
})
export class DocsModule {}
