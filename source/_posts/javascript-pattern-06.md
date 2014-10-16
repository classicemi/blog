title: JavaScript 设计模式读书笔记(六)——门面模式
date: 2014-05-11 12:14:28
tags:
- 前端
- JavaScript
- 学习笔记
- 设计模式
---
门面模式是什么，与其我去用笨拙的语言去解释，不如看下面这张图，曾经在网上很火的一张图片，说的是一位儿子为他的爸妈设置的电脑桌面。

<!--more-->

![](/img/门面_爸妈桌面.jpg)

有了这些起好名字的快捷方式，身为电脑盲的爸妈就不需要去了解何为浏览器，何为播放器了，照着指示点就是了。这些快捷方式相当于在用户和计算机程序之间架起了一座桥梁，不需要每个用户都像电影里的黑客一样敲着一行行的代码才能使用计算机的功能。这就是门面模式的意义——把复杂的功能（接口）经过包装，让用户（开发者）能间接地，比较简单地去使用（调用）它们，简化使用（开发）的难度。

## 简单的门面模式实例——事件绑定函数
门面模式的作用是将复杂的接口进行包装，变成一个便于使用的接口。在很多的JavaScript库中都能找到门面模式的应用，例如jQuery，我们在用jQuery进行事件绑定的时候，简单的调用`bind()`，`on()`等方法就可以了，并不用对不同浏览器的兼容性问题进行处理，兼容性的处理在jQuery内部已经完成，就是通过门面的思想。

我们就以事件绑定为例，来展现一下门面模式是什么：
```javascript
// 实现一个通用的，跨多种浏览器的时间绑定函数
function addEvent(el, type, fn) {
  if (window.addEventListener) {
    el.addEventListener(type, fn, false);
  } else if (window.attachEvent) {
    el.attachEvent('on' + type, fn);
  } else {
    el['on' + type] = fn;
  }
}
```
通过**能力检测**，对浏览器支持的API进行判断，自动调用有效的事件绑定API来绑定时间。开发者在绑定时间的时候，就不需要写冗长的判断代码，直接专注于业务就好，这是门面模式带来的最直接的便利。

这里门面模式的作用是处理浏览器的**兼容性**，门面模式的另一个作用是对多个函数进行**组合**管理。

还是以事件相关API为例，事件绑定中还有两个常用的API分别是`event.stopPropagation()`和`event.preventDefault()`。这两个API在IE浏览器中是不兼容的，在IE中它们分别对应的是`event.cancelBubble = true`和`event.returnValue = false`。通过门面模式我们的目标是：
没有蛀牙~~~
以及：
```html
+---------------+      +------------+      +--------------+      +-----------+
|stopPropagation|      |cancelBubble|      |preventDefault|      |returnValue|
+---------------+      +------------+      +--------------+      +-----------+
        |                    |                    |                        |
        +--------------------+                    +------------------------+
                   ↓                                          ↓
           +---------------+                           +--------------+
           |stopPropagation|                           |preventDefault|
           +---------------+                           +--------------+
                   |                wrapped in                 |
                   +-------------------------------------------+
                                        ↓
                          +-----------------------------+
                          |          ╭ stopPropagation |
                          | stopEvent                   |
                          |          ╰ preventDefault  |
                          +-----------------------------+
```
通过代码事件就是这样：
```javascript
var eventUtil = {
  stopPropagation: function(ev) {
    if (ev.stopPropagation) {
      ev.stopPropagation();
    } else {
      ev.cancelBubble = true;
    }
  },
  preventDefault: function(ev) {
    if (ev.preventDefault) {
      ev.preventDefault();
    } else {
      ev.returnValue = false;
    }
  },
  stopEvent: function(ev) {
    eventUtil.stopPropagation(ev);
    eventUtil.preventDefault(ev);
  }
}
```
这样，在事件绑定函数中，如果需要取消冒泡和默认事件的话，直接调用`eventUtil.stopEvent(ev)`即可，该方法将所需的子方法进行了包装，也处理了兼容性问题。

## 门面模式在模块中的应用
结合以前说过的对象创建模式，门面模式可以应用在模块之中，通过对私用方法的包装提供简化的公用方法，开发者维护模块时只需修改私用方法就可以调整公用方法的实现。
```javascript
var orange = (function() {
  // 私用方法包装对象
  var _privateMethod = {
    orangeValue: 10,
    getValue: function() {
      console.log(this.orangeValue);
    },
    setValue: function(value) {
      this.orangeValue = value;
    }
  }

  // 返回公用方法
  return {
    setOrangeValue: function(value) {
      _privateMethod.setValue(value);
      _privateMethod.getValue();
    }
  }
})();
```

门面模式能提供编写方式的灵活性，通过对底层子方法的封装，既简化了代码又降低了对底层系统的耦合。在大型系统工具库的使用中有重要的意义。但在实际项目中还是要考虑代码量的**轻便性**，如果业务只需要一些小粒度的方法的话，就没有必要使用包装了很多无用方法的门面函数了，这需要开发者灵活判断。