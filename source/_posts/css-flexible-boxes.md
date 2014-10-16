title: 使用 CSS3 Flexible Boxes 布局
date: 2014-04-26 20:51:28
tags:
- 前端
- css
- css3
---

Flexible Box是什么？Flexible意为可伸缩的，Box意为盒子，可以理解为一种新式的盒模型——**伸缩盒模型**。由[CSS3规范](http://www.w3.org/TR/2014/WD-css-flexbox-1-20140325/)提出，这是在原有的大家非常熟悉的`block`, `inline-block`, `inline`的基础上延伸出的新一代布局模式。

## 浏览器兼容性
作为非常现实的开发者，是否对一个新技术进行关注，首先要考虑它的浏览器兼容性如何。我们的伸缩盒模型的浏览器兼容性看起来还是相当不错的。

<!--more-->

![](/img/flexible-box-compatibility.jpg)
可以看到，现代浏览器基本上都支持了，IE10开始也支持了（IE和Safari分别加`-ms-`和`-webkit-`前缀即可），移动端的支持情况也比较良好，唯一不支持的平台只有Opera了，咱不带他玩→_→

因此，奥巴马同志说：伸缩盒模型是好的，有前途的。（嗯嗯~）

## 伸缩盒基本概念
伸缩盒的最大特点或者说优点就在于它考虑到了现今高昂的房价和人民日益增长的住宅需求之间的矛盾，房屋面积是有限的，但是我们的伸缩盒能够最合理最高效地把房子分给大家。面积多了，就给大家伙多分点；面积小了，就让各位挤一挤少分点，总而言之不会让任何一个人**露宿街头**的（overflow）！

既然我们提到了房子和住户的关系，那么住户的排列自然需要沿一定的方向。对于块级元素来说，布局的延伸方向是自上而下的，也就是纵向。而对于行内元素来说，布局延伸方向是自左往右的，也就是横向。而伸缩盒呢，它的方向是可变的，既能纵向延伸，也能横向舒展，这取决于你的设置了。

### 伸缩盒模型基本术语
伸缩盒模型的思想和普通的块级元素和行内元素的布局思想有较大的不同，它引入了一些新的概念和术语，通过下面这张图来了解一下：
![](/img/flex_terms.png)

**Flex container 伸缩盒容器**
这就是用来分的房子，这是一间神奇的房子，要让它变得神奇，将`display`属性声明为`flex`或`inline-flex`即可~

**Flex item 伸缩项**
房子里的居民，他们都会占有自己应得的住房面积。

为了形象说明，我们用代码来解释。
```html
<div class="container">
  <div class="item item-1">item 1</div>
  <div class="item item-2">item 2</div>
  <div class="item item-3">item 3</div>
</div>
```
CSS设置为：
```css
.container {
  display: flex;
  width: 300px;
  height: 100px;
  ...
}
```
**在这里`display: inline-flex;`好像也可以。**
对于其中的伸缩项元素，我们需要给他们事先安排好住房面积比例，我们就用最简单最健康的1:1:1吧~我们将比例声明在`flex`属性里
```css
.item-1 {
  flex: 1;
  ...
}
.item-2 {
  flex: 1;
  ...
}
.item-3 {
  flex: 1;
  ...
}
```
Voilà!
![](/img/flex-items.jpg)
我们的大房子被完美地平分成三个隔间了，三家平分房租！

如果有人想住大点的房子，我们直接改变`flex`的比例即可：
```css
.item-1 {
  flex: 1;
  ...
}
.item-2 {
  flex: 1;
  ...
}
.item-3 {
  flex: 2;
  ...
}
```
![](/img/flex-items2.jpg)
是不是很方便？

**Axes 轴**
我们可以看到，图中有两条轴，分别标注了**主轴**和**次轴**（垂直于主轴）。然而实际上哪一条是主轴并不确定，是由我们来规定的。
+ `flex-direction` 此属性规定哪条轴为主轴。
+ `justify-content` 此属性设置了伸缩项在主轴方向上的排列方式，这个稍后解释。
+ `align-items` 此属性和上面的`justify-content`相对，表示伸缩项在次轴上的排列方式。
+ `align-self` 此属性规定某一个特定的伸缩项元素在次轴上的布局方式，在某个元素上设置该属性会覆盖它的`align-items`属性。也就是这个属性会让某个元素更有个性，不走寻常路~

**flex-direction**
当我们不想沿着默认的方向分房子的时候，我们可以改变`flex-direction`属性的值来改变主轴和方向，该属性默认的取值为row；
```css
.container {
  flex: row-reverse;
  ...
}
```
顾名思义，这会让伸缩项的排列方向反过来：
![](/img/flex-items-row-reverse.jpg)
当此属性设置为`column`时，主次轴就会对调，元素的排列方向也会随之改变：
```css
.container {
  flex-direction: column;
  ...
}
```
![](/img/flex-items-column.jpg)
至于`flex: column-reverse`的含义就不用我多说了吧~

**justify-contents**
有的时候，大家挨着住，一点空隙都没有也会很难受，连个过道都没有，隐私也不能保证对吧。这个时候，我们可以改变分配政策了，不再按比例分配，而是定额分配，每个人的面积是确定的。多出的房屋面积改成公共区域。
```css
.item {
  width: 80px;
  ...
}
...
```
**设定了`width`属性后也要记得去掉`flex`属性的声明哦，不然`flex`属性的效果仍然会把`width`覆盖掉~**
**同时，如果`width`属性也不设定的话，元素宽度会表现为内容的宽度，which means 当伸缩项内部无内容时，将不会进行渲染，其表现就和`display: none;`一样。**
这时，在容器上声明`justify-content`属性就可以安排伸缩项的位置了：
```css
.content {
  justify-content: flex-start | flex-end | center | space-between | space-around;
}
```
![](/img/justify-content.png)

**align-items**
这项属性会改变次轴上元素排列的方式，对于本例来说原来次轴方向上元素的高度是表现为`height: 100%;`的，设定了`align-items`属性后，其高度表现就会发生改变了。
```css
.content {
  align-items: flex-start | flex-end | center | baseline | stretch;
}
```
说到这里了，伸缩项具体的表现其实可以想象出来了，想象不出来的就自己动手试一试吧~

**order**
在伸缩项上声明此属性，可以无视HTML结构的顺序而按照`order`从小到大的顺序沿`flex-direction`方向排列。比如：
```css
.item-1 {
  order: 3;
  ...
}
.item-2 {
  order: 1;
  ...
}
.item-3 {
  order: 2;
  ...
}
```
![](/img/order.jpg)

**flex-wrap**
此属性的默认值为`nowrap`，也就是忽略伸缩项的宽度，管你要多少住房面积，通通按照`flex`属性说好的分配，不许换行。
```css
.container {
  flex-wrap: nowrap | wrap | wrap-reverse
}

.item {
  width: 150px;
}
```
![](/img/flex-wrap.jpg)

**flex-grow，flex-shrink和flex-basis**
上文提到的`flex`属性实际上是这三个属性的简写形式。这三个属性有相似性，都是表示项与项之间分配空间的相对比例关系，不同之处在于：
+ `flex-grow`属性：属性值为该伸缩项所占空间相对于其他伸缩项（声明了`flex`相关属性的项）的比值。
+ `flex-shrink`属性：该伸缩项相对于其他伸缩项缩小的比值，也就是说当`flex-shrink: 3;`时，该项所占空间为其他项的1/3。
+ `flex-basis`属性：属性值为该项所占空间占容器空间的百分比。

**注意：**对于`flex-basis`属性，当所有项的属性值相加<=100%时，会严格按照百分比值来渲染。当属性值相加>100%时，元素并不会溢出，而是表现为两两之间所占空间大小遵循相互的百分比比值。也就是说当存在三个伸缩项且`flex-basis`值都为`50%`时，表现行为与三个项均为`flex: 1;`一样。

**Flexible Boxes**布局模式在响应式开发中尤其好用，对不同的终端，设置元素之间的空间分配关系将会变成一件非常简单的事。伸缩盒布局和响应式布局中流行的流体布局哪种更好，还是可以结合起来，就看各位开发者发挥自己的聪明才智了！

## 参考文献
1. http://www.w3.org/TR/2014/WD-css-flexbox-1-20140325/
2. https://developer.mozilla.org/en-US/docs/Web/CSS/flex
3. http://www.zhangxinxu.com/wordpress/?p=1338