import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of } from 'rxjs';
import { Gmail, Html } from '../interfaces/gmail.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GmailService {
  private uri = environment.API_HOST;

  constructor(private readonly http: HttpClient) {}

  public obtenerTodos() {
    return this.http
      .get<Gmail[]>(`${this.uri}/api/gmails`)
      .pipe(catchError(() => of([])));
  }

  public obtenerPorId(id: string) {
    return this.http.get<Gmail>(`${this.uri}/api/gmails/${id}`).pipe(
      catchError((err) => {
        return of(undefined);
      })
    );
  }

  public obtenerGmailHtml(id: string) {
    return this.http.get<Html>(`${this.uri}/api/gmails/${id}/html`).pipe(
      catchError((err) => {
        console.log(err);
        return of(undefined);
      })
    );
  }
}
