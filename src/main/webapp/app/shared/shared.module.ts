import { NgModule } from '@angular/core';
import { JhipsterOauth2SampleApplicationSharedLibsModule } from './shared-libs.module';
import { FindLanguageFromKeyPipe } from './language/find-language-from-key.pipe';
import { AlertComponent } from './alert/alert.component';
import { AlertErrorComponent } from './alert/alert-error.component';
import { HasAnyAuthorityDirective } from './auth/has-any-authority.directive';

@NgModule({
  imports: [JhipsterOauth2SampleApplicationSharedLibsModule],
  declarations: [FindLanguageFromKeyPipe, AlertComponent, AlertErrorComponent, HasAnyAuthorityDirective],
  exports: [
    JhipsterOauth2SampleApplicationSharedLibsModule,
    FindLanguageFromKeyPipe,
    AlertComponent,
    AlertErrorComponent,
    HasAnyAuthorityDirective,
  ],
})
export class JhipsterOauth2SampleApplicationSharedModule {}
