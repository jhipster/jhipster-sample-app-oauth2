import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/core/request/request-util';
import { Pagination } from 'app/core/request/request.model';
import { IPublicUser, IUser } from './user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  public resourceUrl = SERVER_API_URL + 'api/users';
  public userManagementUrl = SERVER_API_URL + 'api/admin/users';

  constructor(private http: HttpClient) {}

  query(req?: Pagination): Observable<HttpResponse<IPublicUser[]>> {
    const options = createRequestOption(req);
    return this.http.get<IPublicUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  queryAsAdmin(req?: Pagination): Observable<HttpResponse<IUser[]>> {
    const options = createRequestOption(req);
    return this.http.get<IUser[]>(this.userManagementUrl, { params: options, observe: 'response' });
  }
}
