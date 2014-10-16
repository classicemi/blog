title: 部分浏览器检测方法
date: 2014-05-16 20:07:28
tags:
- 前端
- JavaScript
- 兼容性
---
检测方法均摘自司徒正美所著《JavaScript框架设计》一书，同样内容在其博客中亦有记载。我在原内容基础上对判断方法的原理加上了注释，便于理解记忆。

<!--more-->

## jQuery解决方案
分析`window.navigator.userAgent`。
```javascript
var ua = window.navigator.userAgent;

// 亲测可能会存在问题
var match = /(Chrome)[ \/]([\w.]+)/.exec(ua) ||
            /(Webkit)[ \/]([\w.]+)/.exec(ua) ||
            /(OPR)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
            /(MSIE) ([\w.]+)/.exec(ua) ||
            ua.indexOf('compatible') < 0 && /(Mozilla)(?:.*?rv:([\w.]+)|)/.exec(ua) || [];
```

匹配的分句会返回如图所示的数组，包含浏览器型号与版本号：
![](/img/browser-detect-firefox.jpg)

移动平台的检测：
```javascript
var platform_match = /(ipad)/.exec(ua) ||
                     /(iphone)/.exec(ua) ||
                     /(android)/.exec(ua) || [];
```
这个没有测。

返回一个结果对象就行了：
```javascript
return {
  browser: match[1],
  version: match[2],
  platform: platform_match[0] || ''
}
```
一般浏览器的信息这样检测就基本能满足了，对于某些特定功能，建议用能力检测而不是浏览器检测。

## 通过能力检测判断浏览器
我认为这是比检测`navigator.userAgent`更好的方法。这样可以检测出更多浏览器的版本信息，例如判断IE浏览器的版本，非常有用：
**IE**
```javascript
ie = !!document.recalc;
ie = !!window.VBArray;
ie = !!window.ActiveXObject;
ie = !!document.createPopup;
```
以上为通过能力检测判断是否为IE浏览器的方法。
```javascript
ie = /*@cc_on!@*/!1;
```
这是IE中特有的条件编译（conditional compilation）注释，可以写在脚本的开头。
```javascript
ie = document.expando; // 常用document.all有bug，在firefox和opera的古老版本中也存在
```
IE9+中似乎无效。

**特定版本的IE**
*IE678*
```javascript
ie678 = !+"\v1";
```
IE678不能吧`\v`解释为垂直符，只能表现为`"v"`字符串，`+`号转换为数字失败，转换为NaN，取反得`true`。
```javascript
ie678 = !-[1, ];
```
IE678中调用`toString()`方法得到`"1,"`，取负返回NaN，再取反得`true`。
```javascript
ie678 = '\v' == 'v';
```
这个原理已经说了。
```javascript
ie678 = ('a~b'.split(/(~)/))[1] == 'b';
```
IE678版本`split`方法返回的是`['a', '~', 'b']`数组，IE9+版本返回`['a', 'b']`。
```javascript
ie678 = 0.9.toFixed(0) == '0';
```
此方法在Win8平台下通过IE10开发者工具模拟IE8-版本发现无效，返回值都为`'1'`，不知原生版本是否有效。
```javascript
ie678 = /\w/.test('\u0130');
```
