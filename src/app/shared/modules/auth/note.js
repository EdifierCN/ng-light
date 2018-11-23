
/*
注意 multi: true 选项。
这个必须的选项会告诉 Angular HTTP_INTERCEPTORS 是一个多重提供商的令牌，表示它会注入一个多值的数组，而不是单一的值。
*/


/*
* 关于JWT ：https://www.cnblogs.com/zjutzz/p/5790180.html
*           https://blog.csdn.net/csdn_blog_lcl/article/details/73485463
*
* 由三部分组成
* 格式：A.B.C
* A: 由JWT头部信息header加密得到;
* B: 由JWT用到的身份信息json数据加密得到;
* C: 由A和B加密得到，是校验部分.
* */
