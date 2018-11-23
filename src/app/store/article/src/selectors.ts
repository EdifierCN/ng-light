import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ArticleState } from './states';
import { articleAdapter } from './adapters'

const { selectIds, selectEntities, selectAll, selectTotal } = articleAdapter.getSelectors();

export const getSelectedArticleId = (state: ArticleState) => state.selectedArticleId;

export const getArticleState = createFeatureSelector<ArticleState>('articleState');
export const selectArticleIds = createSelector(getArticleState, selectIds);
export const selectArticleEntities = createSelector(getArticleState, selectEntities);
export const selectAllArticles = createSelector(getArticleState, selectAll);
export const articlesCount = createSelector(getArticleState, selectTotal);
export const selectCurrentArticleId = createSelector(getArticleState, getSelectedArticleId);
export const selectCurrentArticle = createSelector(
  selectArticleEntities,
  selectCurrentArticleId,
  (articleEntities, articleId) => articleEntities[articleId]
);
