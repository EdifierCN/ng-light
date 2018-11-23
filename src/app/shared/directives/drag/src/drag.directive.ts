import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[zn-drag]'
})
export class DragDirective {
  isDrag: boolean = false;
  dragElement: HTMLElement;
  startPos: any;
  contMargin: any;
  throttle: number = 10;

  private _calDragPos(evt: MouseEvent, target: HTMLElement){
    const pageScroll = {
      left: document.body.scrollLeft || document.documentElement.scrollLeft,
      top: document.body.scrollTop || document.documentElement.scrollTop
    };
    const mousePos = {
      x: evt.clientX + pageScroll.left,
      y: evt.clientY + pageScroll.top
    };
    const targetPos = {
      x: target.getBoundingClientRect().left + pageScroll.left,
      y: target.getBoundingClientRect().top + pageScroll.top,
    };

    if(evt.type.toLowerCase() === 'mousedown')
      this.contMargin = {
        left: mousePos.x - targetPos.x,
        top: mousePos.y - targetPos.y
      };
    return {
      x: mousePos.x - this.contMargin.left,
      y: mousePos.y - this.contMargin.top
    };
  }

  @HostListener('mousedown', ['$event', '$event.target'])
  onMousedown(evt, target){
    this.isDrag = true;
    this.startPos = this._calDragPos(evt, target);

    this.dragElement = target.parentNode.parentNode.cloneNode(true);
    this.dragElement.style.cssText = `position: absolute; left: -99999px; top: -99999px`;
    document.body.appendChild(this.dragElement);
  }

  @HostListener('document:mousemove', ['$event', '$event.target'])
  onMousemove(evt, target){
    if(!this.isDrag){
      return
    }
    const movePos = this._calDragPos(evt, target);
    if(Math.abs(movePos.x - this.startPos.x) > this.throttle || Math.abs(movePos.y - this.startPos.y) > this.throttle){
      this.dragElement.style.cssText = `position: absolute; left: ${movePos.x}px; top: ${movePos.y}px; cursor: move;`;
    }
  }

  @HostListener('document:mouseup',['$event', '$event.target'])
  onMouseup(evt, target){
    if(!this.isDrag){
      return
    }
    this.isDrag = false;

    this.dragElement.parentNode.removeChild(this.dragElement);
  }
}
