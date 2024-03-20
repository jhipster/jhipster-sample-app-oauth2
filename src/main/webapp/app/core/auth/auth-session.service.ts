import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Logout } from 'app/login/logout.model';
import { ApplicationConfigService } from '../config/application-config.service';

@Injectable({ providedIn: 'root' })
export class AuthServerProvider {
  private http = inject(HttpClient);
  private applicationConfigService = inject(ApplicationConfigService);

  logout(): Observable<Logout> {
    return this.http.post<Logout>(this.applicationConfigService.getEndpointFor('api/logout'), {});
  }
}
