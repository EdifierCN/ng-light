import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { switchMap, concatMap, catchError, shareReplay, tap } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';

/*
* 默认Http拦截器
*/
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {

  constructor(
    private injector: Injector
  ){}

  get msg(){
    return this.injector.get(NzMessageService) // 通过注入器获取类的实例
  }

  private goTo(url: string){
    setTimeout(() => this.injector.get(Router).navigateByUrl(url));
  }

  private handleData( event: HttpResponse<any> | HttpErrorResponse ):Observable<any>{
    // console.info(event);
    switch (event.status){
      case 200:
        //  错误内容：{ status: 1, msg: '非法参数' }
        //  正确内容：{ status: 0, response: {} }
        if(event instanceof HttpResponse){
          const body: any = event.body;
          if( body && body.status && body.status !== 0){
            this.msg.error(body.msg || '请求失败！');
            return throwError({});  // 抛出错误，中断后续pipe和subscribe
          }else{
            return of(new HttpResponse(Object.assign(event, { body: body.response || body})));
            // 保持完整的格式
            // return of(event);
          }
        }
        break;
      case 401: // 未登录
        break;
      case 403:
      case 404:
      case 500:
        this.goTo(`/${event.status}`);
        break;
      default:
        if(event instanceof HttpErrorResponse){
          console.warn(
            '未可知错误，大部分是由于后端不支持CORS或无效配置引起',
            event,
          );
          this.msg.error(event.message);
        }
    }
    return of(event)
  }

  intercept(      // 注意 intercept 和 handle 返回的类型为 HttpEvent<any>
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any> > {
    const newReq = req.clone({
      url: req.url
    });
    // console.info(newReq.url);
    // 响应
    return next.handle(newReq).pipe(
      switchMap((event: any) => {
        if( event instanceof HttpResponse && event.type === 4 && event.status === 200){
          return this.handleData(event)
        }else{
          return of(event)
        }
      }),
      catchError(( err: HttpErrorResponse ) => this.handleData(err))
    )
  }
}
