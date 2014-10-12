title: JavaScript 设计模式读书笔记(五)——工厂模式
date: 2014-05-03 12:14:28
tags:
- 前端
- JavaScript
- 学习笔记
- 设计模式
---
一般来说，创建对象的时候我们都习惯使用`new`关键字来调用constructor构造函数，但使用这种方式会有一些缺点，首先构造器函数的创建本身就是为了模仿其他一些面向对象语言的特性，有些人觉得这是*non-sense*；另一方面，在一个类中用`new`关键字调用其他类的构造函数，会造成两个类之间的耦合，设计模式应该要尽量避免这些影响代码可重用性的问题。

<!--more-->

## 简单工厂模式
一个工厂可以生产同一类的多种物品，具体生产哪种就看客户下什么订单了。工厂模式也是一样，我们创建一个工厂类，它可以创建多种实例，由开发者指定。
假设有一个生产交通工具的工厂类`Vehicle`，它包含生成多种交通工具实例的方法。
```javascript
function Vehicle() {}

Vehicle.prototype = {
  createVihicle: function(options) {
    var vehicle;

    switch(options.type) {
      case 'car':
        vehicle = new Car();
        break;
      case 'truck':
        vehicle = new Truck();
        break;
      default:
        vehicle = new Bike();
    }

    return vehicle;
  }
};
```
在使用这个类生产对象的时候，传入`option`参数，在参数中的`type`属性规定我们需要的类型，构造函数就能够返回我们需要的对象类型了。使用这种方法，如果我们要添加新的交通工具类型也是很方便的，在工厂的`switch`中直接添加一个`case`就可以了。
```javascript
switch(options.type) {
  case 'car':
    vehicle = new Car();
    break;
  case 'truck':
    vehicle = new Truck();
    break;
  case 'plane':
    vehicle = new Plane();
    break;
  default:
    vehicle = new Bike();
}
```
通过这种方式，将成员对象的创建工作转交给外部对象，可以像上述代码一样转交给独立的命名空间，像`Car`，`Truck`，`Plane`等，如果外部对象属于同一类的话，将它们组织为一个大类中的子类比较合理。

## 工厂模式
以上介绍的是简单工厂模式，简单工厂模式会把创建工作交给**外部**的类来做，这实际上会增加类的数量，并不利于代码的组织。真正的工厂模式会把创建工作交给子类来完成，父类只对创建过程中的一般性问题进行处理，这些处理会影响到每个子类，而子类之间相互独立，可以对创建过程进行一些定制化操作。

还是以生产交通工具为例，将交通工具父类改写为一个**抽象类**，它不负责直接生产交通工具，而是通过它派生出一些子类，这些子类代表不同的国家，不同的国家可以生产自己的交通工具。

将父类抽象化：
```javascript
function Vehicle() {}

Vehicle.prototype = {
  createVihicle: function(options) {
    // 这里不直接生产，如果直接调用会抛出错误
    throw new Error('Unsupported operation on an abstract class.')
  }
};
```
不同的国家作为子类，子类首先对父类进行继承，然后实现自己的`createVehicle`方法。
```javascript
function China() {}

// 继承方法
extend(China, Vehicle);

// 实现自己的createVehicle方法
China.prototype.createVehicle = function(options) {
  var vehicle;

  switch(options.type) {
    case 'car':
      vehicle = new Car();
      break;
    case 'truck':
      vehicle = new Truck();
      break;
    default:
      vehicle = new Bike();
  }

  return vehicle;
}
```
以后要生产交通工具的时候就调用`China`子类的`createVehicle`方法就可以了。
```javascript
var chinaVehicle = new China();
var myCar = chinaVehicle.createVehicle({ type: 'Car' });
```
一般性的代码集中在父类中，个性化的代码在子类中单独定制。

## 工厂模式适用场合
子类的共同点是它们都实现了同一批接口，尽管内部细节并不尽相同。生产对象的方法有一个选择性的过程，这种选择可以是开发者自定的，比如需要生产何种交通工具，也可以是自动选择的，比如根据浏览器环境生产合适的XHR对象。对于相似性很高，实现了同一类接口的对象，工厂模式是比较合适的。

另外的一大好处就是子类的一些设置代码可以全部放在父类的构造器函数中，不需要在每个子类的构造函数中重复运行同样的代码，只需要在父类的代码中实现一次就好。子类只需要专注于实现自己的方法，不用考虑别的问题。

最后一点则是如果一个类中包含了很多更小的子类作为自己的组成部分，那么替换这些子类的工作会很简单，因为工厂模式降低了模块之间的耦合度，一个模块并不会依赖于其某一组成部分。