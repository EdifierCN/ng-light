import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Article } from './models';

export const  ArticleActionTypes = {
  ADD_ARTICLES: '[ARTICLE] Add Articles',
  ADD_ARTICLES_SUCCESS: '[ARTICLE] Add Articles Success',
  ADD_ARTICLES_FAILURE: '[ARTICLE] Add Articles Failure',
  UPDATE_ARTICLES: '[ARTICLE] Update Articles',
  UPDATE_ARTICLES_SUCCESS: '[ARTICLE] Update Articles Success',
  UPDATE_ARTICLES_FAILURE: '[ARTICLE] Update Articles Failure',
  REMOVE_ARTICLES: '[ARTICLE] Remove Articles',
  REMOVE_ARTICLES_SUCCESS: '[ARTICLE] Remove Articles Success',
  REMOVE_ARTICLES_FAILURE: '[ARTICLE] Remove Articles Failure',
  CLEAR_ARTICLES: '[ARTICLE] Clear Articles',
  CLEAR_ARTICLES_SUCCESS: '[ARTICLE] Clear Articles Success',
  CLEAR_ARTICLES_FAILURE: '[ARTICLE] Clear Articles Failure',
  LOAD_ALL_ARTICLES: '[ARTICLE] Load All Articles',
  LOAD_ALL_ARTICLES_SUCCESS: '[ARTICLE] Load All Articles Success',
  LOAD_ALL_ARTICLES_FAILURE: '[ARTICLE] Load All Articles Failure',
  SELECT_ARTICLE: '[ARTICLE] Article By Id'
};

export class LoadArticles implements Action {
  readonly type = ArticleActionTypes.LOAD_ALL_ARTICLES;
}
export class LoadArticlesSuccess implements Action {
  readonly type = ArticleActionTypes.LOAD_ALL_ARTICLES_SUCCESS;
  constructor(public payload: { articles: Article[] }) {}
}
export class LoadArticlesFailure implements Action {
  readonly type = ArticleActionTypes.LOAD_ALL_ARTICLES_FAILURE;
  constructor(public payload: { articles: Article[] }) {}
}

export class AddArticles implements Action {
  readonly type = ArticleActionTypes.ADD_ARTICLES;
  constructor(public payload: { articles: Article | Article[] }){}
}
export class AddArticlesSuccess implements Action {
  readonly type = ArticleActionTypes.ADD_ARTICLES_SUCCESS;
  constructor(public payload: { articles: Article | Article[] }) {}
}
export class AddArticlesFailure implements Action {
  readonly type = ArticleActionTypes.ADD_ARTICLES_FAILURE;
  constructor(public payload: { articles: Article | Article[] }) {}
}

export class UpdateArticles implements Action {
  readonly type = ArticleActionTypes.UPDATE_ARTICLES;
  constructor(public payload: { articles: Article | Article[] }) {}
}
export class UpdateArticlesSuccess implements Action {
  readonly type = ArticleActionTypes.UPDATE_ARTICLES_SUCCESS;
  constructor(public payload: { articles: Article | Article[] }) {}
}
export class UpdateArticlesFailure implements Action {
  readonly type = ArticleActionTypes.UPDATE_ARTICLES_FAILURE;
  constructor(public payload: { articles: Article | Article[] }) {}
}

export class RemoveArticles implements Action {
  readonly type = ArticleActionTypes.REMOVE_ARTICLES;
  constructor(public payload: { ids: string | string[] }) {}
}
export class RemoveArticlesSuccess implements Action {
  readonly type = ArticleActionTypes.REMOVE_ARTICLES_SUCCESS;
  constructor(public payload: { ids: string | string[] }) {}
}
export class RemoveArticlesFailure implements Action {
  readonly type = ArticleActionTypes.REMOVE_ARTICLES_FAILURE;
  constructor(public payload: { ids: string | string[] }) {}
}

export class ClearArticles implements Action {
  readonly type = ArticleActionTypes.CLEAR_ARTICLES;
}
export class ClearArticlesSuccess implements Action {
  readonly type = ArticleActionTypes.CLEAR_ARTICLES_SUCCESS;
  constructor(public payload?: any) {}
}
export class ClearArticlesFailure implements Action {
  readonly type = ArticleActionTypes.CLEAR_ARTICLES_FAILURE;
  constructor(public payload?: any) {}
}

export class SelectArticle implements Action {
  readonly type = ArticleActionTypes.SELECT_ARTICLE;
  constructor(public payload: { articleId: string }) {}
}

export type ARTICLE_ACTIONS =
  LoadArticlesSuccess   | LoadArticlesFailure   |
  AddArticlesSuccess    | AddArticlesFailure    |
  UpdateArticlesSuccess | UpdateArticlesFailure |
  RemoveArticlesSuccess | RemoveArticlesFailure |
  ClearArticlesSuccess  | ClearArticlesFailure  |
  SelectArticle;
