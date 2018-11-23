import { Injectable } from '@angular/core';
import { SocialOpenType } from './interface';

@Injectable()
export class AuthConfig {
  /**
   * 存储KEY值
   */
  store_key? = 'zn_token';
  /**
   * 无效时跳转至登录页，包括：
   * - 无效token值
   * - token已过期（限JWT）
   */
  token_invalid_redirect? = true;
  /**
   * token过期时间偏移值，默认：`10` 秒（单位：秒）
   */
  token_exp_offset? = 10;
  /**
   * 发送token参数名，默认：token
   */
  token_send_key? = 'token';
  /**
   * 发送token模板（默认为：`${token}`），使用 `${token}` 表示token点位符，例如：
   *
   * - `Bearer ${token}`
   */
  token_send_template? = '${token}';
  /**
   * 发送token参数位置，默认：header
   */
  token_send_place?: 'header' | 'body' | 'url' = 'header';
  /**
   * 登录页路由地址
   */
  login_url? = `/passport/login`;
  /**
   * 忽略TOKEN的URL地址列表
   */
  ignores?: RegExp[] = [/assets\//, /region\//, /account\//, /\/login/, /\/register/, /\/setup/];
  /**
   * 允许匿名登录KEY，若请求参数中带有该KEY表示忽略TOKEN
   */
  allow_anonymous_key? = `_allow_anonymous`;
}


@Injectable()
export class SocialConfig {
  type?: SocialOpenType = 'href';
  windowFeatures?: string = 'location=yes,height=570,width=520,scrollbars=yes,status=yes';
  redirect_url?: string = '/';
  login_url?:string = `/passport/login`;
}
