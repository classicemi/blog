在阅读 [Build Your Own Angular.js] 的过程中，遇到的第一个难点是理解与异步执行相关的一些方法的实现，所以在这里把自己的思考过程记录下来便于理解。



### `$eval`

作用是在 scope 上下文中执行一段代码，传入一个函数作为参数并立即执行这个函数，传入 scope 作为函数的一个参数。传入的函数也可以接收第二个自定义的参数。

```javascript
Scope.prototype.$eval = function(expr, locals) {
  return expr(this, locals);
};
```

`$eval` 方法将会是 `$apply` 方法的组成部分。



### `$apply`

简单来说 `$apply` 方法的作用是执行传入的函数参数并触发一个 `$digest`。为了保证 `$digest` 在函数执行之后触发，并且不受可能抛出错误的影响，这里使用 try-finally 语句。

```javascript
Scope.prototype.$apply = function(expr) {
  try {
    return this.$eval(expr);
  } finally {
    this.$digest();
  }
};
```



### `$evalAsync`

延迟执行一段代码，在 JS 中可以使用 `setTimeout` 这个方法，在 Angular 中，除了使用 `$timeout` 这个 service 之外，还可以使用 `$evalAsync` 方法。它的作用是**在当前的 `$digest` 过程中**延迟执行一段代码，比如在一个 listner 函数中延迟执行一些逻辑，但这个延迟仍然处于当前的 `$digest` 过程中。

使用 `$evalAsync` 方法和使用 `$timeout` service 的主要区别在于使用前者可以保证被延迟的代码能够在当前的 `$digest` 周期中被执行，而使用后者的话，会把何时执行延迟代码的决定权交给浏览器，浏览器可能在任何时候去执行，比如在 UI 重绘或发送一个 ajax 请求之后了。

如在一个 listener 函数中使用 `$evalAsync` 方法，延迟的代码应该在 listener 中的非延迟代码执行完毕后立即执行，要实现这个功能需要在 Scope 构造函数中增加一个属性 `$$asyncQueue`。

```javascript
function Scope() {
  ...
  this.$$asyncQueue = [];
  ...
}
```

这个属性用于按顺序保存被延迟的代码块。然后定义 `$evalAsync` 方法。

```javascript
Scope.prototype.$evalAsync = function(expr) {
  this.$$asyncQueue.push({
    scope: this,
    expression: expr
  });
};
```

实际的执行需要修改 `$digest` 方法。

```javascript
Scope.prototype.$digest = function() {
  var ttl = 10;
  var dirty;
  this.$$lastDirtyWatch = null;

  do {
    // +++
    while (this.$$asyncQueue.length) {
      var asyncTask = this.$$asyncQueue.pop();
      asyncTask.scope.$eval(asyncTask.expression);
    }
    // +++
    dirty = this.$$digestOnce();
    if ((dirty && !(ttl--)) {
      throw '10 digest iterations reached';
    }
  } while (dirty);
};
```

实现的原理是一旦 push 了一段代码到 `$$asyncQueue` 中，说明当前的 scope 还是被标记成 dirty 的，那么在下一次的 while 循环中会把队列中的代码块一次执行完毕。

如果在 watch 函数中使用了 `$evalAsync` 方法，一旦没有检测到被 watch 的属性有变化，scope 就不会被标记为 dirty，也就不会触发 while 循环中的执行过程，所以在 while 循环的判断条件中，除了 `dirty` 为 `true` 时要执行 while 循环外，`$$asyncQueue` 不为空的之后也应该执行 while 循环：

```javascript
Scope.prototype.$digest = function() {
  ...
  do {
    ...
  } while (dirty || this.$$asyncQueue.length);
};
```

另外，`$evalAsync` 还有一个功能是如果当前没有 `$digest` 被触发的话，需要去触发一个，但是这个被主动触发的 `$digest` 必须在当前的 `$evalAsync` 方法 push 完代码后才被触发，这时，就可以使用 `setTimeout` 方法了，同时这样就可以保证在使用 `$evalAsync` 之后一定有一个 digest 被触发：

```javascript
Scope.prototype.$evalAsync = function(expr) {
  var self = this;
  if (!self.$$phase && !self.$$asyncQueue.length) {
    setTimeout(function() {
      if (self.$$asyncQueue.length) {
  		self.$digest();
	  }
    }, 0);
  }
  ...
};
```

从代码中可以看出，如果在执行时没有 digest 过程被触发（即 `$$phase` 属性为空）并且 `$$asyncQueue` 队列为空（即之前没有 `$evalAsync`）方法被执行过，那么就用 `setTimeout` 往队列中注册一个 `$digest` 的触发。但实际上 `$evalAsync` 是被设计为在 `$digest` 周期内延迟代码执行的，加入一个 `setTimeout` 主动触发的目的只是为了防止一旦在 `$digest` 周期外执行代码不会有响应而造成用户的困惑。



### `$applyAsync`

对于在 digest 循环之外延迟执行代码的需求，实际上应该使用 `$applyAsync` 方法。这个方法的特别之处在于它不仅会立即执行传入的函数，还会主动去触发一个 digest 过程。换句话说，即使在调用 `$applyAsync` 的时候处于 digest 循环中（如在 listener 函数中执行），被异步执行的函数也会延迟到下个（被主动触发的） digest 循环中再执行。

要实现这个功能，需要再新建一个 scope 对象上的属性：

```javascript
function Scope() {
  ...
  this.$$applyAsyncQueue = [];
  ...
}
```

顾名思义，这个队列用来保存被 `$applyAsync` 延迟执行的函数（通过闭包对引用了 scope 对象本身的 self 变量进行调用，使用 `$eval` 方法执行）。同时，在 `setTimeout` 中调用 `$apply` 方法对 scope 中用来保存被异步执行函数队列的数组进行循环出列并执行。使用 `setTimeout` 的原因是不在当前的 digest 循环过程中执行代码，而强制到当前 digest 循环结束后再手动触发一次。

```javascript
Scope.prototype.$applyAsync = function(expr) {
  var self = this;
  self.$$applyAsyncQueue.push(function() {
    self.$eval(expr);
  });
  setTimeout(function() {
    self.$apply(function() {
      while (self.$$applyAsyncQueue.length) {
  		self.$$applyAsyncQueue.shift()();
      }
    });
  }); 
};
```

这里还有两个问题需要解决：

1. 如果连续执行多次 `$applyAsync` 方法，也就会在 setTimeout 队列中同时 pending 多个手动触发 digest 的操作，而实际上只需要手动触发一次，就可以清空 `$$applyAsyncQueue` 队列中的所有函数。
2. 如果在执行过 `$applyAsync` 后，手动触发 digest 前因为某种原因 digest 被触发（即不是被 setTimeout 队列中的 `$apply` 方法所触发），那么 `setTimeout` 中的手动触发 digest 操作就不需要再被执行了，因为已经有一个 digest 被触发了。

第一个问题，可以通过在 scope 对象中保存一个 `setTimeout` 所返回的 id 来解决，一旦存在这个 id，说明已经有一个 digest 在等待触发，可以不用再执行一个 `setTimeout` 了。

```javascript
function Scope() {
  ...
  this.$$applyAsyncId = null;
  ...
}

Scope.prototype.$applyAsync = function(expr) {
  ...
  if (self.$$applyAsyncId === null) {
    self.$$applyAsyncId = setTimeout(function() {
      ...
      self.$$applyAsyncId = null;
    });
  }
};
```

对于第二个问题，同样可以利用这个 id，可以在 `$digest` 方法中对 id 进行检测，如果 id 存在，说明在有等待触发的 digest 并且 `$applyAsyncQueue` 队列中有函数，因此可以在本次 digest 中直接把清空队列的工作做完，并且取消掉等待执行的 digest 触发操作。在这里，清空 `$applyAsyncQueue` 的操作可能会在两个地方被调用，因此可以将这部分逻辑抽成一个函数：

```javascript
// $$flushApplyAsync
Scope.prototype.$flushApplyAsync = function() {
  while (this.$$applyAsyncQueue.length) {
    this.$$applyAsyncQueue.shift()();
  }
  this.$$applyAsyncId = null;
};

// $applyAsync
Scope.prototype.$applyAsync = function(expr) {
  ...
  self.$apply(_.bind(self.$$flushApplyAsync, self));
  ...
};
```

在 `$digest` 中对 `$$applyAsyncId` 进行判断：

```javascript
Scope.prototype.$digest = function() {
  ...
  if (this.$$applyAsyncId) {
    clearTimeout(this.$$applyAsyncId);
    this.$$flushApplyAsync();
  }
  ...
};
```



### `$postDigest`

最后一个相关的方法是 `$postDigest`，这实际上是一个内部方法。作用是在下一个 digest 结束后执行代码，而且它不会去主动触发 digest，而是等待因其他原因触发 digest 后再去处理它自己的队列。

首先还是在 scope 中增加一个该方法所需的队列数组：

```javascript
function Scope() {
  ...
  this.$$postDigestQueue = [];
  ...
}
```

`$$postDigest` 方法本身只需要向数组中添加函数即可：

```javascript
Scope.prototype.$$postDigest = function(fn) {
  this.$$postDigestQueue.push(fn);
};
```

在 `$digest` 方法中，通过所有的脏检测之后再对该队列进行处理：

```javascript
Scope.prototype.$$postDigest = function() {
  ...
  while (this.$$postDigestQueue.length) {
    this.$$postDigestQueue.shift()();
  }
};
```

