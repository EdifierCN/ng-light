
/*
 * 跨站请求伪造 (XSRF)
 * 后端：服务器需要在页面加载或首个 GET 请求中把一个名叫 XSRF-TOKEN 的令牌写入可被 JavaScript 读到的会话 cookie 中，
 *       在后续的请求中，服务器可以验证这个 cookie 是否与 HTTP 头 X-XSRF-TOKEN 的值一致，以确保只有运行在你自己域名下的代码才能发起这个请求；
 * 前端：当执行 HTTP 请求时，一个拦截器会从 cookie 中读取 XSRF 令牌（默认名字为 XSRF-TOKEN），并且把它设置为一个 HTTP 头 X-XSRF-TOKEN；
 * 注意：为了防止多个 Angular 应用共享同一个域名或子域时出现冲突，要给每个应用分配一个唯一的 cookie 名称。
 * */

/*
 若后端服务中对 XSRF 令牌的 cookie 或 头使用了不一样的名字,需以如下方式覆盖默认配置：
 imports: [
   HttpClientModule,
   HttpClientXsrfModule.withOptions({
   cookieName: 'My-Xsrf-Cookie',
   headerName: 'My-Xsrf-Header',
   }),
 ]
 */
