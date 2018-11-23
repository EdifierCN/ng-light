import { InjectionToken } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

export interface ACLModel {
  /* 角色 */
  role?: string[];
  /* 权限 */
  ability?: number[] | string[];
  /* 其他 */
  [key: string]: any;
}

export type ModeType = 'oneOf'| 'allOf';


export const ZN_ACL_SERVICE_TOKEN = new InjectionToken<ACLServiceModel>(
  'ZN_ACL_SERVICE_TOKEN'
);
export const ZN_ACL_GUARD_TOKEN = new InjectionToken<ACLGuardModel>(
  'ZN_ACL_GUARD_TOKEN'
);
export const ZN_ACL_CONFIG_TOKEN = new InjectionToken<ACLConfigModel>(
  'ZN_ACL_CONFIG_TOKEN'
);


export interface ACLConfigModel {
  [key: string]: any
}
export interface ACLGuardModel {
  [key: string]: any
}
export interface ACLServiceModel {
  readonly data: ACLModel;
  readonly roles: string[];
  readonly abilities: (number | string)[];
  readonly full: boolean;
  readonly change$: Observable<ACLModel | boolean>;

  set(value: ACLModel): void;
  add(value: ACLModel): void;
  setRole(roles: string | string[]): void;
  setAbility(abilities: number | string | (number | string)[]): void;
  attachRole(roles: string | string[]): void;
  attachAbility(abilities: number | string | (number | string)[]): void;
  setFull(val: boolean): void;
  removeRole(roles: string | string[]): void;
  removeAbility(abilities: number | string | (number | string)[]): void;
  has(value: ACLModel, mode: ModeType): boolean;
  hasRole(roles: string | string[], mode: ModeType): boolean
  hasAbility(abilities: number | string | (number | string)[], mode: ModeType): boolean;
  clear(): void;
  reset(): void;
}
