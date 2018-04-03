import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';

import { NgbDateMomentAdapter } from './util/datepicker-adapter';
import {
  JhipsterOauth2SampleApplicationSharedLibsModule,
  JhipsterOauth2SampleApplicationSharedCommonModule,
  HasAnyAuthorityDirective
} from './';

@NgModule({
  imports: [JhipsterOauth2SampleApplicationSharedLibsModule, JhipsterOauth2SampleApplicationSharedCommonModule],
  declarations: [HasAnyAuthorityDirective],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateMomentAdapter }],
  exports: [JhipsterOauth2SampleApplicationSharedCommonModule, HasAnyAuthorityDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JhipsterOauth2SampleApplicationSharedModule {}
