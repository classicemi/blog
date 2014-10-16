title: JavaScript 设计模式读书笔记(一)——接口
date: 2014-04-20 21:31:28
tags:
- 前端
- JavaScript
- 学习笔记
- 设计模式
---
## JavaScript 中模仿接口的三种方法
### 1. 注释描述
``` JavaScript
/*

interface Composite {
  function add(child);
  function remove(child);
  function getChild(index);
}

interface FormItem {
  function save();
}

 */

var CompositeForm = function(id, method, action) { // 定义接口类
  ...
};

// 为接口类添加方法
CompositeForm.prototype.add = function(child) {
  ...
};
CompositeForm.prototype.remove = function(child) {
  ...
};
CompositeForm.prototype.getChild = function(index) {
  ...
};

CompositeForm.prototype.save = function() {
  ...
};
```
此种方法不易规范遵守，属于程序文档范畴，对接口的约定遵守全靠自觉。但是易于实现，不需额外的类或函数。

<!--more-->

### 2. 属性检查
``` JavaScript
/*

interface Composite {
  function add(child);
  function remove(child);
  function getChild(index);
}

interface FormItem {
  function save();
}

 */

var CompositeForm = function(id, method, action) {
  this.implementsInterfaces = ['Composite', 'FormItem'];
  ...
};

...

function addForm(formInstance) {
  if (!implements(formInstance, 'Composite', 'FormItem')) {
    throw new Error("Object does not implement a required interface.");
  }
  ...
}

// 检查一个对象是否实现了需要的接口
function implements(object) {
  for (var i = 1; i < arguments.length; i++) {
    var interfaceName = arguments[i];
    var interfaceFound = false;
    for (var j = 0; j < object.implementsInterfaces.length; j++) {
      if (object.implementsInterfaces[j] == interfaceName) {
        interfaceFound = true;
        break;
      }
    }
    if (!interfaceFound) {
      return false; // 未找到接口
    }
  }
  return true; // 所有接口都找到了
}
```
此方法的优点是对类实现的接口提供了文档说明，如果需要的接口未实现则会报错。缺点在于不能保证类是否真正实现了接口，只知道它是否说自己实现了接口，即使代码未将接口实现也能通过检查，这将在代码中留下隐患。

### 3. 鸭式辨型
鸭式辨型的意思就是，如果对象具有与接口定义的方法同名的所有方法，那么就认为它实现了这个接口。
``` JavaScript
// Interfaces

var Composite = new Interface('Composite', ['add', 'remove', 'getChild']);
var FormItem = new Interface('FormItem', ['save']);

// CompositeForm class

var CompositeForm = function(id, method, action) {
  ...
};

...

function addForm(formInstance) {
  // 如果需要的方法未实现则报错
  ensureImplements(formInstance, Composite, FormItem);
  ...
}
```
`ensureImplements`函数至少接受两个参数，一个是需要检查的对象，其余为针对此对象需要检查是否实现的接口。具体检查方式则是检查对象是否实现了接口所声明的所有方法。

此方法的缺点是缺乏其他两种方法的自我描述性，需要一个辅助类`Interface`和一个辅助函数`ensureImplements`。并且它只关心方法名称而不检查参数名称、数目、类型等。

## `Interface`类
综合第一及第三种接口实现方式，`Interface`类的定义可以为：
``` JavaScript
// Constructor

var Interface = function(name, methods) {
  if (arguments.length != 2) {
    throw new Error("Interface constructor called with " + arguments.length +
      " arguments, but expected exactly 2.");
  }

  this.name = name;
  this.methods = [];
  for (var i = 0, len = methods.length; i < len; i++) {
    if (typeof methods[i] !== 'string') {
      throw new Error("Interface constructor expects method names to be " +
        " passed in as a string");
    }
    this.methods.push(methods[i]);
  }
};

// Static class method

Interface.ensureImplements = function(object) {
  if (arguments.length < 2) {
    throw new Error("Function Interface.ensureImplements called with " +
      arguments.length + " arguments, but expected at least 2.");
  }

  for (var i = 1, len = arguments.length; i < len; i++) {
    var interface = arguments[i];
    if (interface.constructor !== Interface) {
      throw new Error("Function Interface.ensureImplements expects arguments" +
        "two and above to be instances of Interface.");
    }

    for (var j = 0, methodsLen = interface.methods.length; j < methodsLen; j++) {
      var methods = interface.methods[j];
      if (!object[method] || typeof object[method] !== 'function') {
        throw new Error("Function Interface.ensureImplements: object " +
          "does not implement the " + interface.name +
          " interface. Method " + method + " was not found.");
      }
    }
  }
};
```

## 依赖接口的设计模式
以下的设计模式依赖接口
1. ** 工厂模式 **保证生产出来的对象实现了必须的方法。
2. ** 组合模式 **将对象群体与组成对象同等对待。
3. ** 装饰者模式 **透明地为另一对象提供包装，实现相同的接口。
4. ** 命令模式 **所有的命令对象都实现了同一批方法。