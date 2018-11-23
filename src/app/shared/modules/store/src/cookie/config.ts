import { Injectable } from '@angular/core';

@Injectable()
export class CookieConfig {
  expires: number | string | Date = -1;
  domain?: string = '';
  path?: string = '/';
  raw?: boolean = true;
  secure?: boolean = false;
}
