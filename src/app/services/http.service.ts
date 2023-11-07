import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getTeamMembers() {
    return this.http.get('https://1.api.fy23ey04.careers.ifelsecloud.com');
  }
}
