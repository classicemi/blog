title: JavaScript 设计模式读书笔记(三)——继承
date: 2014-04-23 21:28:28
tags:
- 前端
- JavaScript
- 学习笔记
- 设计模式
---
继承这个东西在JavaScript中尤其复杂，我掌握得也不好，找工作面试的时候在这个问题上栽过跟头。JavaScript的继承方式属于原型式继承，非常灵活。因此JavaScript的继承方式除了基于类的继承之外还有基于原型的原型式继承。

<!--more-->

## 继承是什么
看了这个词的第一反应我联想到了财产继承，在一般情况下，父母的遗产由子女继承，也就是说子女将会获得财产的使用权。而JavaScript中的继承与现实生活中的财产继承还是有区别的。首先，JavaScript中的父类和子类可以同时并存，而遗产么，什么样的财产叫遗产呢？其次，财产是花了就没了，而JS里的继承则是子类能够继承父类的方法，可以重复使用，减少代码量。当几个类都需要一个相似的方法时，使用继承可以从同一个类中继承相同的方法，而不用对每个类重复地复制粘贴了。

不用在定义上纠缠过久，下面讨论一下实现继承的一些方法。

## 继承的基本方法
开头便说到了JS的继承方式分为基于类的继承（简称类式继承）和基于原型链的继承（简称原型式继承）。
### 类式继承
类式继承的特点就是使用函数声明类，通过`new`关键字创建实例。

创建类的方法很简单，一般可以写成这样：
```JavaScript
function Blog(address) {
  this.address = address;
}

Blog.prototype.getAddress = function() {
  return this.address;
}
```
创建该类的实例通过`new`关键字即可：
```JavaScript
var blog = new Blog('classicemi.github.io');
blog.getAddress(); // 'classicemi.github.io'
```
当使用`new`关键字时，它和通过一般方式执行函数的区别在于函数的执行方式会改变。当使用`new`关键字执行`Blog`类的构造函数时，系统首先创建一个新对象，这个对象会继承自构造函数`Blog`的原型对象（新对象的原型就是构造函数的`prototype`属性）。再将`this`关键字绑定到新对象上，再返回该新对象。也就是说，构造函数用来对生成的新对象进行一些处理，使这个新对象具有某些特定的属性。

创建一个继承`Blog`的类就需要手工完成和`new`运算符相似的工作了。
```JavaScript
function MyBlog(address, author) {
  Blog.call(this, address);
  this.author = author;
}
```
当通过`new`关键字调用`MyBlog`构造函数时，系统会创建一个新对象（这步是自动的，`this`即为这个新对象），然后在`this`上调用超类`Blog`的构造函数，再给`this`添加一些`MyBlog`类特有的不是继承自`Blog`类的属性，最后将新对象`this`返回（这步也是自动的）。

下面为了继承`Blog`类的方法，需要设置原型链，使`MyBlog`类能够在原型链上找到继承自`Blog`类的方法。
```JavaScript
MyBlog.prototype = new Blog(); // MyBlog类的原型是Blog类的一个实例
MyBlog.prototype.constructor = MyBlog; // 上一步执行后prototype的constructor属性会变成Blog，需要修改回来
MyBlog.prototype.getAuthor = function() { // 给MyBlog添加自己的方法
  return this.author;
}
```
通过这些操作后，`MyBlog`类就声明好了，它继承了`Blog`类的属性和方法，创建`MyBlog`类实例的方法和创建`Blog`类实例的方法一样，直接使用`new`关键字调用构造函数即可。

### 原型式继承
之前的类式继承是为了模仿其他一些面向对象语言的特点而创造的，并没有真正体现JavaScript语言本身的特点，下面要说的原型式继承则是利用JS的原型特性而实现的继承方式。

使用原型式继承时，不需要像类式继承一样用一个类（构造函数）来定义对象的结构，而可以用对象字面量的方式直接创建一个对象，这个对象是作为原型存在的，被称作原型对象(prototype object)。就像工厂生产车间里的模具一样，为以后生产出的零件提供了参考原型。

还是以之前的`Blog`和`MyBlog`类为例：
```JavaScript
// Blog原型对象
var Blog = {
  address: 'classicemi.github.io', // 属性只是作为默认值，一般都会被改写
  getAddress: function() {
    return this.address;
  }
};
```
这里没有像用一个构造函数来定义`Blog`类的结构，将方法添加在`Blog.prototype`上。这里定义的`Blog`对象只是作为原型存在，为继承`Blog`类的对象提供一些方法。

现在原型对象有了，要创建继承该原型对象对应的类的新类应该怎么做呢？利用JS的原型链特性，只要将新类的原型设为该原型对象即可。按照这种思路可以写出子类`MyBlog`的创建方法：
```JavaScript
function MyBlogConstrucFunc() {}
MyBlogConstrucFunc.prototype = Blog;
var MyBlog = new MyBlogConstrucFunc();
```
通过`new`运算符调用`MyBlogConstrucFunc`函数，返回的是一个空对象，这个空对象的`prototype`属性指向原型对象`Blog`。在返回的空对象中，还可以添加`MyBlog`类自有的属性和方法。

不过通过这三行代码实现子类对超类的继承还是有些冗余，我们可以实现一个方法来实现对超类的继承，将超类作为该方法的参数传入并在最后将空对象返回即可。
```JavaScript
function clone(object) {
  function F() {}
  F.prototype = object;
  return new F();
}
```

### Mixin Class
以上所讨论的是比较严格的继承方式，有的时候，我们可能只想对某个函数进行重用，并不需要完全的继承，那么我们可以将函数以扩充的方式在类之间进行共享。对于重用频率比较高的方法，我们可以将它们归并在一个类中，然后用这个类去扩充其他的类。这种方法称为掺元类（mixin class）。这种处理方法在很多JS库（比如`jQuery`和`Underscore`）中都有用到，是一种扩充工具函数的好方法。
```JavaScript
var Mixin = function() {}
Mixin.prototype = {
  serialize: function() {
    var output = [];
    for(key in this) {
      output.push(key + ': ' + this[key]);
    }
    return output.join(', ');
  }
  ...
};
```
为了能方便地将`Mixin`类中的方法添加到其他类中，我们可以扩展工具函数`augment`：
```JavaScript
function augment(receivingClass, givingClass) {
  if (arguments[2]) { // 可接受三个参数，第三个参数为需添加的方法，多个方法可用数组将方法名传入
    if (arguments[2] instanceOf Array) {
      for (var i = 0, len = arguments[2].length; i < len; i++) {
        if (!receivingClass.prototype[arguments[2][i]]) {
          receivingClass.prototype[arguments[2][i]] = givingClass.prototype[arguments[2][i]];
        }
      }
    } else if (typeof arguments[2] === 'string') {
      if (!receivingClass.prototype[arguments[2]]) {
        receivingClass.prototype[arguments[2]] = givingClass.prototype[arguments[2]];
      }
    }
  } else {
    for (methodName in givingClass.prototype) {
      if (!receivingClass.prototype[methodName]) {
        receivingClass.prototype[methodName] = givingClass.prototype[methodName];
      }
    }
  }
}
```
这时我们如果要给其他类添加`Mixin`中的方法的话可以直接这样写：
```JavaScript
augment(MyBlog, Mixin);
```

## 类式继承和原型式继承的对比
类式继承存在的意义很大一部分是为了满足对JavaScript的特性还不熟悉的程序员，毕竟这种方法是强行为了模仿其他面向对象语言的特性而创造的。JavaScript的原型式特征在父类和子类之间建立了一种双向的联系，这是JS区别于其他语言的特点。
原型式继承发挥了JS的特性，所有的子类继承的方法会通过原型链逐级向父类查找，因此用于继承的方法在内存中只会保存一份，这样可以节约内存。只有在对子类的某个方法进行直接设置，将继承而来的方法覆盖的时候才会对新方法单独生成副本。

## 封装对继承的影响
一个经过封装的类，它的公用方法和特权方法可以被继承下来，因为它们是添加在原型链上的，在作为构造函数的时候可以继承给子类。而私用方法相当于作为了闭包中的变量，与原型链无关，因此不会被继承。

父类中的特权方法可以访问父类中的私用属性，而特权方法会被子类继承，因此子类也可以通过继承的特权方法间接访问父类的私用属性。但子类中新添加的特权方法不能访问父类中的私用属性，因为缺少了到达父类内部的原型链**“通道”**。