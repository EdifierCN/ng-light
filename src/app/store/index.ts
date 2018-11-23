import { ActionReducerMap, ActionReducer, MetaReducer } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';
import { articleReducer } from './article';
import { ArticleState } from './article/src/states';
import { environment } from '@env/environment'


export interface AppState {
  router: any;
  articleState: ArticleState;
}

export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer,
  articleState: articleReducer
};

export function logger(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return function(state: AppState, action: any): AppState {
    console.group(action.type);
    console.log('state', state);
    console.log('action', action);
    console.groupEnd();
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<AppState>[] = !environment.production
  ? [logger]
  : [];
