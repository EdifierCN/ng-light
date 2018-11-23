import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Article } from './models';


function sortByCategory(ob1: Article, ob2: Article): number{
  // console.info(ob1.category);
  return ob1.category.localeCompare(ob2.category, 'zh');  // 第二个参数必须
}
export const articleAdapter: EntityAdapter<Article> = createEntityAdapter<Article>({
  sortComparer: false
});
