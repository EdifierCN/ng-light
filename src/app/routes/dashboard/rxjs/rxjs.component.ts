import { Component, OnInit } from '@angular/core';
import { Observable, bindCallback, interval, range, concat, empty, from, fromEvent, of, merge, never } from 'rxjs';
import { take, startWith, mergeMap, buffer, bufferCount, bufferTime, bufferToggle, concatMap, map, concatAll, concatMapTo, mergeAll, mergeMapTo, windowWhen } from 'rxjs/operators';


@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styleUrls: ['./rxjs.component.less']
})
export class RxjsComponent implements OnInit {
  ngOnInit(){

    /*
    * next/error/complete
    * 注意：error 和 complete方法只能被调用一次，并且调用之后不会再调用任何方法
    * */

    // /*  RxJS 118个操作符 */
    //
    // // 【 bindCallBack 】
    // const call = (a, b) => {
    //   console.info('call run');  // callback 不会执行
    // };
    // const inFn = (a, b, call) => {
    //   console.info(a);
    //   console.info(b);
    //   call(100, 200)   // 当输入函数给回调函数传递一个值，则outFn返回的observable会发出这个值
    // };
    // const selFn = (a, b) => {   // 处理回调函数的参数，并将处理结果作为observable发出的值
    //   return a + b;
    // };
    // const outFn = bindCallback(inFn, selFn); // @params: func/selector（可为null）/scheduler  @returns: 一个返回observable的函数
    // outFn(1,2).subscribe(values => {    // 输出函数返回的observable被订阅之前输出函数不会执行
    //   console.info(values);  // 数组形式: [100, 200]
    // });
    // // 第三个参数scheduler 控制调用输入函数一级发出结果的时机，scheduler.async为延迟输入函数的调用
    // // observable 只能发出一次值然后立即完成，即无论callback再调用几次都不会再发出值
    // // 输入函数的上下文this为输出函数的this，若要保持this，则需在输出函数调用时修改（call）
    //
    //
    // // 【 combineLatest 】
    // /*
    // *  等待所有observable至少发出一次值，并组合所有observable的最新值，已完成的observable的值为最后发出的值
    // * @params inputObservables || Array<inputObservable>
    // * @params project 处理函数，投射一个新值
    // * @params scheduler 调度器
    // * */
    //
    // // 【 concat 】
    // /*
    // * 顺序订阅observable，只有当前一个observable结束，才会订阅下一个observable
    // * @params inputObservable || Array<inputObservable>
    // * @params scheduler 调度器
    // * 注意也可连接同一observable多次
    // * */
    // const timer = interval(1000).pipe(
    //   take(4)
    // );
    // const ranger = range(1, 5);
    // concat(timer, ranger).subscribe(v => {
    //   console.info(v);
    // });
    // // log: -1000ms -> 0 -1000ms -> 1 -1000ms -> 2 -1000ms -> 3 -immediate -> 1 ... 5
    //
    // // 【 create 】
    // /*
    // * 创建新的observable，注意：订阅后执行
    // * TS签名，给create传递的函数不会进行签名检查，除非明确指定
    // * 建议签名：(observer: Observer) => TeardownLogic
    // * @returns 返回取消订阅函数
    // * */
    //
    //
    // // 【 defer 】
    // /*
    // * 创建observable，当前仅当被订阅时，为每个订阅者创建新的observable
    // * 工厂函数
    // * */
    //
    // // 【 empty 】
    // /*
    // * 发出一个立即完成的observable
    // * */
    // const result = empty().pipe(startWith(7));
    // result.subscribe(
    //   res => {
    //     console.info(res)   // 发出7
    //   },
    //   srror => {
    //
    //   },
    //   () => {
    //     console.info('complete')
    //   }
    // );
    //
    // // 【 forkJoin 】
    // /*
    // * 所有流结束发出数据
    // * */
    //
    // // 【 from 】
    // /*
    // * 从一个数组、类数组对象、promise、迭代器对象、或者类observable对象创建observable
    // * */
    // const str = 'abcdefg';
    // from(str).subscribe(v => {
    //   console.info(v);
    // });
    // // 注意：字符串当做字符串数组，a -> b -> c ...
    //
    // // 【 fromEvent 】
    // /*
    // *@params: target
    // * @params: eventName
    // * @params: options 传递给addEventListener参数
    // * @params: selector 函数处理结果
    // * */
    // const clicks = fromEvent(document, 'click', {});
    // clicks.subscribe(() => {
    //   console.info('click');
    // });
    //
    // // 【 merge 】
    // const timer_1 = interval(1000).pipe(take(3));  // 0 -> 2
    // const timer_2 = interval(1000).pipe(take(10)); // 0 -> 9
    // const timer_3 = interval(1000).pipe(take(6)); // 0 -> 5
    // merge(timer_1, timer_2, timer_3, 2).subscribe(v => {
    //   console.info('merge:', v);
    // });
    // // 注意：timer_3 并不是初始就订阅，只有当 timer_1 或 timer_2 完成时, timer_3才开始
    //
    //
    // // 【 never 】
    // /*
    // * 既不发出数据也不发出错误和完成的通知的observable
    // * */
    // const never$ = never().pipe(startWith(33));
    // never$.subscribe(
    //   v => {
    //     console.info(v);
    //   },
    //   error => {
    //     console.info('error');   // 不会执行
    //   },
    //   () => {
    //     console.info('complete');   // 不会执行
    //   }
    // );
    // // 不会发出完成通知，需要手动解订
    //
    // // 【 of 】
    // /*
    // * 依次发出由你提供的值
    // * */
    //
    // // 【 range 】
    // /*
    // * 发出指定范围内的数字
    // * @params: start
    // * @params: count
    // * @params: scheduler
    // * */
    //
    // // 【 throw 】
    // /*
    // * 创建一个不发送数据并立马发出错误通知的observable
    // * */
    // interval(1000)
    //   .pipe(
    //     mergeMap(x => x === 10 ? Observable.throw('error') : of('aa','bb','cc'))
    //   )
    //   .subscribe(
    //     v => {
    //       console.info(v);
    //     },
    //     error => {
    //       console.info('error');
    //     },
    //     () => {
    //       console.info('complete');
    //     }
    //   );
    // // 注意：发出的是 aa bb cc 而不是 aabbcc
    //
    // // 【 buffer 】
    // interval(1000).pipe(buffer(fromEvent(document, 'click'))).subscribe(v => {
    //   console.info('buffer:', v);
    // });
    // // 点击通知缓冲的interval发出的值
    //
    // // 【 bufferCount 】
    // /*
    // * @params: bufferSize
    // * @params: startBufferEvery
    // * */
    // fromEvent(document, 'click').pipe(bufferCount(2,6)).subscribe(v => {
    //   console.info('bufferCount:', v)
    // });
    // // 注意：第二个参数为每两次点击发出缓冲的两个值，若为1的话则每点击一次发出缓冲的两个值
    // // 默认起始处开启缓冲区，第一次缓存数量达到bufferSize时发出缓存的数据，然后每startBuffer 开启新的缓冲区，发出旧缓存区的数据
    //
    // // 【 bufferTime 】
    // /*
    // * @params: bufferTimeSpan 填满每个缓冲数组的时间
    // * @params: bufferCreationInterval 开启新缓冲区的时间间隔
    // * @params: maxBufferSize  缓冲区的最大容量
    // * */
    // fromEvent(document, 'click').pipe(bufferTime(2000, 5000)).subscribe(v => {
    //   console.info('bufferTime:', v);
    // });
    // // 注意：每bufferCreationInterval开启缓冲区，再bufferCreationInterval关闭缓冲区
    // // 每5秒发出接下来两秒内的点击事件，余下的三秒忽略
    //
    //
    // // 【bufferToggle】
    // /*
    // * @params: openings  开启新缓冲区的通知
    // * @params: closingSelector 返回可订阅的对象或promise，发信号给缓冲区，发出并清理
    // * */
    // fromEvent(document, 'click').pipe(bufferToggle(interval(5000), i => {
    //   return i % 2 ? interval(500) : empty()
    // })).subscribe(v => {
    //   console.info('bufferToggle:', v);
    // });
    // // -1s 开启缓冲区，empty 关闭并清理，发出的数据为空数据 -2s -500ms 发出500ms内的点击数据， -3s开启新的缓冲区， -4s -500ms 发出数据...
    // // 缓冲区的开启时间为500ms，发出的是这500ms内的数据
    //
    // // 【 concatAll 】
    // /*
    //  串行连接内部observable
    // */
    // fromEvent(document, 'click').pipe(map(ev => interval(1000).pipe(take(4)))).pipe(concatAll()).subscribe(v => {
    //   console.info('concatAll:', v);
    // });
    //
    // // 【 concatMap 】
    // fromEvent(document, 'click').pipe(concatMap(evt => interval(1000).pipe(take(4)))).subscribe(v => {
    //   console.info('concatMap:', v);
    // })
    //
    // 【 concatMapTo 】
    // /*
    // * 将源值投射成同一observable，以串行方式合并到输出observable中
    // * */
    // fromEvent(document, 'click').pipe(concatMapTo(interval(1000).pipe(take(4)), (innerValue, outerValue) => {
    //   return outerValue  // 注意：返回的投射成observable的值
    // })).subscribe(v => {
    //   console.info(v);
    // });
    //
    // // 【 count 】
    // /*
    // * 记录源的发送数量
    // * */
    //
    //
    // 【 mergeMapTo 】
    // fromEvent(document, 'click').pipe(mergeMapTo(interval(1000).pipe(take(2)))).subscribe(v => {
    //   console.info(v);
    // })
    // // 注意：并行发出数据
    //
    // 【 windowWhen 】
    // fromEvent(document, 'click').pipe(
    //   windowWhen(() => interval(1000 + Math.random() * 4000)),
    //   map(win => of(win).pipe(take(2))),
    //   mergeAll()
    // ).subscribe(v => {
    //   console.info(v);
    // })


  }
}
