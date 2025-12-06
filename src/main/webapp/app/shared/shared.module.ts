import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { Alert } from './alert/alert';
import { AlertError } from './alert/alert-error';
import FindLanguageFromKeyPipe from './language/find-language-from-key.pipe';
import TranslateDirective from './language/translate.directive';

@NgModule({
  imports: [Alert, AlertError, FindLanguageFromKeyPipe, TranslateDirective],
  exports: [CommonModule, NgbModule, FontAwesomeModule, Alert, AlertError, TranslateModule, FindLanguageFromKeyPipe, TranslateDirective],
})
export default class SharedModule {}
