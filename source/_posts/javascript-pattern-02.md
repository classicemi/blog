title: JavaScript 设计模式读书笔记(二)——封装，简单的创建对象模式
date: 2014-04-22 13:51:28
tags:
- 前端
- JavaScript
- 学习笔记
- 设计模式
---
## 什么是封装
找工作时一些公司给了offer后我就想知道真正拿到手的是多少，毕竟赋税繁重。但各种税也好，五险一金也好我实在是弄不清楚，于是我就会在网上的一些税后收入计算器上进行计算，只需要填写一些基本信息，比如税前收入，所在地区等等，就能够获得详细的结果，包括各种税收的详细数值。在这个过程中，我只是按照接口给定的要求进行了数据的输入，具体计算过程我并不知道。也就是说，在这个程序内部，数据表现形式和实现细节是隐藏的，这在某种意义上也是封装的一种。

<!--more-->

在JavaScript中，对象中的细节有时也需要隐藏，但JS不像其他的静态语言，比如Java，一样，有`private`这样的关键字。那么在JavaScript中，就可以用闭包的概念来创建只能从对象内部访问的方法和属性。

在使用接口实现信息隐藏的过程中，同时也是使用了接口的概念。好比火影里的通灵术，人与动物签订契约，进行某种交换。这中间的沟通渠道不变，签订契约的人就可以随时随地进行通灵。一个类中，应该定义足够的安全的接口。然而在JS中，语言特性非常灵活，类中的公有方法和私有方法实际是一样的。因此，在实现类的时候，应该避免公开未定义于接口的方法。

## 创建对象
JavaScript中，创建对象的基本模式有三种。
+ ** 直接创建 **对象中的所有方法都是公有的，可以公开访问。
+ ** 使用下划线 **在私有方法名称前加下划线，表示该方法私有。
+ ** 使用闭包 **闭包可以创建真正意义上的私有成员，这些成员只能通过特定方法访问。

### 直接创建
所谓直接创建，就是按照传统的方式创建一个类，构造器是一个函数，属性和方法全部公开，比如：
``` JavaScript
var Fruit = function(color, weight) {
  this.color = color || 'orange';
  this.weight = weight || 150;
}

Fruit.prototype.boom = function() {
  ...  
}
```
这种方法一般来说没什么问题，但是当其原型上的方法`boom`对自身的属性`color`或者`weight`有一定依赖，而构造时传入的参数不符合一定要求时就会出错。但如果构造时没有出错则所有方法应该能正常工作才是。

当然这个问题可以在构造对象时就对传入的参数进行验证，也不算太严重。然而另一个问题在于，即使能对参数进行验证，任何程序员还是能够随意修改属性的值。为了解决这个问题，可以设计一个数据的取值器和赋值器。
``` JavaScript
var Fruit = function(color, weight) {
  this.setColor(color);
  this.setWeight(weight);
}

Fruit.prototype = {
  checkColor: function(color) {
    ...
  },
  setColor: function(color) {
    ...
    this.color = color;
  },
  getColor: function() {
    return this.color;
  },
  ...
}
```
当程序员之间约定以提供的方法对属性值进行操作时，操作过程可以相对得到规范。但实际上属性仍然是公开的，可以被直接设置，这种方法并不能阻止这种行为。

### 使用下划线，区别私用成员
此种方法与前一种方法其实是一回事，只是在私用的方法和属性前加了下划线表示它是私用的。
``` JavaScript
var Fruit = function(color, weight) {
  this.setColor(color);
  this.setWeight(weight);
}

Fruit.prototype = {
  _checkColor: function(color) {
    ...
  },
  setColor: function(color) {
    ... // 此处对输入的数据进行验证，不能通过验证就抛出异常
    this._color = color;
  },
  getColor: function() {
    return this._color;
  },
  ...
}
```
这种方法有助于防止对私用方法的无意使用，但无法保证程序员不有意使用它们。

### 使用闭包
借助闭包就可以创建只允许特定函数访问的变量了，私用属性的创建方法即是在构造函数的作用域中创建变量即可，这些变量可以被该作用域中的所有函数访问。
``` JavaScript
var Fruit = function(newColor, weight) {
  var color, weight;

  // 私用方法
  function _checkColor = function(color) {
    ...
  }

  // 特权方法
  this.getColor = function() {
    return color;
  };

  this.setColor = function(newColor) {
    ... // 验证输入
    color = newColor;
  }

  // 构造过程代码
  this.setColor(newColor);
}
```
借助`this`关键字创建的方法就是特权方法了，它们是公开方法，同时也能够访问私有变量。如果需要创建一些不需要访问私有属性的方法的话，可以在`Fruit.prototype`上进行创建。通过这种方式创建的方法，不能直接访问私有变量，但是可以通过`getColor`这样的特权方法进行间接访问。

当然这种方式也有弊端，如果特权方法过多，会占用较多内存，因为通过构造函数创建的实例都保存了特权方法的副本，而原型上的方法只有一份。因此，在设计构造函数时，需要进行慎重考虑。

另一个问题就在于这样的方法无法作用于需要创建子类的场景，由于特权方法都是新的副本，所以子类无法访问超类的任何私用属性或方法。因此在JavaScript中，这种问题被称作“继承破坏封装”(inheritance breaks encapsulation)。

## 高级创建对象模式初探
以上的三种方法属于创造对象的基本方法，但要实现一些高级的创建对象模式，有必要先了解一些概念。
### 静态方法和属性
前述的闭包创建对象法可以创建私用属性和方法，但是这样的话，这些属性在创建子类时会同时创建副本存于子类，造成内存的浪费。对于一些只需要在类层面进行操作和访问的属性，可以利用闭包创建静态成员。静态成员每个只有一份，直接通过类对象进行访问。

仍然以之前的`Orange`类为例，使用闭包特性添加一些静态成员：
``` JavaScript
var Orange = (function() {
  // 私用静态属性
  var numOfOranges = 0;

  // 私用静态方法
  function checkColor() {
    ...
  }

  // 返回构造器
  return function(newColor, weight) {
    var color, weight;

    // 特权方法
    this.getColor = function() {
      return color;
    };
    this.setColor = function(newColor) {
      ...
      color = newColor;
    }

    // 构造器代码
    numOfOrange++;
    if (numOfOrange > 100) {
      throw new Error('Only 100 instances of Orange can be created.');
    }

    this.setColor(newColor);
  }
})();

// 公开静态方法
Orange.turnToJuice = function() { // 不添加在Orange的prototype上
  ...
};

// 公开的非特权方法
Orange.prototype = {
  checkWeight: function() {
    ...
  }
};
```
这与之前的闭包创建类的最大区别在于构造器由一个普通函数变成了一个内嵌函数，通过一个自执行函数的返回值赋给`Orange`。在实例化`Orange`时，调用的是返回的内嵌函数，外层函数只是一个用来存放静态私用成员的闭包。在构造器中的特权方法可以访问构造器之外的静态属性和方法，而静态方法不能访问任何定义在构造器中的私用属性。

### 常量
常量就是不能被修改的变量，利用静态属性可以在JavaScript中模拟常量。对常量只创建作为取值器的静态方法，而不创建赋值器，在外围作用域中也不能访问到常量：
``` JavaScript
var Class = (function() {
  // 常量
  var CONST = 100;

  // 构造器
  var constructorFunc = function(param) {
    ...
  };

  // 静态方法，取值器
  constructorFunc = function() {
    return CONST;
  };

  return constructorFunc;
})();
```

## 封装之利弊
### 封装之利
保护内部数据，只对外提供取值器和赋值器，便于重构。减少模块间耦合。

### 封装之弊
难以进行单元测试，外部测试无法访问到内部变量和方法。不过如公用方法可以间接访问私用方法的话，可以对私用方法进行间接单元测试。

实现过程较为复杂，调试难度比较大。