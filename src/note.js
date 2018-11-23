// http://192.168.0.105:4200/passport/login

// for lang in en-US zh-CN fr-TD; do ng xi18n --output-path=locales --out-file=messages.$lang; done


/*
 * RxJS 中 Subject 和 BehaviorSubject。 Observer: 观察者
 * Subject: 实现一个消息向多个订阅者推送消息，订阅前推送的消息不会打印
 * BehaviorSubject: Subject的一个衍生类，订阅前推送的消息最近的一次会打印
 * share() 的意义在于在管道中，同一个消息，一次性推送给所有的观察者；否则的话，重新分发

/*const ob1 = new Subject();
ob1.next(1);
ob1.next(2);
ob1.subscribe((v) => {
  console.info('ob1-1:', v)
});
ob1.subscribe((v) => {
  console.info('ob1-2:', v)
});
ob1.next(3);
ob1.next(4);*/

/*  ob1-1: 3
    ob1-2: 3
    ob1-1: 4
    ob1-2: 4
    */


/*const ob1 = new BehaviorSubject(0);
ob1.next(1);
ob1.next(2);
ob1.subscribe((v) => {
  console.info('ob1-1:', v)
});
ob1.subscribe((v) => {
  console.info('ob1-2:', v)
});
ob1.next(3);
ob1.next(4);*/

/*   ob1-1: 2
     ob1-2: 2
     ob1-1: 3
     ob1-2: 3
     ob1-1: 4
     ob1-2: 4
     */

/*const ob1 = new BehaviorSubject(0);
const ob2 = ob1.asObservable().pipe(tap((v) => {
  console.info(v);
}), share());
ob1.next(1);
ob1.next(2);
ob2.subscribe((v) => {
  console.info('ob1-1:', v)
});
ob1.next(5);
ob2.subscribe((v) => {
  console.info('ob1-2:', v)
});
ob1.next(3);
ob1.next(4);*/

/*
 * Subject, BehaviorSubject 区别
 * */
// 调用next才执行
/*const ob = new Subject();
 ob.subscribe((v) => {
 console.info(v)
 });
 ob.next(9);

 // 必须有值，不需要调用next就执行
 const gb = new BehaviorSubject(5);
 gb.subscribe((v) => {
 console.info(v);
 });*/



/*
*  关闭 webstorm method can be static 和 unused 提醒
*  位置：Editor => inspections => js => General
* */


/*
  摇树优化：直接在装饰器中定义providers
*/


/*
  Injector 获取的是已提供的服务
*/


/*
*  存在循环依赖性是因为路由器在应用程序初始化（APP_INITIALIZER）后被实例化，因此您无法在init期间注入它。
* */


/*
mergeMap, concatMap, switchMap
const a = of(1,2,3,4,5);
console.info(a);
const b = a.pipe(
  mergeMap( t => of(t))
).subscribe(c=>console.log(c));*/


/*
  如果使用https， 出现503错误，修改为如下方式：
  {
    "/api": {
    "target": {
      "host": "api.cnblogs.com",
        "protocol": "https:",
        "port": 443
    },
    "secure": false,
      "changeOrigin": true,
      "logLevel": "info"
  }
}*/



/*
  const state:any = this.injector.get(Router).routerState;
  const snapshot = state.snapshot;
  console.info(snapshot); //url，root === ActivatedRoute
*/

/*
* ActivatedRoute 获取到的是注入该服务的组件所在路由，所以得通过firstChild往孩子查找
* */


/*
 当同时加载了两个导入的模块，它们都列出了使用同一个令牌的提供商时，后导入的模块会“获胜”，这是因为这两个提供商都被添加到了同一个注入器中。
* */

/*
* angular服务提供商：
* 注入器只有：根注入器、组件注入器、惰性加载模块的注入器（惰性加载模块优先使用自己的注入器）
*
* Angular 模块中的 providers（@NgModule.providers）是注册在应用的根注入器下的。
* 因此，Angular 可以往它所创建的任何类中注入相应的服务。
* 一旦创建，服务的实例就会存在于该应用的全部生存期中，Angular 会把这一个服务实例注入到需求它的每个类中。
*
*和启动时就加载的模块中的提供商不同，惰性加载模块中的提供商是局限于模块的。
 当 Angular 路由器惰性加载一个模块时，它创建了一个新的运行环境。 那个环境拥有自己的注入器，它是应用注入器的直属子级。
* */


/*
 * 注意：
 * 1：多次加载同一个模块，只第一次有效；
 * 2：同时加载多个装载同一个服务的模块，服务都会被添加到根注入器中，最后一次有效；
 * 3：惰性加载模块有自己独立的作用域，普通特性模块没有。
 * */


/*
* 只有组件的输入属性在外部改变，才会触发组件内的onChanges
*
* */


/*
* Mixins将所有属性复制到选择器中，这可能导致不必要的重复。因此，您可以使用extends而不是mixins将选择器移动到您希望使用的属性，从而减少生成的css。
* */


// changeDetected
// changeDetection:ChangeDetectionStrategy.OnPush,    // 变化检测策略
// markForCheck()



/*
* forkJoin：所有流结束，发射数据；
* zip：逐个合并发射，某个流结束，则结束；
* combineLatest：以最新数据合并，以最近数据合并。
* */


/*
* publish 共享生产环境；
* connect 推送数据；
* refCount refCount是建立在connect之上的，它可以使ConnectableObservable在有第一个订阅者时订阅到数据源，并在没有订阅者时解除对数据源的订阅。这实际上对ConnectableObservable的所有订阅进行了记录。；
* publish + refCount = share
* */


// const watch1$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
// const watch2$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
//
// setTimeout(() => {
//   watch1$.next(true);
// }, 3000);
// setTimeout(() => {
//   watch2$.next(false);
// }, 1000);
//
// zip(watch1$, watch2$)
//   .pipe(
//     switchMap(v => {
//       return of(v)
//     })
//   )
//   .subscribe(v => {
//     console.log(v);
//   });

/* forkJoin log */
// 无输出

/*  combineLatest log */
// [null, null]
// [true, null]
// [true, false]

/* zip log */
// [null, null]
// [true, false]

// const fn = () => {
//   alert('方法拷贝')
// };
// const fnStr = fn.toString();
// const newFn = eval('('+ fnStr +')');
// newFn();


/*
* 三个问题：
* 1.@import 路劲别名化
* 2.LOCALE_ID 获取到的始终是en-US
* 3.less 变量定义
* */


/*
* TODO
* 1.页面所有正则集中
* 2.页面所有字符串集中（分类暂无好的办法）
* */
