import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { share } from 'rxjs/operators';
import sortedUniq  from 'lodash.sorteduniq';
import difference from 'lodash.difference';
import { ACLModel, ModeType, ACLServiceModel, ZN_ACL_CONFIG_TOKEN } from './interface';
import { ACLConfig } from './config';


@Injectable()
export class ACLService implements ACLServiceModel{
  constructor(
    @Inject(ZN_ACL_CONFIG_TOKEN) private options: ACLConfig
  ){}

  // 私有属性
  private _roles: string[] = this.options.roles;
  private _abilities: (number | string)[] = this.options.abilities;
  private _full: boolean = this.options.full;
  private _change$: BehaviorSubject<ACLModel|boolean> = new BehaviorSubject<ACLModel|boolean>(null);

  // 读取器
  get data(){
    return {
      full: this._full,
      roles: this._roles,
      abilities: this._abilities,
    }
  }
  get roles(){
    return this._roles;
  }
  get abilities(){
    return this._abilities;
  }
  get full(){
    return this._full;
  }
  get change$():Observable<ACLModel | boolean>{
    return this._change$.asObservable().pipe(share())
  }

  private _reset(){
    const opts = this.options;
    this._roles = opts.roles;
    this._abilities = opts.abilities;
    this._full = opts.full;
  }

  // 设置当前用户角色或权限能力(角色和权限重置)
  set(value: ACLModel){
    this._reset();
    this.add(value);
  }

  // 为当前用户增加角色或权限能力（角色或权限附加）
  add(value: ACLModel){
    if(value.role && value.role.length > 0){
      this._roles = sortedUniq([...this._roles, ...value.role]);
    }
    if(value.ability && value.ability.length > 0){
      this._abilities = sortedUniq([...this._abilities, ...value.ability]);
    }
    this._change$.next(value);
  }

  // 设置用户角色（角色重置）
  setRole(roles: string | string[]){
    if(typeof roles === 'string'){
      roles = [roles];
    }

    this._roles = sortedUniq(roles);
    this._change$.next(this.data);
  }

  // 设置用户权限能力（权限重置）
  setAbility(abilities: number | string | (number|string)[]){
    if(typeof abilities === 'number' || typeof abilities === 'string'){
      abilities = [abilities]
    }
    this._abilities = sortedUniq(abilities);
    this._change$.next(this.data);
  }

  // 附加用户角色（角色附加）
  attachRole(roles: string | string[]){
    if(typeof roles === 'string'){
      roles = [roles]
    }
    this._roles = sortedUniq([...this._roles, ...roles]);
    this._change$.next(this.data);
  }

  // 附加用户权限（权限附加）
  attachAbility(abilities: number | string | (number|string)[]){
    if(typeof abilities === 'number' || typeof abilities === 'string'){
      abilities = [abilities]
    }
    this._abilities = sortedUniq([...this._abilities, ...abilities]);
    this._change$.next(this.data);
  }

  // 标识用户为全量不受限用户
  setFull(val: boolean){
    this._reset();
    this._full = val;
    this._change$.next(val);
  }

  // 移除用户角色
  removeRole(roles: string | string[]){
    if(typeof roles === 'string'){
      roles = [roles]
    }
    this._roles = difference(this._roles, roles);
    this._change$.next(this.data)
  }

  // 移除用户权限
  removeAbility(abilities: number | string | (number|string)[]){
    if(typeof abilities === 'number' || typeof abilities === 'string'){
      abilities = [abilities]
    }
    this._abilities = difference(this._abilities, abilities);
    this._change$.next(this.data);
  }

  // 角色和权限是否对应（默认：角色和权限满足其中任意一个就通过）
  has(value: ACLModel, mode: ModeType = 'oneOf', match: ModeType = 'oneOf'): boolean{
    if(!value) return false;
    if(this._full) return true;

    let rFlag = this.hasRole(value.role || [], match);
    let aFlag = this.hasAbility(value.ability || [], match);

    return mode === 'allOf' ? (rFlag && aFlag) : (rFlag || aFlag);
  }

  // 角色是否对应
  hasRole(roles: string | string[], mode: ModeType = 'oneOf'): boolean{
    if(!roles) return false;
    if(this._full) return true;

    if(typeof roles === 'string'){
      roles = [roles]
    }

    let action = mode === 'allOf' ? 'every' : 'some';
    return this._roles[action](item => (<string[]>roles).includes(item));
  }

  // 权限是否对应
  hasAbility(abilities: number | string | (number|string)[], mode: ModeType = 'oneOf'): boolean{
    if(!abilities) return false;
    if(this._full) return true;

    if(typeof abilities === 'number' || typeof abilities === 'string'){
      abilities = [abilities]
    }

    let action = mode === 'allOf' ? 'every' : 'some';
    return this._abilities[action](item => (<(number|string)[]>abilities).includes(item));
  }

  // 清空角色和权限(清空所有配置，包括默认)
  clear(){
    this._roles = [];
    this._abilities = [];
    this._full = false;
    this._change$.next(this.data);
  }

  // 重置(保留默认配置)
  reset(){
    this._reset();
    this._change$.next(this.data);
  }
}
