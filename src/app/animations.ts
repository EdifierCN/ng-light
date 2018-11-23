import { trigger, state, style, transition, animate, animateChild, keyframes, query, group, sequence } from '@angular/animations';

/*
* query(selector, animation, options: null | { limit: number, optional: boolean })
* 注意：默认情况下，当没有找到条目时就会抛出错误。设置 optional 标志可以忽略此错误
* */

// 动画时间线
const time = '300ms';

const styles = {
  ease: time + ' ease ',
  linear: time + ' linear ',
  easeIn: time + ' ease-in',
  easeOut: time + ' ease-out',
  stepStart: time + ' step-start',
  stepEnd: time + ' step-end',
  easeInOut: time + ' ease-in-out',
  faseOutSlowIn: time + ' cubic-bezier(0.4, 0, 0.2, 1)',
  inOutBack: time + ' cubic-bezier(0.68, -0.55, 0.27, 1.55)',
  inOutCubic: time + ' cubic-bezier(0.65, 0.05, 0.36, 1)',
  inOutQuadratic: time + ' cubic-bezier(0.46, 0.03, 0.52, 0.96)',
  inOutSine: time + ' cubic-bezier(0.45, 0.05, 0.55, 0.95)'
};

// 动画配置
const opts = {
  fadeIn: [
    style({ opacity: 0 }),
    animate(styles.inOutBack, style({ opacity: 1 })),
  ],
  fadeOut: [
    style({ opacity: 1 }),
    animate(styles.inOutBack, style({ opacity: 0 }))
  ],
  shrink: [
    style({ height: '*' }),
    animate(styles.inOutBack, style({ height: 0 }))
  ],
  stretch: [
    style({ height: '0' }),
    animate(styles.inOutBack, style({ height: '*' }))
  ],
  flyIn: [
    style({ transform: 'translateX(-100%)' }),
    animate(styles.inOutBack, style({ transform: '*' }))
  ],
  flyOut: [
    style({ transform: '*' }),
    animate(styles.inOutBack, style({ transform: 'translateX(-100%)' }))
  ],
  zoomIn: [
    style({ transform: 'scale(.5)' }),
    animate(styles.inOutBack, style({ transform: '*' }))
  ],
  zoomOut: [
    style({ transform: '*' }),
    animate(styles.inOutBack, style({ transform: 'scale(.5)' }))
  ]
};


export const animateStyle = styles;

export const fadeIn = [trigger('fadeIn', [transition('void => *', opts.fadeIn)])];
export const fadeOut = [trigger('fadeOut', [transition('* => void', opts.fadeOut)])];
export const stretch = [trigger('stretch', [transition('void => *', opts.stretch)])];
export const shrink = [trigger('shrink', [transition('* => void', opts.shrink)])];
export const flyIn = [trigger('flyIn', [transition('void => *', opts.flyIn)])];
export const flyOut = [trigger('flyOut', [transition('* => void', opts.flyOut)])];
export const zoomIn = [trigger('zoomIn', [transition('void => *', opts.zoomIn)])];
export const zoomOut = [trigger('zoomOut', [transition('* => void', opts.zoomOut)])];


export const znAnimation = [
  trigger('znAnimation', [
    transition('* => fadeIn', opts.fadeIn),
    transition('* => fadeIn', opts.fadeOut),
    transition('* => shrink', opts.shrink),
    transition('* => stretch', opts.stretch),
    transition('* => flyIn', opts.flyIn),
    transition('* => flyOut', opts.flyOut),
    transition('* => zoomIn', opts.zoomIn),
    transition('* => zoomOut', opts.zoomOut)
  ])
];

export const slideInAnimation =
  trigger('routeAnimations', [
    transition(':increment', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ], { optional: true }),
      query(':enter', [
        style({
          left: '100%',
          opacity: 0
        })
      ], { optional: true }),
      group([
        query(':leave', [
          animate('300ms ease-out', style({
            left: '-100%',
            opacity: 0
          }))
        ], { optional: true }),
        query(':enter', [
          animate('300ms ease-out', style({
            left: '0%',
            opacity: '*'
          }))
        ], { optional: true })
      ])
    ]),
    transition(':decrement', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ], { optional: true }),
      query(':enter', [
        style({
          left: '-100%',
          opacity: 0
        })
      ], { optional: true }),
      group([
        query(':leave', [
          animate('300ms ease-out', style({
            left: '100%',
            opacity: 0
          }))
        ], { optional: true }),
        query(':enter', [
          animate('300ms ease-out', style({
            left: '0%',
            opacity: '*'
          }))
        ], { optional: true })
      ])
    ]),
  ]);


// 一： 复用组件编写方式
/*
1.
export const transAnimation = animation([
  style({
    height: '{{ height }}',
    opacity: '{{ opacity }}',
    backgroundColor: '{{ backgroundColor }}'
  }),
  animate('{{ time }}')
]);*/

/*
 2.
@Component({
  trigger('openClose', [
    transition('open => closed', [
      useAnimation(transAnimation, {
        params: {
          height: 0,
          opacity: 1,
          backgroundColor: 'red',
          time: '1s'
        }
      })
    ])
    ])
],
})*/
