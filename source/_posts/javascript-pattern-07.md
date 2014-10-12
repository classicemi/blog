title: JavaScript 设计模式读书笔记(七)——适配器模式
date: 2014-05-12 20:14:28
tags:
- 前端
- JavaScript
- 学习笔记
- 设计模式
---
## 与门面模式的联系
本文要说的适配器模式和上一篇门面模式在思想上有相似之处，所以放在一起说。它们都对类的接口进行了一些改变。门面模式是把相似的或是完成相关任务的接口进行组织，提供给用户一个更加简单易用，更适用于某种业务的接口。而适配器模式是要把一个接口转换为另一个接口，它不对接口的功能进行干涉，它不会简化接口，而是将接口变为更丰富且兼容的接口。

简而言之，门面模式是让本来就可以用的接口变得更好用。而适配器是让不合适的接口变得合适。

<!--more-->

## 适配器的概念
适配器的思想用线框图来表示就是这样：
```html
 +------+          +------+
 |  某  |interface1|  适  | interface2
 |  个--|----------|--配--|------------→
 |  类  |          |  器  |
 +------+          +------+
```
这个框图能让人想起什么？我想到了这个：
![](/img/adapter.jpg)
将一个不能直接使用的耳机接头进行转换，成为可以使用的样子。

假设一个类的方法是这样的：
```javascript
orange.showInfo = function(name, color, weight) {
  console.log(name + ' is ' + color + ' and its weight is ' + weight);
};
```
而我们现有的对象都是这样
```javascript
var o = {
  name: 'classicemi',
  color: 'orange',
  weight: '300g'
}
```
我们当然可以这样使用接口：
```javascript
orange.showInfo(o.name, o.color, o.weight);
```
同样，我们也可以：
```javascript
function adaptedShowInfo(o) {
  orange.showInfo(o.name, o.color, o.weight);
}

// 通过适配过的接口进行调用
adaptedShowInfo(o);
```
这样，简化了接口的调用过程，对接口进行了一定程度的改造。

## jQuery中的适配器
上面提到的适配器写法只是表现了适配器是一个什么样的东西，但实际项目中不会出现这样的代码。我们以jQuery中的一个API为例，说说实际应用中的适配器模式的使用方法。

在jQuery样式相关的API中，最方便使用的就是`css()`了，这个接口是把`set`和`get`的功能合二为一了：
```javascript
// 既可以像这样调用，取得opacity值
$('.elem').css('opacity');

// 也可以像这样，设置opacity值
$('.elem').css({'opacity': '0.9'});
```
这是怎么实现的呢，在jQuery核心代码中，与set/get opacity相关的代码如下：
```javascript
jQuery.cssHooks.opacity = {
  get: function( elem, computed ) {
    // IE uses filters for opacity
    return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
      ( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
      computed ? "1" : "";
  },

  set: function( elem, value ) {
    var style = elem.style,
      currentStyle = elem.currentStyle,
      opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
      filter = currentStyle && currentStyle.filter || style.filter || "";

    // IE has trouble with opacity if it does not have layout
    // Force it by setting the zoom level
    style.zoom = 1;

    // if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
    // if value === "", then remove inline opacity #12685
    if ( ( value >= 1 || value === "" ) &&
        jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
        style.removeAttribute ) {

      // Setting style.filter to null, "" & " " still leave "filter:" in the cssText
      // if "filter:" is present at all, clearType is disabled, we want to avoid this
      // style.removeAttribute is IE Only, but so apparently is this code path...
      style.removeAttribute( "filter" );

      // if there is no filter style applied in a css rule or unset inline opacity, we are done
      if ( value === "" || currentStyle && !currentStyle.filter ) {
        return;
      }
    }

    // otherwise, set new filter values
    style.filter = ralpha.test( filter ) ?
      filter.replace( ralpha, opacity ) :
      filter + " " + opacity;
  }
};
```
通过对传入参数的适配，实现不同的功能。因为不看参数的话，调用的方式是完全一样的。那么从参数下手，通过校验参数的形式，确定用户要实现的功能。

## 适配器模式的适用场景
适配器不会去改变实现层，那不属于它的职责范围，它干涉了抽象的过程。外部接口的适配能够让同一个方法适用于多种系统。

如果内部的实现出现了问题，需要动手术解决的话，那就不应该使用适配器了，因为那只是治标不治本的方法，反而会增加代码的复杂度。对实现进行全面优化的带来的是真正的改善。而如果实现层的问题不大，要解决一部分适配问题的话，适配器模式就是很好的选择了。