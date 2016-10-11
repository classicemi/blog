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