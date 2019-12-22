import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { Logout } from 'app/core/login/logout.model';

@Injectable({ providedIn: 'root' })
export class AuthServerProvider {
  constructor(private http: HttpClient) {}

  logout(): Observable<Logout> {
    return this.http.post<Logout>(SERVER_API_URL + 'api/logout', {});
  }
}
