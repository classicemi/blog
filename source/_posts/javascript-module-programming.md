title: 浅谈 JavaScript 模块化编程
date: 2014-05-04 12:14:28
tags:
- 前端
- JavaScript
---
JavaScript本身不是一种模块化语言，设计者在创造JavaScript之初应该也没有想到这么一个脚本语言的作用领域会越来越大。以前一个页面的JS代码再多也不会多到哪儿去，而现在随着越来越多的JavaScript库和框架的出现，Single-page App的流行以及Node.js的迅猛发展，如果我们还不对自己的JS代码进行一些模块化的组织的话，开发过程会越来越困难，运行性能也会越来越低。因此，了解JS模块化编程是非常重要的。

<!--more-->

## 简单的模块
什么是模块？我认为将不同功能的函数放在一起，组成一个能实现某种或某些特定功能的整体就是一个模块，因此这样：
```javascript
function add(a, b) {
  return a + b;
}

function divide(a, b) {
  return a / b;
}
```
如此简单的两个函数就可以组成一个模块，这个模块可以进行一些数学运算。

当然没有人会这么写模块。仅仅是从“型”上来看，两个函数分散在全局环境中，这也看不出模块的特点。模块存在于全局变量中，应该提供一个命名空间，成为模块内容的入口。那么我们可以将函数包裹在一个对象中：
```javascript
var math = {
  add: function(a, b) {
    return a + b;
  },
  divide: function(a, b) {
    return a / b;
  }
}
```
这样看起来似乎有模块的“型”了。但是这样还不完善，`math`中的所有成员都是对外暴露的，如果其中有一些变量不希望被修改的话那就有风险了。为了防止世界被破坏，为了维护私有变量不被修改，我们可以使用闭包。
```javascript
var math = (function() {
  var _flag = 0;

  return {
    add: function(a, b) {
      return a + b;
    },
    divide: function(a, b) {
      return a / b;
    }
  };
})();
```
外部代码只能访问返回的`add`和`divide`方法，内部的`_flag`变量是不能访问的。关于创建对象的一些方法的解释，可以参考我的[另一篇博文](http://classicemi.github.io/2014/04/22/javascript-pattern-02/)，里面有较详细的解释。

利用自执行函数的特点，我们还可以很方便地为模块添加方法：
```javascript
var math = (function(module) {
  module.subtract = function(a, b) {
    return a - b;
  }
})(math);
```
模块在全局变量中的名称可能会与其他的模块产生冲突，例如`$`符号，虽然使用方便，但多个模块可能都会用它作为自己的简写，例如[jQuery](http://www.jquery.com/)。我们可以在模块的组织代码中用`$`作为形参，将模块的全名变量作为参数传入，可起到防冲突的效果。
```javascript
var math = (function($) {
  // 这里的$指的就是Math
})(math);
```
模块的构建思想便是通过这样的方式逐渐演化而来，下面将通过介绍一些JS模块化编程的标准来展示如何组织，管理和编写模块。

## `AMD` 与 `CMD`
在JavaScript模块化编程的世界中，有两个规范不得不提，它们分别是[AMD](https://github.com/amdjs/amdjs-api/wiki/AMD/)和[CMD](https://github.com/cmdjs/specification/blob/master/draft/module.md/)。现在的JS库或框架，凡是模块化的，一般都是遵循了这两个规范其中之一。

### AMD（Asynchronous Module Definition）
**CommonJS**
在说AMD之前，先要提一下[CommonJS](http://wiki.commonjs.org/wiki/CommonJS)。CommonJS是为了弥补JavaScript标准库过少的缺点而产生的，由于JS没有模块机制（[ES6](http://wiki.ecmascript.org/doku.php?id=harmony:specification_drafts)引入了模块系统，但浏览器全面支持估计还有好几年），CommonJS就帮助JS实现模块的功能。现在很热门的[Node.js](http://nodejs.org/)就是CommonJS规范的一个实现。

CommonJS在模块中定义方法要借助一个全局变量`exports`，它用来生成当前模块的API：
```javascript
/* math module */

exports.add = function(a, b) {
  return a + b;
};
```
要加载模块就要使用CommonJS的一个全局方法`require()`。加载之前实现的`math`模块像这样：
```javascript
var math = require('math');
```
加载后`math`变量就是这个模块对象的一个引用，要调用模块中的方法就像调用普通对象的方法一样了：
```javascript
var math = require('math');
math.add(1, 3);
```
总之，CommonJS就是一个模块加载器，可以方便地对JavaScript代码进行模块化管理。但它也有缺点，它在设计之初并没有完全为浏览器环境考虑，浏览器环境的特点是所有的资源，不考虑本地缓存的因素，都需要从服务器端加载，加载的速度取决于网络速度，而CommonJS的模块加载过程是同步阻塞的。也就是说如果`math`模块体积很大，网速又不好的时候，整个程序便会停止，等待模块加载完成。

随着浏览器端JS资源的体积越来越庞大，阻塞给体验带来的不良影响也越来越严重，终于从，在CommonJS社区中有了不同的声音，`AMD`规范诞生了。

**AMD**
它的特点便是异步加载，模块的加载不会影响其他代码的运行。所有依赖于某个模块的代码全部移到模块加载语句的回调函数中去。AMD的`require()`语句接受两个参数：
```javascript
// require([module], callback)
require(['math'], function(math) {
  math.add(1, 3);
});
```
在回调函数中，可以通过`math`变量引用模块。

AMD规范也规定了模块的定义规则，使用`define()`函数。
```javascript
define(id?, dependencies?, factory);
```
它接受三个参数：
*id*
这是一个可选参数，相当于模块的名字，加载器可通过id名加载对应的模块。如果没有提供id，加载器会将模块文件名作为默认id。

*dependencies*
可选，接受一个数组参数，传入当前对象依赖的对象id。

*factory*
回调函数，在依赖模块加载完成后会调用，它的参数是所有依赖模块的引用。回调函数的返回值就是当前对象的导出值。

用AMD规范实现一个简单的模块可以这样：
```javascript
define('foo', ['math'], function(math) {
  return {
    increase: function(x) {
      return math.add(x, 1);
    }
  };
});
```
如果省去id和dependencies参数的话，就是一个完全的匿名模块。factory的参数将为默认值`require`，`exports`和`module`加载器将完全通过文件路径的方式加载模块，同时如果有依赖模块的话可通过`require`方法加载。
```javascript
define(function(require, exports, module) {
  var math = require('math');

  exports.increase = function(x) {
    return math(x, 1);
  };
});
```

AMD规范也允许对加载进行一些配置，配置选项不是必须的，但灵活更改配置，会给开发带来一些方便。

**baseUrl** 以字符串形式规定根目录的路径，以后在加载模块时都会以该路径为标准。在浏览器中，工作目录的路径就是运行脚本的网页所在的路径。
```javascript
{
  baseUrl: './foo/bar'
}
```

**path** 可以指定需加载模块的路径，模块名与路径以键-值对的方式写在对象中。如果一个模块有多个可选地址，可以将这些地址写在一个数组中。
```javascript
{
  path: {
    'foo': './bar'
  }
}
```
关于模块路径的设置项还有**packages**，**map**。

**shim**
对于某些没有按照AMD规范编写的模块，比如jQuery，来说，要使它们能被加载器加载，需要用`shim`方法为其配置一些属性。在`main`模块中，用`require.config()`方法：
```javascript
require.config({
  shim: {
    'jquery': {
      exports: '$'
    },
    'foo': {
      deps: [
        'bar',
        'jquery'
      ],
      exports: 'foo'
    }
  }
});
```
之后再用加载器加载就可以了。

目前实现了AMD规范的库有很多，比较有名的是[Require.js](http://requirejs.org/)。

### CMD（Common Module Definition）
CMD在很多地方和AMD有相似之处，在这里我只说两者的不同点。

首先，CMD规范和CommonJS规范是兼容的，相比AMD，它简单很多。遵循CMD规范的模块，可以在Node.js中运行。

**define**
与AMD规范不同的是CMD规范中不使用`id`和`deps`参数，只保留`factory`。其中：
1.`factory`接收对象/字符串时，表明模块的接口就是对象/字符串。
```javascript
define({ 'foo': 'bar' });

define('My name is classicemi.');
```

**define.cmd**
其值为一个空对象，用于判断页面中是否有CMD模块加载器。
```javascript
if (typeof define === 'function' && define.cmd) {
  // 使用CMD模块加载器编写代码
}
```

**require**
此函数同样用于获取模块接口。如需异步加载模块，使用`require.async`方法。
```javascript
define(function(require, exports, module) {
  require.async('math', function(math) {
    math.add(1, 2);
  });
});
```
我们可以发现，`require(id)`的写法和CommonJS一样是以同步方式加载模块。要像AMD规范一样异步加载模块则使用`define.async`方法。

**exports**
此方法用于模块对外提供接口。
```javascript
define(function(require, exports, module) {
  // 对外提供foo属性
  exports.foo = 'bar';

  // 对外提供add方法
  exports.add = function(a, b) {
    return a + b;
  }
});
```
提供接口的另一个方法是直接return包含接口键值对的对象：
```javascript
define(function(require, exports, module) {
  return {
    foo: 'bar',
    add: function(a, b) {
      return a + b;
    }
  }
});
```
但是注意，不能用exports输出接口对象：
```javascript
define(function(require, exports, module) {
  exports = {
    foo: 'bar',
    add: function(a, b) {
      return a + b;
    }
  }
});
```
**这样写是错误的！**
替代方式是这样写：
```
define(function(require, exports, module) {
  module.exports = {
    foo: 'bar',
    add: function(a, b) {
      return a + b;
    }
  }
});
```
之前错误的原因是在`factory`内部，`exports`实际上是`module.exports`的一个引用，直接给`exports`赋值是不会改变`module.exports`的值的。

在module对象上，除了有上面提到的`exports`以外，还有一些别的属性和方法。
**module.id**
模块的标识。
```javascript
define('math', [], function(require, exports, module) {
  // module.id 的值为 math
});
```

**module.uri**
模块的绝对路径，由模块系统解析得到。
```javascript
define(function(require, exports, module) {
  console.log(module.uri); // http://xxx.com/path/
});
```

**module.dependencies**
值为一个数组，返回本模块的依赖。

## Require.js 和 Sea.js
之前在说AMD规范的时候提到了Require.js。它是AMD规范的代表性产品。另一个[Sea.js](http://seajs.org/)在前端界也是赫赫有名了，CMD规范实际上就是它的产出。它们之间的区别也很能表现AMD和CMD规范之间的区别。

AMD的依赖需要**前置书写**
```javascript
define(['foo', 'bar'], function(foo, bar) {
  foo.add(1, 2);
  bar.subtract(3, 4);
});
```

CMD的依赖**就近书写**即可，不需要提前声明：
同步式：
```javascript
define(function(require, exports, module) {
  var foo = require('foo');
  foo.add(1, 2);
  ...
  var bar = require('bar');
  bar.subtract(3, 4);
});
```
异步式：
```javascript
define(function(require, exports, module) {
  ...
  require.async('math', function(math) {
    math.add(1, 2);
  });
  ...
});
```
虽然AMD也可以用和CMD相似的方法，但不是官方推荐的。

之前在介绍CMD的API时，我们可以发现其API职责专一，例如同步加载和异步加载的API都分为`require`和`require.async`，而AMD的API比较多功能。

总而言之，引用玉伯的总结：
1. Require.js同时适用于浏览器端和服务器环境的模块加载。Sea.js则专注于浏览器端的模块加载实现。通过Node扩展也可以运行于Node环境中。
2. Require.js -> AMD，Sea.js -> CMD。
3. RequireJS 在尝试让第三方类库修改自身来支持 RequireJS，目前只有少数社区采纳。Sea.js 不强推，采用自主封装的方式来“海纳百川”，目前已有较成熟的封装策略。
4. Sea.js的调试工具比较完备，Require.js调试比较不方便。
5. RequireJS 采取的是在源码中预留接口的形式，插件类型比较单一。Sea.js 采取的是通用事件机制，插件类型更丰富。

*怎么看都像是在自夸啊= =，当然它有这个资格*

## 参考文献
1. [CommonJS官网](http://wiki.commonjs.org/wiki/CommonJS)
2. [阮一峰博客](http://www.ruanyifeng.com/blog/2012/10/javascript_module.html)
3. [AMD Github](https://github.com/amdjs/amdjs-api/wiki/AMD)
4. [CMD Github](https://github.com/cmdjs/specification/blob/master/draft/module.md)
5. [Sea.js](http://seajs.org/)
6. [Require.js](http://requirejs.org/)