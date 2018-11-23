import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { tap, retry, switchMap } from 'rxjs/operators';
import { SETUP } from '@services/apis';

@Injectable()
export class SetupHttp {
  constructor(
    private http: HttpClient
  ){}

  isFetching: boolean = false;

  getInitialData(){
    this.isFetching = true;
    return this.http.get(SETUP)
      .pipe(
        retry(3),
        switchMap(v => of(v)),
        tap(() => {
          this.isFetching = false;
        })
      )
  }
}
