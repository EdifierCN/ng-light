import { ArticleActionTypes, ARTICLE_ACTIONS } from './actions';
import { ArticleState } from './states';
import { articleAdapter } from './adapters'

export const initialState: ArticleState = articleAdapter.getInitialState({
  selectedArticleId: null,
});

export function articleReducer(state = initialState, action: ARTICLE_ACTIONS): ArticleState {
  switch(action.type) {
    case ArticleActionTypes.LOAD_ALL_ARTICLES_SUCCESS: {
      return articleAdapter.addAll(action.payload.articles, state);
    }
    case ArticleActionTypes.ADD_ARTICLES_SUCCESS: {
      return articleAdapter.addMany(action.payload.articles, state);
    }
    case ArticleActionTypes.UPDATE_ARTICLES_SUCCESS: {
      return articleAdapter.updateMany(action.payload.articles, state);
    }
    case ArticleActionTypes.REMOVE_ARTICLES_SUCCESS: {
      return articleAdapter.removeMany(action.payload.ids, state);
    }
    case ArticleActionTypes.CLEAR_ARTICLES_SUCCESS: {
      return articleAdapter.removeAll({ ...state, selectedArticleId: null });
    }
    case ArticleActionTypes.SELECT_ARTICLE: {
      return Object.assign({ ...state, selectedArticleId: action.payload.articleId });
    }
    default: {
      return state;
    }
  }
}
