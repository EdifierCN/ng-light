import { Component, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { Location, DOCUMENT } from '@angular/common';
import { trigger, state, style, animate, transition, keyframes, query, stagger } from '@angular/animations';
import { RouterOutlet, Router, ActivatedRoute, NavigationStart, NavigationEnd, NavigationError, RouteConfigLoadStart, NavigationCancel } from '@angular/router';
import { filter } from 'rxjs/operators';

// transition() 接受两个参数：第一个参数接受一个表达式，它定义两个转场状态之间的方向；第二个参数接受一个 animate() 函数。
// animate() 函数来定义长度、延迟和缓动效果，并指定一个样式函数，以定义转场过程中的样式。 你还可以使用 animate() 函数来为多步动画定义 keyframes() 函数。这些定义放在 animate() 函数的第二个参数中。
// animate ('duration delay easing')
// animate ('1s',
//   style ({ opacity: '*' }),
// ),

// 触发器
// <div [@triggerName]="expression">...</div>;

// transition ( ':enter', [ ... ] );  // alias for void => *
// transition ( ':leave', [ ... ] );  // alias for * => void

// Angular 中的 keyframes() 函数允许你在单个转场中指定多个临时样式，并使用可选的偏移量来定义动画中每次样式变化的发生时机。

// 用来控制复杂动画序列的函数如下：
// query() 用于查找一个或多个内部 HTML 元素。
// stagger() 用于为多元素动画应用级联延迟。
// group() 用于并行执行多个动画步骤，给不同动画属性设置不同时序。
// sequence() 用于逐个顺序执行多个动画步骤。

@Component({
  selector: 'app-animation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.less'],
  animations: [
    trigger('OpenOrClose', [
      state('open', style({
        width: '100%',
        opacity: 1,
        backgroundColor: 'yellow'
      })),
      state('close', style({
        width: '100px',
        opacity: 0.5,
        backgroundColor: 'red'
      })),
      transition('open => close', [   // 按顺序匹配
        animate('1s')
      ]),
      transition('close => open', [
        animate('0.5s')
      ])
    ]),
    trigger('FlyInOrOut', [
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate('1s', style({
          transform: '*'
        }))
      ]),
      transition('* => void', [
        style({ transform: '*' }),
        animate('1s', style({
          transform: 'translateX(100%)'
        }))
      ])
    ]),
    trigger('pageAnimations', [
      transition(':enter', [
        query('ul.list', [
          style({opacity: 0, transform: 'translateY(-100px)'}),
          stagger(-30, [
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'none' }))
          ])
        ])
      ]),
      transition(':leave', [

      ])
    ]),
    trigger('filterAnimation', [
      transition(':enter, * => 0, * => -1', []),
      transition(':increment', [
        query(':enter', [
          style({ opacity: 0, width: '0px' }),
          stagger(50, [
            animate('300ms ease-out', style({ opacity: 1, width: '*' })),
          ]),
        ], { optional: true })
      ]),
      transition(':decrement', [
        query(':leave', [
          stagger(50, [
            animate('300ms ease-out', style({ opacity: 0, width: '0px' })),
          ]),
        ])
      ]),
    ]),
  ]
})
export class AnimationComponent implements OnInit, OnDestroy{
  isOpen: boolean = false;
  isShown: boolean = false;
  isDisabled: boolean = false;
  index: number = 0;
  list: number[] = [];

  constructor(
    private router: Router
  ){}

  public animatePage = true;

  handleToggle(){
    this.isOpen = !this.isOpen;
    this.isShown = !this.isShown;
  }

  handleEnable(){
    this.isDisabled = !this.isDisabled;
  }

  handleAnimationEvent ( event: AnimationEvent ) {
    // const evt: any = event;
    // // openClose is trigger name in this example
    // console.warn(`Animation Trigger: ${evt.triggerName}`);
    //
    // // phaseName is start or done
    // console.warn(`Phase: ${evt.phaseName}`);
    //
    // // in our example, totalTime is 1000 or 1 second
    // console.warn(`Total time: ${evt.totalTime}`);
    //
    // // in our example, fromState is either open or closed
    // console.warn(`From: ${evt.fromState}`);
    //
    // // in our example, toState either open or closed
    // console.warn(`To: ${evt.toState}`);
    //
    // // the HTML element itself, the button in this case
    // console.warn(`Element: ${evt.element}`);
  }

  increase: boolean = true;

  ngOnDestroy(){

  }

  /* runHook */
  _onReuseInit(args){
    // console.info('enter', args);
  }
  _onReuseDestroy(args){
    // console.info('leave', args);
  }

  ngOnInit(){

    setInterval(() => {

      if(this.increase){
        this.list.push(this.index);
        this.index ++;
        if(this.index == 6){
          this.increase = false
        }
      }else{
        this.list.pop();
        this.index--;
        if(this.index == 0){
          this.increase = true
        }
      }
    }, 1000)
  }
}
