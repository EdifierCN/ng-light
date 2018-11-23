/*
 * Storage 问题
 * Safari隐私模式下 localStorage 依然有效但是无法存储，谷歌下，localStorage相当于sessionStorage
 * */

/*
 * Storage 容量
 * IE 9          > 4999995 + 5 = 5000000
 * firefox 22.0 > 5242875 + 5 = 5242880
 * chrome  28.0  > 2621435 + 5 = 2621440
 * safari  5.1   > 2621435 + 5 = 2621440
 * opera   12.15 > 5M （超出则会弹出允许请求更多空间的对话框）
 * */


/*
* 使用 encodeURIComponent, decodeURIComponent
* 不能将对象编码，否则JSON解析格式出错
* */
