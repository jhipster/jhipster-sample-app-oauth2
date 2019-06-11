import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { JhipsterOauth2SampleApplicationSharedCommonModule, HasAnyAuthorityDirective } from './';

@NgModule({
  imports: [JhipsterOauth2SampleApplicationSharedCommonModule],
  declarations: [HasAnyAuthorityDirective],
  exports: [JhipsterOauth2SampleApplicationSharedCommonModule, HasAnyAuthorityDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JhipsterOauth2SampleApplicationSharedModule {
  static forRoot() {
    return {
      ngModule: JhipsterOauth2SampleApplicationSharedModule
    };
  }
}
