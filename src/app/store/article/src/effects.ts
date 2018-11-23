import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import * as fromActions from './actions';
import { Article } from './models';
import { ArticleHttp } from '@services/article';


@Injectable()
export class ArticleEffects {
  constructor(
    private actions$: Actions,
    private articleHttp: ArticleHttp
  ) {}

  @Effect()
  loadAllArticles$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromActions.ArticleActionTypes.LOAD_ALL_ARTICLES),
      switchMap(() =>
        this.articleHttp.getAllArticles()
          .pipe(
            map(res => new fromActions.LoadArticlesSuccess({ articles: (<any>res).data as Array<Article> })),
            catchError(() => of(new fromActions.LoadArticlesFailure({ articles: [] })))
          )
      )
    );

  @Effect()
  addArticles$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromActions.ArticleActionTypes.ADD_ARTICLES),
      switchMap(({ payload:{ articles } }: fromActions.AddArticles) =>
        this.articleHttp.addArticles(articles)
          .pipe(
            map(res => new fromActions.AddArticlesSuccess({ articles })),
            catchError(() => of(new fromActions.AddArticlesFailure({ articles:[] })))
          )
      )
    );

  @Effect()
  updateArticles$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromActions.ArticleActionTypes.UPDATE_ARTICLES),
      switchMap(({ payload:{ articles } }: fromActions.UpdateArticles) =>
        this.articleHttp.updateArticles(articles)
          .pipe(
            map(res => new fromActions.UpdateArticlesSuccess({ articles })),
            catchError(() => of(new fromActions.UpdateArticlesFailure({ articles:[] })))
          )
      )
    );

  @Effect()
  removeArticles$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromActions.ArticleActionTypes.REMOVE_ARTICLES),
      switchMap(({ payload:{ ids } }: fromActions.RemoveArticles) =>
        this.articleHttp.removeArticles(ids)
          .pipe(
            map(res => new fromActions.RemoveArticlesSuccess({ ids })),
            catchError(() => of(new fromActions.RemoveArticlesFailure({ ids:[] })))
          )
      )
    );

  @Effect()
  clearArticles$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromActions.ArticleActionTypes.CLEAR_ARTICLES),
      switchMap(() =>
        this.articleHttp.clearArticles()
          .pipe(
            map(res => new fromActions.ClearArticlesSuccess()),
            catchError(() => of(new fromActions.ClearArticlesFailure()))
          )
      )
    );
}
