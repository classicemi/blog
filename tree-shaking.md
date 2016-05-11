# tree-shaking

Rich Harris 是美国某新闻网站的专栏作家，同时也是一位开源项目爱好者，他最出名的作品之一叫做 **[rollup](https://github.com/rollup/rollup)**，是一个 ES6 模块加载打包工具。使用它可以以 ES6 的模块语法进行模块化的 JS 开发。

当然，使用 Webpack 并配合相应的 loader 也可以使用 ES6 的模块语法来构建应用。但是，rollup 的独到之处在于它实现了一个过去只在静态语言编译中有的特性—— tree-shaking。简单解释为源码中定义了，甚至 export 了的方法，只要没有使用，就不会出现在打包后的代码中。

例如在 `helpers.js` 中定义了两个方法，并且都 export 了：

```javascript
export function foo() {
  return 'foo';
}

export function bar() {
  return 'bar';
}
```

在 `input.js` 中将两个方法都 import 了，但是只使用了一个：

```javascript
import {foo} from './helpers';
import {bar} from './helpers';

console.log(foo);
```

按照一贯对模块加载器的印象，两个方法的定义至少都应该出现在最终的生成文件中，但实际上，生成的 `output.js` 代码中并没有出现未使用的 `bar` 方法：

```javascript
function foo() {
  return 'foo';
}

console.log(foo);
```

这说明 rollup 在代码打包的时候并不是简单的对 export 和 import 进行解析并编译，而是对实际的代码进行了静态分析，这在静态语言编译器的实现中很普通，但在 JS 模块加载器中应用类似的思想我是第一次看到。

在 [Dr. Axel Rauschmayer](http://rauschma.de/) 的[一篇博客](http://www.2ality.com/2015/12/webpack-tree-shaking.html)中，也提到了 Webpack 2 配合 Babel 可以实现类似的 tree-shaking，具体的内容省略，大意就是如果使用和上文一样的代码的话，输出的 `output.js` 大概像这样：

```javascript
function(module, exports, __webpack_require__) {
    
  /* harmony export */ exports["foo"] = foo;
  /* unused harmony export bar */;

  function foo() {
    return 'foo';
  }
  function bar() {
    return 'bar';
  }
}
```

可以看到，未使用的 `bar` 方法的声明还是出现在了结果中，如果要将其去掉，只有在压缩过后：

```javascript
function (t, n, r) {
  function e() {
    return "foo"
  }

  n.foo = e
}
```

所以我认为这只是一种不完全的 tree-shaking。

有趣的是，在作者写完这篇博客之后，本着对事物的探究精神，在 Twitter 上 @ 了 rollup 的作者，询问了 'tree-shaking' 这个概念的由来：

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/Rich_Harris">@Rich_Harris</a> Do you know where the term “tree-shaking” comes from? Haven’t seen it before Rollup.</p>&mdash; Axel Rauschmayer (@rauschma) <a href="https://twitter.com/rauschma/status/678835068165595136">December 21, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

于是就有人回复了，有的说这其实就是*无用代码删除（Dead Code Elimination）*，又有的说 tree-shaking 这个名字很傻 x，这给人的感觉是用了转译器（Transpiler）而不是编译器（Compiler）。（关于这两个概念的区别可以参考这篇[文章](https://www.stevefenton.co.uk/2012/11/compiling-vs-transpiling/)）

于是 Rich Harris 觉得有必要向地球人科普一下自己的实现了，于是两天后也诞生了一篇[博客](https://medium.com/@Rich_Harris/tree-shaking-versus-dead-code-elimination-d3765df85c80#.p4izirx8z)。在文章中他认为无用代码移除是傻 x 的，它就好像在一个已经转译完成后的代码中把无用的部分剔除，比如 Webpack 2 的实现。但是更好的做法是无用的代码从一开始就不应该在结果中出现，而不是出现了之后再在第二步中剔除。

同时，Harris 也指出现在 rollup 实现的 tree-shaking 还不成熟，它还是停留在函数声明的层面，删除了未被使用的函数，而非所有未被使用的代码。另外，它也不能删除对象上未被使用的方法，函数若是作为对象的方法被使用，仍然会被打包进最后的结果中。

最后 Harris 也不忘黑了一把 Webpack，Webpack 的思路是在中间过程中生成一个 AST，再由 AST 生成最终的代码，这在 Webpack 生成结果中也很容易能看出来，它借助本身的一个模块管理工具对源代码进行了重组，命名也是简单粗暴的1，2，3......而 rollup 没有用这种思路，在最大程度上保存了原始代码，更接近人类书写代码的风格。

个人感觉 rollup 的实现会更困难一些，待我学习一波 rollup 的源码再说。