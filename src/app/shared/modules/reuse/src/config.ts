import { Injectable } from '@angular/core';
import { ReuseMatchModel } from './interface';

@Injectable()
export class ReuseConfig {
  mode: ReuseMatchModel = 'URL';
  excludes: RegExp[] = [/callback\//,/passport\//, /\/\d+$/];  // 排除不需要复用的路由
  [key: string]: any
}
