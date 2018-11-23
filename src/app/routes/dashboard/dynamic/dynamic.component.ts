import { ApplicationRef, ReflectiveInjector, Inject, Component, ViewChild, ViewContainerRef,EmbeddedViewRef, TemplateRef, ComponentFactory, ComponentFactoryResolver, ComponentRef, OnInit, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject, Observable } from 'rxjs';
import { DialogComponent } from './component/dialog/dialog.component';

@Component({
  selector: 'app-dynamic',
  templateUrl: './dynamic.component.html',
  styleUrls: ['./dynamic.component.less']
})
export class DynamicComponent implements OnInit,OnDestroy{
  constructor(
    @Inject(DOCUMENT) private doc: any,
    private appRef: ApplicationRef,
    private resolver: ComponentFactoryResolver
  ){}

  /*  demo_1 */
  componentRef: ComponentRef<DialogComponent>;
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;
  createDemo_1(money: string = '100万'){
    /* 1.删除之前的视图*/
    this.container.clear();
    /* 2.resolveComponentFactory() 方法接受一个组件并返回如何创建组件的 ComponentFactory 实例*/
    const factory: ComponentFactory<DialogComponent> = this.resolver.resolveComponentFactory(DialogComponent);
    /* 3.调用容器的 createComponent() 方法，
      该方法内部将调用 ComponentFactory 实例的 create() 方法创建对应的组件，并将组件添加到我们的容器*/
    this.componentRef = this.container.createComponent(factory);
    /* 4.通过组件引用 do something */
    this.componentRef.instance.money = money;
    this.componentRef.instance.onClick.subscribe((msg: string) => alert(msg));
  }
  ngOnInit(){
    this.createDemo_1()
  }
  ngOnDestroy() {
    /* 5.销毁 */
    // if(this.componentRef) this.componentRef.destroy()
  }

  /* demo_2 */
  @ViewChild('tpl')
  tpl: TemplateRef<any>;
  @ViewChild('tpl', { read: ViewContainerRef })
  tplRef: ViewContainerRef;
  title: string = '恭喜您中了1000万大奖';
  createDemo_2(){
    setTimeout(() => {
      // /* 方式一： */
      // // 页面中的<!--template bindings={}-->元素
      // let commentElement = this.tpl.elementRef.nativeElement;
      // // 创建内嵌视图
      // let embeddedView = this.tpl.createEmbeddedView(null);
      // // 动态添加子节点
      // embeddedView.rootNodes.forEach(node => {
      //   commentElement.parentNode.appendChild(node);
      // });
      // // 添加变化检测
      // this.appRef.attachView(embeddedView);

      /* 方式二： */
      this.tplRef.createEmbeddedView(this.tpl)
    }, 0);
  }
  ngAfterViewInit(){
    this.createDemo_2()
  }

  /* demo_3 */
  @ViewChild('wrapper', { read: ViewContainerRef })
  wrapper: ViewContainerRef;
  dialogRef: DialogClass<any>;
  money: number = 1;
  private getComponentRootNode(componentRef: ComponentRef<any>): HTMLElement {
    return (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
  }
  createDemo_3(){
    // this.wrapper.clear(); 无效
    if(this.dialogRef) this.dialogRef.close();
    const factory: ComponentFactory<DialogComponent> = this.resolver.resolveComponentFactory(DialogComponent);
    this.dialogRef = new DialogClass(factory, null);
    /*ApplicationRef有三个作用
     * 可以通过appRef.tick()来全局性调用变化检测
     * 可以将视图用attachView()包含到变化检测中 用detachView()将视图移除变化检测
     * 利用componentTypes和components提供了一个注册组件和组件类型的列表，和一些其他变更检测的相关信息*/
    this.wrapper.element.nativeElement.appendChild(this.getComponentRootNode(this.dialogRef.componentRef));
    this.appRef.attachView(this.dialogRef.componentRef.hostView);
    this.dialogRef.componentRef.instance.money = `${this.money * 1000}万`;
    this.dialogRef.componentRef.instance.onClick.subscribe((v:string) => alert(v));
    this.money++;
  }
}


class DialogClass<T> {
  // 弹窗关闭的订阅
  private afterClose$: Subject<any>;
  // 弹窗引用变量
  private dialogRef: ComponentRef<T>;
  constructor(
    private factory: ComponentFactory<T>,
    private config: any // 传入的自定义数据
  ) {
    this.afterClose$ = new Subject<any>();
    this.dialogRef = this.factory.create(
      ReflectiveInjector.resolveAndCreate([   // 创建注入器
        // {
        //   provide: config, useValue: config  // 注入自定义数据
        // },
        {
          provide: DialogClass,
          useValue: this // 注入自身,这样就可以在创建的组件里控制组件的关闭等
        }
      ])
    );
  } // 提供给外界的对窗口关闭的订阅
  public afterClose(): Observable<any> {
    return this.afterClose$.asObservable();
  } // 关闭方法,将销毁组件
  public close(data?: any) {
    this.afterClose$.next(data);
    this.afterClose$.complete();
    this.dialogRef.destroy();
  } // 提供给弹窗服务以帮助添加到DOM中
  get componentRef(){
    return this.dialogRef;
  }
}
