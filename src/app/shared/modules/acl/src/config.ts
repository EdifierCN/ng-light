import { Injectable } from '@angular/core';

@Injectable()
export class ACLConfig {
  roles?: string[] = [];
  abilities?: (number|string)[] = [];
  full?: boolean = false;
  member_key?: string = 'role_1';
  guard_url?:string = '/403';  // 未授权页
}
