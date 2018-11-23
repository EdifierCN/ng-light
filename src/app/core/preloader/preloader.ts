export class Preloader {
  private preloader: Element;
  constructor(){
    this.init();
  }
  init(){
    const body = document.querySelector('body');
    body.style.overflow = 'hidden';
    this.preloader = document.querySelector('.preloader');
  }
  close(){
    const body = document.querySelector('body');
    const handler = () => {
      this.preloader.className = 'preloader-hidden';
    };
    setTimeout(() => {
      this.preloader.addEventListener('transitionend', handler);
      this.preloader.className += ' preloader-hidden-add preloader-hidden-add-active';
      body.style.overflow = '';
    }, 100);
  }
}

export const preloader = new Preloader();
