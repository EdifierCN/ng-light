
/*
 * cookie 过程
 * 1: 客户端发送http请求到服务器端;
 * 2: 服务器端发送一个http响应到客户端，包含 Set-Cookie 头部，指示浏览器建立cookie;
 * 3: 客户端发送http请求到服务器端，包含Cookie头部;
 * 4: 服务端发送http响应到服务端.
 * */

/*
 * cookie 存储（大约为4k）
 * 1: cookie生存事件是整个会话，浏览器会将cookie保存在内存中，浏览器!!!关闭时将自动清除这个cookie;
 * 2: 保存在客户端硬盘中，浏览器关闭，cookie不会清除，下次浏览器访问对应网站时，这个cookie会再次发送到服务端
 * */

/*
 * cookie 编码
 * 中文属于 Unicode 字符，内存中占4个字节，英文属于ASCII 字符，内存中占2个字节。
 * cookie 保存中文必须编码，否则会乱码，一般使用utf-8编码，GBK等中文编码，浏览器不一定支持。而且js不支持GBK编码。
 * 二进制数据需要使用base64编码（图片）。
 * */

/*
 * cookie 参数
 * expires : cookie 添加一个过期时间（以 UTC 或 GMT 时间）。默认情况下，cookie 在浏览器关闭时删除；
 * domain  : 同一个域名下的二级域名，需要设置domain参数
 * path    : path 参数告诉浏览器 cookie 的路径。默认情况下，cookie 属于当前页面；
 * secure  : 设置为true，浏览器只会在https和ssl等安全协议中传输此类cookie。
 *
 注意：domain参数必须以点(".")开始。另外，name相同但domain不同的两个Cookie是两个不同的Cookie。
 如果想要两个域名完全不同的网站共有Cookie，可以生成两个Cookie，domain属性分别为两个域名，输出到客户端。
 浏览器会将domain和path都相同的cookie保存在一个文件里，cookie间用*隔开。
 */

/*
 * cookie 例子：保存登录信息
 * 方式一：将用户名和密码都保存在cookie中，下次访问时检查cookie中的用户名和密码，与数据库比较（危险！）;
 * 方式二：把密码加密后保存在cookie中，下次访问时解密并与数据库比较;
 * 方式三：把登录的时间戳保存在cooke与数据库比较;
 * 方式四：把帐号保存在名为account的cookie中，把账号、密钥使用MD1加密后保存在名为 ssid 的cookie中,通过比较 ssid 和 帐号+key 加密后是否相等判断登录。
 * */

/*
 * cookie 和 session 详细指南：
 * https://www.cnblogs.com/andy-zhou/p/5360107.html
 * */
