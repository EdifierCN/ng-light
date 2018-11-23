import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';


@Injectable()
export class ScrollConfig {
  constructor(
    @Inject(DOCUMENT) private doc: any
  ){}
  scrollSelector: any = 'window';
  store_key: string = 'zn_position';
}
