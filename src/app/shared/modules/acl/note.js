
/*
* subject 既是可观察对象也是观察者（具有next等相关api）
* 使用asObservable() 将只作为可观察对象
* */

/*
   rxjs 转化
  // 来自一个或多个值
  Rx.Observable.of('foo', 'bar');
  // 来自数组
  Rx.Observable.from([1,2,3]);
  // 来自事件
  Rx.Observable.fromEvent(document.querySelector('button'), 'click');
  // 来自 Promise
  Rx.Observable.fromPromise(fetch('/users'));
  // 来自回调函数(最后一个参数得是回调函数，比如下面的 cb)
  // fs.exists = (path, cb(exists))
  var exists = Rx.Observable.bindCallback(fs.exists);
  exists('file.txt').subscribe(exists => console.log('Does file exist?', exists));
  // 来自回调函数(最后一个参数得是回调函数，比如下面的 cb)
  // fs.rename = (pathA, pathB, cb(err, result))
  var rename = Rx.Observable.bindNodeCallback(fs.rename);
  rename('file.txt', 'else.txt').subscribe(() => console.log('Renamed!'))
  */


/*
  路由器支持多种守卫：
  用 CanActivate 来处理导航到某路由的情况；
  用 CanActivateChild 处理导航到子路由的情况；
  用 CanDeactivate 来处理从当前路由离开的情况；
  用 Resolve 在路由激活之前获取路由数据；
  用 CanLoad 来处理异步导航到某特性模块的情况
  */
