import { Component, input } from '@angular/core';

import SharedModule from 'app/shared/shared.module';
import { IAuthority } from '../authority.model';

@Component({
  selector: 'jhi-authority-detail',
  templateUrl: './authority-detail.html',
  imports: [SharedModule],
})
export class AuthorityDetail {
  authority = input<IAuthority | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
