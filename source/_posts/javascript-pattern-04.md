title: JavaScript 设计模式读书笔记(四)——单体模式和链式调用
date: 2014-04-27 12:38:28
tags:
- 前端
- JavaScript
- 学习笔记
- 设计模式
---
## 设计模式分类
接下来就正式进入设计模式的介绍了，JavaScript设计模式有很多
## 单体模式
在多种Javascript设计模式中，**单体模式**是最简单，也是最基础的设计模式。它基础到似乎不太像是一种设计模式，因为我们在编写代码的过程中随时都会用到，并不需要过多思考，这是它简单的一面。同时，它不仅可以单独存在，甚至也可以成为其他较高级设计模式的组成部分，这也是为什么说它基础的原因。

<!--more-->

### 基本结构
既然说了单体模式是非常简单的，它的结构也是很简单的。最简单的单体结构实际上就是一个对象字面量：
```JavaScript
var Singleton = {
  attribute1: true,
  attribute2: 1,

  method1: function() {
    ...
  },
  method2: function() {
    ...
  }
}
```
这就是一个基本的单体结构了。

但是，不是任何对象字面量都可以被称作为单体结构的，单体结构应该是一个只能被实例化一次，并且可以通过一个访问点访问的类。所谓访问点，可以理解为一个变量，这个变量在全局范围内可以访问到，并且只有一个。

### 单体结构的作用
那么单体结构的作用是什么呢，难道只是用来创建一个实例化的对象这么简单吗？

**命名空间**
当然不是的，单体最显而易见的作用就是划分命名空间。单体结构在页面中有一个访问点，那么单体中保存的所有属性和方法也就可以从这个访问点访问了，通过点运算符的形式。而且也只有通过访问点才可以访问到。Javascript中的所有变量都是可以被改写的，当一个程序员维护多个变量的时候，如果不将他们归类到命名空间中去的话，一旦变量被修改，查找起来将非常麻烦。同时，一个命名良好的命名空间名称也可以提醒其他的程序员不要随便修改其中的变量。
```JavaScript
var Classicemi = {
  setName: function(name) {
    ...
  },
  // 其他方法
}
```
在其他地方访问`setName`方法的时候，一定要通过`Classicemi.setName`才能访问的到，这可以提醒其他程序员这个方法的作用和声明的地点。通过命名空间将相似的方法组合到一起也可以增加代码的文档性。另一方面，网页上的Javascript代码会根据其用途有不同的划分，分不同的人来维护。例如JS库代码，广告代码等。为了避免彼此之间产生冲突，在全局对象中也可以给不同用途的代码划分各自的命名空间，也就是存到各个单体中。
```JavaScript
var Classicemi = {};

Classicemi.Common = {
  ...
};

Classicemi.ErrorCodes = {
  ...
};
```

**网页专用代码包装器**
这是单体常见用法的一个示例。
在一个网站中，有些Javascript代码是整个网站都要用到的，比如框架，库等。而有些代码是特定的网页才会用到，例如对一个页面中的DOM元素添加事件监听等。一般我们会通过给页面的`load`事件创建一个`init`方法来对所有需要的操作进行初始化，将所有的初始化代码放在一个方法中。
比如含有一个表单的页面，我们要取消submit的默认行为并添加ajax交互。
```JavaScript
Classicemi.RegPage = {
  FORM_ID: 'reg-form',
  OUTPUT_ID: 'reg-results',

  // 表单处理方法
  handleSubmit: function(e) {
    e.preventDefult();
    ...
  } ,
  sendRegistration: function(data) {
    ... // 发送XHR请求
  },
  ...

  // 初始化方法
  init: function() {
    Classicemi.RegPage.formEl = $(Classicemi.RegPage.FORM_ID);
    Classicemi.RegPage.outputEl = $(Classicemi.RegPage.OUTPUT_ID);

    addEvent(Classicemi.RegPage.FormEl, 'submit', Classicemi.RegPage.handleSubmit); // 添加事件
  }
};

// 页面加载后运行初始化方法
addLoadEvent(Classicemi.PageName.init);
```
这样处理之后，对于不支持XHR的老式浏览器，可以按照原有方式发送表单数据并刷新页面。而现代浏览器中则可以阻止表单提交的默认行为，改由ajax对页面进行部分刷新，提供更好的用户体验。

### 在单体中表示私用成员
对象中有时候有些属性和方法是需要进行保护，避免被修改的，这些成员称为私用成员。在单体中声明私用成员也是保护变量的一个好方法，另外，单体中创建私用成员的另一个好处在于由于单体只会被实例化一次，定义私用成员的时候就不用过多考虑内存浪费的问题。

**伪私用成员（下划线表示法）**
通过特殊命名的变量来提醒其他开发者不要直接访问对象成员的方法。
```JavaScript
Classicemi.Singleton = {
  // 私用成员
  _privateMethod: function() {
    ...
  },

  // 公开成员
  publicMethod: function() {
    ...
  }
}
```
在该单体的方法中，可以通过`this`访问其他方法，但这会有一定的风险，因为在特殊情况下`this`不一定指向该单体。因此还是将调用名称写全是最安全的做法。

**使用闭包**
加下划线的方法毕竟是假的，使用闭包才能创建真正意义上的私用成员。我们知道Javascript只存在函数作用域，因此要利用闭包的特性就不能使用对象字面量的形式，而要通过构造函数返回来实现单体对象的创建了。第一步，我们通过一个构造函数返回一个空对象，这就是单体对象的初始化：
```JavaScript
var Classicemi.Singleton = (function() {
  return {};
})();
```
我们通过一个自执行构造函数返回单体对象的实例，下面就可以在这个构造函数中添加我们需要的私用对象了。
```JavaScript
var Classicemi.Singleton = (function() {
  // 私用属性
  var privateAttribute = true;

  // 私用方法
  function privateMethod() {
    ...
  }
  return {};
})();
```
可以公开访问的公开属性和方法可以写在构造函数返回的对象中：
```JavaScript
var Classicemi.Singleton = (function() {
  // 私用属性
  var privateAttribute = true;

  // 私用方法
  function privateMethod() {
    ...
  }
  return {
    publicAttribute: false,

    publicMethod: function() {
      ...  
    }
  };
})();
```
这就是用闭包创建私有成员的方法，这种单体模式又被成为**模块模式（Module Pattern）**，我们创建的单体可以作为模块，对代码进行组织，并划分命名空间。

和之前说到的下划线表示私用成员方法比较起来，最大的优点就是可以创建真正的私用成员，使其不会在构造函数之外被随意修改。同时，由于单体只会被实例化一次，不用担心内存浪费的问题。单体模式是Javascript中最简单，最流行的模式之一。

### 惰性实例化单体
单体一般会在页面加载过程中进行实例化，如果单体的体积比较大的话，可能会对加载速度造成影响。对于体积比较大，在页面加载时也暂时不会起作用的单体，我们可以通过**惰性加载（lazy loading）**的方式进行实例化，也就是在需要的时候再进行实例化。

要实现惰性加载，我们要借助一个静态方法来实现。在单体的命名空间中，我们声明这样一个方法`getInstance()`。这个方法会对单体是否已经进行了实例化进行检测，如果还没有实例，则会创建并返回实例。如果已经实例化过了，则会返回现有实例。

实现惰性加载，我们要把原单体构造函数中的所有成员转移到一个内部的新构造函数中去：
```JavaScript
Classicemi.Singleton = (function() {
  function constructor() {
    // 私用属性
    var privateAttribute = true;

    // 私用方法
    function privateMethod() {
      ...
    }
    return {
      publicAttribute: false,

      publicMethod: function() {
        ...  
      }
    };
  }
})();
```
这个内嵌构造函数不能从闭包外部访问，那么在闭包内部返回对象中的`getInstance`方法可以有访问`constructor`方法的特权，可以保证`constructor`方法只会被我们控制。

在`getInstance()`方法内部，首先要对单体是否已经实例化进行检查，如果已经实例化过，就将其返回。如果没有实例化，就调用`constructor`方法。我们需要一个变量来保存实例化后的单体。
```JavaScript
Classicemi.Singleton = (function() {
  var uniqueInstance; // 保存实例化后的单体

  function constructor() {
    ...
  }

  return {
    getInstance: function() {
      if (!uniqueInstance) {
        uniqueInstance = constructor();
      }
      return uniqueInstance;
    }
  }
})();
```
单体的构造函数像这样被改写后，调用其方法的代码就要由这样：
```JavaScript
Classicemi.Singleton.publicMethod();
```
改写为：
```JavaScript
Classicemi.Singleton.getInstance().publicMethod();
```
惰性加载的使用可以避免不必要的单体在页面加载时实例化影响加载速度，但引入一个`getInstance()`方法也会在一定程度上增加代码的复杂性，因此惰性加载应该在必要的时候再使用。

### 分支
**分支（branching）**技术的意义在于根据不同的条件，对单体进行不同的实例化过程。
```
                    constructor
                         │condition
            ┌────────────┼────────────┐
            │            │            │
return   branch1      branch2      branch3
```
在构造函数中存在不同的实例对象，针对condition判断条件的不同返回值，构造函数返回不同的对象作为单体的实例。例如对不同的浏览器来说，支持的`XHR`对象不一样，大多数浏览器中是`XMLHttpRequest`的实例，早期的IE浏览器中是某种`ActiveX`的实例。我们在创建`XHR`对象的时候，可以根据不同浏览器的支持情况返回不同的实例，like this：
```JavaScript
var XHRFactory = (function() {
  var standard = {
    createXHR: function() {
      return new XMLHttpRequest();
    }
  };
  var activeX = {
    createXHR: function() {
      return new ActiveXObject('Msxml2.XMLHTTP');
    }
  };
  var activeOld = {
    createXHR: function() {
      return new ActiveXObject('Microsofe.XMLHTTP');
    }
  }

  var testObj;
  try {
    testObj = standard.createXHR();
    return standard;
  } catch (e) {
    try {
      testObj = activeX.createXHR();
      return standard;
    } catch (e) {
      try {
        testObj = activeOld.createXHR();
        return standard;
      } catch (e) {
        throw new Error('No XHR object found in this environment.');
      }
    }
  }
})();
```
通过`try-catch`语句对浏览器`XHR`的支持性进行测试同时防止抛出错误，这样不同浏览器都能创建出自己支持的`XHR`对象的实例。

## 单体模式之利弊
### 单体模式之利
1. 单体模式能很好的**组织代码**，由于单体对象只会实例化一次，单体对象中的代码可以方便地进行维护。
2. 单体模式可以生成自己的**命名空间**，防止自己的代码被别人随意修改。
3. **惰性实例化**，有助于性能的提升。
4. **分支**，针对特定环境定制专属的方法。

### 单体模式之弊
类之间的耦合性可能增强，因为要通过命名空间去对一些方法进行访问，强耦合的后果会不利于单元测试。

## 链式调用
说起链式调用，绝大多数的前端开发者一定会马上想到大名鼎鼎的[**jQuery**](http://jquery.com/)，这说明jQuery对开发者思想的束缚还真是深啊。。。

Anyway，jQuery的链式调用特性确实是给开发带来了很多的便利，一条语句可以完成几条语句的工作。那么链式调用是怎么实现的呢？

要实现链式调用其实是利用JavaScript的一些语法特性，主要分为两个部分：
1. 创建包含需要操作的HTML元素的对象。
2. 对这个HTML元素进行操作的方法。

将所有的方法都定义在构造器函数prototype属性所指的对象中，这样所有的实例都可以调用这些方法，并且所有的方法都返回调用它们的实例的引用。这样就实现了一个基本的链式调用。
```javascript
(function() {
  function _$(els) {
    this.elements = [];
    ... // 通过一系列操作将匹配元素存入this.elements
  }

  window.$ = function() { // 对外接口
    return new _$(arguments);
  }
})();
```
接下来就可以在构造器函数的原型所指对象中添加我们需要的方法了，我们可以根据需要添加DOM方法，ajax方法等，然后就可以完成一个小JS库了~
```javascript
(function() {
  function _$(els) {
    ...
  }

  _$.prototype = {
    each: function(fn) {
      for (var i = 0, len = this.length; i < len; i++) {
        fn.call(this, this.elements[i]);
      }
      return this;
    }
    ...
  }
})();
```
关键的一点就是每个方法的最后都是`return this;`，它返回调用方法的实例引用，这样我们可以继续让这个`this`去调用其他方法，从而实现链式调用。

**使用回调**
回调的模式如果按照常规的方式运用在一些取值器方法上的时候，可能会给使用者造成一些麻烦。因为使用取值器的时候，可能下一步我们需要对取到的值进行一些操作，而链式调用返回的是对象本身。

为了保持链式调用能使用，`return this;`是不能动的，那么要对取到的值进行操作的话，就应该在取值器内部进行，将我们需要的操作过程封装成函数传入取值器，将值作为自定义函数的参数，这就是典型的回调函数思想。
```javascript
(function() {
  function _$(els) {
    ...
  }

  _$.prototype = {
    getValue: function(callback) {
      callback.call(this, this.value); // 通过传入回调函数对取到的值进行操作
      return this; // 同时不影响继续链式调用
    }
    ...
  }
})();
```