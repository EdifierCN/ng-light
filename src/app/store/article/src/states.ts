import { EntityState } from '@ngrx/entity';
import { Article } from './models';


export interface ArticleState extends EntityState<Article> {
  selectedArticleId: string | number | null;
}
