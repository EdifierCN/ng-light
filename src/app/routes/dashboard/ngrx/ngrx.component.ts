import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ArticleState, selectAllArticles, selectArticleIds, selectArticleEntities, LoadArticles, Article, AddArticles, UpdateArticles, RemoveArticles, ClearArticles } from '@store/article';

@Component({
  selector: 'app-ngrx',
  templateUrl: './ngrx.component.html',
  styleUrls: ['./ngrx.component.less'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgrxComponent implements OnInit {
  public article$: Observable<any>;
  allChecked = false;
  indeterminate = false;
  searchCategoryList = [];
  filterCategoryList = [
    { text: '电影', value: '电影' },
    { text: '游戏', value: '游戏' }
  ];
  sortMap = {
    id: null,
    category: null,
    title: null
  };
  sortName = null;
  sortValue = null;
  data = [];
  curPageData = [];
  displayData = [];

  constructor(
    private store: Store<ArticleState>,
    private changeRef: ChangeDetectorRef
  ){}

  ngOnInit(){
    this.article$ = this.store.select(selectAllArticles);
    this.article$.subscribe(v => {
      this.displayData = this.data = v;
      this.search(this.searchCategoryList);
    });
    this.store.dispatch(new LoadArticles());
  }

  /* 操作测试 */
  handleAddArticles(){
    this.store.dispatch(new AddArticles({
      articles: [{
        id: '1',
        category: '电影',
        title: '这是个悲伤的电影',
      },{
        id: '2',
        category: '游戏',
        title: '这是个悲伤的游戏',
      }]
    }));
  }
  handleUpdateArticles(){
    this.store.dispatch(new UpdateArticles({
      articles: [{
        id: '1',
        category: '电影',
        title: '这是个快乐的电影',
      }]
    }));
  }
  handleRemoveArticles(){
    this.store.dispatch(new RemoveArticles({
      ids: ['1']
    }));
  }
  handleClearArticles(){
    this.store.dispatch(new ClearArticles());
  }

  /* check items */
  currentPageDataChange($event: Array<Article>): void {
    this.curPageData = $event;
    this.refreshStatus();
  }
  refreshStatus(): void {
    const allChecked = this.curPageData.filter(value => !value.disabled).every(value => value.checked === true);
    const allUnChecked = this.curPageData.filter(value => !value.disabled).every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }
  checkAll(value: boolean): void {
    this.curPageData.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
  }

  /* sort items */
  sort(sortName: string, value: string): void {
    this.sortName = sortName;
    this.sortValue = value;
    for (const key in this.sortMap) {
      this.sortMap[ key ] = (key === sortName ? value : null);
    }
    this.search(this.searchCategoryList);
  }

  search(searchCategoryList: string[]): void {
    this.searchCategoryList = searchCategoryList;
    const filterFunc = item => (this.searchCategoryList.length ? this.searchCategoryList.some(v => item.category.indexOf(v) !== -1) : true);
    const data = this.data.filter(item => filterFunc(item));

    if (this.sortName && this.sortValue) {
      if(this.sortName === 'id'){
        this.displayData = data.sort((a, b) => (this.sortValue === 'ascend') ? (a[this.sortName] - b[this.sortName]) : (b[this.sortName] - a[this.sortName]));
      }else{
        this.displayData = data.sort((a, b) => (this.sortValue === 'ascend') ? (a[this.sortName].localeCompare(b[this.sortName], 'zh')) : (b[this.sortName].localeCompare(a[this.sortName], 'zh')));
      }
    } else {
      this.displayData = data;
    }
  }

  resetFilters(): void {
    this.filterCategoryList = [];
    this.searchCategoryList = [];
    this.search(this.searchCategoryList);
  }

  resetSortAndFilters(): void {
    this.sortName = null;
    this.sortValue = null;
    this.sortMap = {
      id   : null,
      category    : null,
      title: null
    };
    this.resetFilters();
    this.search(this.searchCategoryList);
  }

}
