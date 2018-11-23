import { Injectable } from '@angular/core';
import { DateType } from './interface';

@Injectable()
export class StorageConfig {
  storage?: 'localStorage' | 'sessionStorage' = 'localStorage';
  expires?:  DateType = Infinity;
  force?: boolean = true;
}
