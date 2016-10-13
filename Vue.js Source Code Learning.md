## [a5e27b1] naive implementation
这是第一个实现了最最基本功能的 commit，项目构建使用的是 grunt。
逻辑集中于 main.js 文件中，此时的构造函数名为 Seed，使用的实例方法为：
``` javascript
var Seed = require('seed')
var app = Seed.create({
    id: 'test',
    // template
    scope: {
        msg: 'hello',
        hello: 'WHWHWHW',
        changeMessage: function () {
            app.scope.msg = 'hola'
        }
    }
})
```
`Seed.create()` 方法返回一个 Seed 实例。构建函数的主要逻辑为：
构建函数内部，保存根 DOM 节点为 `this.el`。
通过拼接一个选择器字符串选出根节点内部所有包含内置 directive 的 DOM 节点，保存于 `els` 变量中。
遍历 `els` 数组，在每个节点上调用 `processNode` 方法。该方法中，首先对每个节点上的 attributes 进行处理，得到一个记录了 key 和 name 的对象：
``` javascript
{
    name: "sd-text",
    value: "msg | capitalize"
}
```
再将这个对象传入 `parseDirective` 函数，对于非内置 directive 的 attr，返回 undefined，对于内置 directive 的 attr，返回一个对象 directive，对象结构如下：
``` javascript
{
  attr: {
    name: "sd-text",
    value: "msg | capitalize"
  },
  key: "something", // 和当前 directive 关联的表达式
  filters: [保存 filter 名的数组],
  definition: directives.js 中的指令定义,
  argument: 保存写在指令名中的参数,
  update: typeof def === 'function'
            ? def
            : def.update
}
```
下一步是将这个对象传入 bindDirective 函数，将对象中的 key，也就是表达式作为键名保存在名为 bindings 的变量中，在 bindDirective 函数中做了这几件事情：

+ 将该 attr 从 DOM 节点上移除
+ 在 bindings 对象中新建 key 键名，对应的值为：`{ value: undefined, directives: [] }`
+ 在传入的 directive 对象上新增 el 属性，保存当前 DOM 节点 el
+ 将这个 directive 对象 push 入 `bindings[key].directives`
+ 随后有一个 `directive.bind` 属性的检测，但我没有找到哪里会对这个属性赋值，所以不会进入 if 分支
+ 最后检查 seed 实例的 scope 属性，如果没有 key 属性的话，执行 `bindAccessors(seed, key, binding)`

在 `bindAccessors` 函数中，通过 `Object.defineProperty` 方法对 seed.scope 上的 key 属性进行设置，同时这个函数会形成一个闭包，保存传入的 bindings[key] 对象的引用，seed.scope[key] 的 get 操作返回 bindings[key] 的 value 值。set 操作稍复杂一些，首先对 bindings[key].value 进行正常赋值，然后遍历 bindings[key].directives 数组中保存的所有 directive，触发和当前 key 相关的所有 directive 进行更新，这点和 ng 的脏检测有相似之处，不同处在于这里的 digest 是通过属性的 set 操作自动进行的。

在触发 directive 的过程中，先检测并执行和 directive 相关的 filter，然后触发 directive.update 方法，这个 update 方法由各指令自行定义。

然后再执行一次 `processNode(root)` 来最后对根节点做一次处理，原因是根结点上也有可能有一些内置 directive。

接下来将传入构造函数的 `opts.scope` 中的各个属性赋值到 `self.scope[key]` 上，以此触发这些属性的 setter。

基本运行方式就是将所有出现在内置 directive 中的表达式（这里实际上只有简单的变量名）作为键名保存在 bindings 中，对应的值中保存了表达式的 value 和与此表达式相关的 directive 序列。在 seed.scope 中保存了实际定义过的 key，并设置了每个 key 的 setter，在 setter 中触发 directive 序列的执行。

## [3eb7f6f] filter value should not be written

将 bindings 变量保存为 `self._bindings` 。便于原型方法访问。

更新属性 setter 逻辑，新声明一个 filteredValue 变量来保存 value 的值，filter 只会改写这个变量的值，猜测是传入的 value 有可能是引用类型变量，这样写不会改变原来的 value 值。

添加两个原型方法 `Seed.prototype.dump()` 和 `Seed.prototype.destroy()`，dump 方法返回一个对象，对象中是 `this._bindings` 中 key 和每个 key 对应的 value。

destroy 方法的作用是销毁当前 seed 实例对应的根结点，在销毁前触发了每个 directive 的 unbind 方法，实际上只有 on 指令有这个方法，用来解除事件绑定，释放内存。

增加了一个 repeat 指令，但内容是空的。

更新一些页面功能测试。

## [ec39439] dump, destroy, fix filters

增加 uppercase filter

filteredValue 赋值用三目运算符优化

## [cf1732b] refactor

增加了一个 directive.js 文件，新增 Directive 类。

去掉构造函数内部 bindings 变量。去掉 `processNode` 函数，增加原型方法 `compileNode`。在该方法内部，和原来的 `processNode` 函数一样，包装了一个 directive 对象，将记录了 attr 的 name 和 value 的对象传入 Directive.parse 方法。

在 parse 方法中，判断出 attr 的 name 匹配到内置 directive 并且 attr 的有效值（| 符号前面部分）不为空的话，则构造出一个 Directive 类的实例并返回。这保证每个 directive 实例的结构都是一样的。

directive 实例结构如下：

``` javascript
{
  _update: function() {}, //directives.js 中的定义，如果定义是对象则这里是对象中的 update 属性
  attr: { name: "sd-text", value: "msg" }, // 被cloneAttributes处理过的指令
  arg: "red", //指令名中带的参数，没有就是null
  key: "msg", //指令中的表达式
  filters: [{
    apply: function(value) {}, //Filter 中过滤器的定义
    args: [] //参数数组
  }]
}
```

随后将 directive 实例传入 `self.bind()` 原型方法，该方法职责是创建表达式到对应指令的绑定，逻辑和之前差不多，拆分出一个 `createBinding()` 方法封装创建绑定的逻辑。

在 directives.js 中，所有指令都会在 directive 实例上调用，实例上有 el 属性，因此 `el => this.el`。

on 指令对事件绑定的逻辑在 directive.js 文件中 on 指令的 update 属性对应的函数中。on 指令生成的 directive 实例会在执行 `update()` 方法时向实例写入 handlers 属性，该属性保存事件名和对应 handler 函数的键值对。

新增 delegate 这个 filter，配合 on 指令，可进行事件委派操作。这里事件委派的逻辑是在创建绑定的时候就通过 delegate filter 获取符合选择器参数的节点，再分别绑定事件，达到的效果是一样的。

## [154861f] augmentArray seems to work

directives.js 中增加了 each 指令，和一个 `augmentArray` 工具方法，但没有实现完整的功能。

## [79760c0] WIP

这个 commit 的 dev.html 都跑不起来，囧

将 Seed 类独立成文件，Seed 类逻辑没有什么变化。

增加 config.js 文件，prefix 配置在里面。

Directive 构造函数中运行 filter 的部分，写入 this.filter 数组的 filter 对象增加 name 属性，未知 filter 可报错。

main.js 的 export 有些变化，暴露 `seed` 方法用于保存 id 和 opts 的对应关系，`plant` 方法用于遍历并 bootstrap 各个组件。

增加 watchArray.js，重写了数组的各种原型方法，为监听数组数据做准备。

增加 each 指令，对传入 each 指令的 collection 数组增加各种数组原型方法，不再使用继承的方法，闭包访问传入的 callback，`watchArray` 方法向 callback 传入 mutation：

``` javascript
{
  event: method,
  args: slice.call(arguments), // 传给 callback 的参数
  array: arr // collection
}
```

## [5ce3b82] refactor

重构。

Seed 构造函数上加属性 config，将配置保存在里面，构建一个 `config.selector` 属性保存所有匹配内置指令的选择器字符串。

可通过 `Seed.filter()` 和 `Seed.directive()` 新增 filter 和 directive。

Seed 类新增一个 extend 静态方法，

