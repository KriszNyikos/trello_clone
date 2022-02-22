import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {}

  private rootUrl = "http://localhost:3000"
  private options = {
    headers: new HttpHeaders()
  }

  public apiGet( urlExtension: string ) {
    const url = `${this.rootUrl}/${urlExtension}`;
    return this.http.get(url);
  }

  public apiPost( urlExtension: string, body: any ) {
    const url = `${this.rootUrl}/${urlExtension}`;
    return this.http.post(url, body, this.options);
  }

  public apiPatch( urlExtension: string, body: any ) {
    const url = `${this.rootUrl}/${urlExtension}`;
    return this.http.patch(url, body, this.options);
  }

  public apiDel( urlExtension: string ) {
    const url = `${this.rootUrl}/${urlExtension}`;
    return this.http.delete(url, this.options);
  }

}
