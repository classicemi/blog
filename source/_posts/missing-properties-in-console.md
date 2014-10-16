title: 消失的属性
date: 2014-10-04 22:29:28
tags:
- 前端
- JavaScript
---
最近在开发组件的过程中，需要随时监控整个组件对象的构建，包括对象上的属性方法的变更，以及原型链的变化。本来，在测试代码中加一个`console.log`：
``` javascript
var d = new dialog({
    ...
});
console.log('final object', d);
d.show();
```
就可以观察最终生成的组件对象是否符合我的预期，也没出过什么问题，也没理由会出现什么问题，直到调试过程中出现了这样的情况：

<!--more-->

组件的配置需要将用户传入的配置属性和默认属性进行合并，然后需要对组件对象中的一个属性布尔值进行判断后改写组件的另一个属性：
``` javascript
this.maskOpacity = this.modal ? this.maskOpacity : 0;
```
第一眼看上去代码似乎没有问题(实际上有问题)，但是运行时和预期行为不一致，`this.modal`的判定始终为`false`。那么我就很顺手地打上一句`console.log(this)`来检查对象的属性，当调整传入的配置对象时，生成对象上的`this.modal`属性应该会随之变化，检查控制台输出结果，`this.modal`的值确实是会根据参数不同而变化的。这就奇怪了，试着打断点调试，结果就不一样了，`this.modal`的值在执行判断时显示为`undefined`。同样的事情在Chrome和FF中都发生了。

这个`modal`属性神秘消失了。

问题一分为二，一个是代码本身的逻辑问题，经过进一步调试，在执行到这句判断的时候，配置对象中的`modal`属性值还未写入`this`，所以`this.modal`值为`undefined`的现象是正常的，通过修改`this.modal`为`opt.modal`比较轻易就解决了。第二个问题却是在调试过程中遇到的，`console.log`出的`this`为何能查找到本不应存在的`modal`属性，导致误导了我的思路。借助于万能的StackOverflow，最后总算是找到了原因。

这段组件的代码逻辑是比较复杂的，其中的`this.modal`属性，在上文执行判断的语句处，确实应该`undefined`，但是在后面的代码中，有这样一段赋值：
``` javascript
this.modal = opt.modal = true;
```
这段赋值直接改写了`this.modal`，可为何后文的赋值会影响到前文的输出呢？其中的原因在于，当`console.log(this)`输出时，`this`对象在控制台中的显示为折叠状态，如图：
![](/img/missing-properties-in-console/fold-this.jpg)
为了查看对象中具体的属性信息，就必须用鼠标点一下展开，这个时候，JS早就执行完毕了，`this.modal`的值也已改写，在展开`this`对象的时刻，`this`中的属性显示结果实际上是`this`对象的最终形态，那么这种输出上的“延迟”是延迟到所有JS执行结束还是仅局限于`console`语句所在函数作用域内呢？我们可以写段代码验证一下：
``` javascript
var foo = {};
function addProperty() {
    foo.test1 = 'test1';
    foo.test2 = 'test2';
    foo.test3 = 'test3';
    foo.test4 = 'test4';
    foo.test5 = 'test5';
    foo.test6 = 'test6';
    foo.test7 = 'test7';
    foo.test8 = 'test8';
    foo.test9 = 'test9';
    console.log(foo);
    foo.bar = 'bar';
}
addProperty();
foo.baz = 'baz';
foo = null;
console.log(foo);
```
代码写得很挫，纯粹是为了测试而写了。在这里我还在最后加了一个对`null`的指向来销毁对象（严格来说还应该delete掉对象的所有属性，这里省略），控制台中的输出如下：
![](/img/missing-properties-in-console/expand-test.jpg)
可见，控制台中输出的“延迟范围”是整个脚本代码的范围，不局限于某个函数作用域，同时还不受赋值为`null`的影响，当然，在`foo = null;`之后的`console`的输出就确实为`null`了。

同时，触发这种“延迟”现象还有一个必要条件，那就是输出对象的属性要足够多，使得控制台会先将对象内容折叠起来，给用户点击展开的机会，如果属性过少，两行就显示完了，也就看不到这个bug了。

在各种条件的巧合作用下发现了这样一个现象，在今后的开发过程中要加以注意，不要受到误导，甚至于利用这种特性为开发提供便捷。