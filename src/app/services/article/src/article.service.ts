import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Article } from '@store/article';
import { PROJECT_LIST } from '@services/apis';

@Injectable()
export class ArticleHttp {
  constructor(
    private http: HttpClient
  ) {}

  isFetching: boolean = false;

  getAllArticles(): Observable<Article[]> {
    this.isFetching = true;
    return this.http.get<Article[]>(PROJECT_LIST).pipe(tap(v => this.isFetching = false));
  }

  addArticles(articles: Article | Article[]): Observable<any>{
    this.isFetching = true;
    return this.http.post(PROJECT_LIST, { articles }).pipe(tap(v => this.isFetching = false))
  }

  updateArticles(articles: Article | Article[]): Observable<any>{
    this.isFetching = true;
    return this.http.put(PROJECT_LIST, { articles }).pipe(tap(v => this.isFetching = false))
  }

  removeArticles(ids: string | string[]): Observable<any>{
    this.isFetching = true;
    let idStr = typeof ids === 'string' ? ids : ids.join('#');
    const params = new HttpParams().set('ids', idStr);
    return this.http.delete(PROJECT_LIST, { params }).pipe(tap(v => this.isFetching = false))
  }

  clearArticles(): Observable<any>{
    this.isFetching = false;
    return this.http.delete(PROJECT_LIST).pipe(tap(v => this.isFetching = false))
  }
}
