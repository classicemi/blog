# 了解 Progressive Web Apps
Web 技术发展到今天，经过了不少曲折，各种标准规范一直在改，前后端的开发方式也发生了翻天覆地的变化，之所以有这些改变目的都是为了更好的体验。这个体验分两个方面，一个是从开发者的角度，降低复杂度，提高兼容性，使得开发成本降低；另一方面自然是对于用户，希望 web 产品的用户体验不断提高。

对于后者来说，web 产品的进化到今天，似乎可以看出一个趋势，那就是 web 应用的运行环境在朝着多样化发展。从一开始仅限于桌面端浏览器简单的网页展示，到 ajax 技术大大推动 web 产品从展示型向应用化进化，再到今天移动互联网及各种智能设备的普及，web 应用可以运行在不同的设备上。但是顾名思义，web 应用最大的局限性在于它依赖网络环境的支持，现在大部分的 web app 是以单页应用的形式与后端通过接口进行数据通信，一旦没有网络，应用本身也不能正常运行了。另外，web app 相比于原生应用，也依赖浏览器环境的支持，打开任何应用总是要通过一串 URL 也是挺不好的体验。

## Hybrid Apps
为了解决这些问题，人们做了很多尝试，Hybrid Apps 是其中效果比较好，也有很多开发者实际在使用的一种产品开发模式。看它的名字就能知道，这是一种将原生应用开发和 Web App 开发相结合的方式，通过在 web 页面中模拟原声应用的视觉效果，并运行在原生应用的外壳中来变相达到以开发 web 应用的方式开发原生应用的效果。

但这种开发方式也是有缺点的，因为本质上应用还是运行在浏览器中，不可避免会出现兼容性问题，页面性能问题（相比原生应用来说），同时开发复杂度也会比较高。

## Progressive Web Apps
为了解决这个问题，2015 年，一位名叫 Frances Berriman 的设计师和来自 Google Chrome 团队的 Alex Russell 共同提出了“Progressive Web Apps”的概念，通过利用现代浏览器所支持的一些新功能，使得 web 应用在它们所处的操作系统中成为最主要的应用程序，取代传统原生应用的地位。

刚看到这样的设想时，我是怀疑的，毕竟 web 应用的发展问题一直被讨论，这个时候提出这么激进的想法，真的有足够的技术支持吗？

我们先来看一下在 PWA 的中包含的主要概念：
+ **Progressive** - 本意为渐进，在这里表示 web 应用在任何平台任何浏览器上都可以正常运行，功能遵循渐近增强的原则。
+ **响应式** - 适配不同的设备，如桌面端、平板电脑、手机等。
+ **无需网络连接** - Service Worker 能让应用在没有或弱网络的情况下也能运行。
+ **接近原生应用** - 提供与原生应用相似的交互方式。
+ **始终最新** - 保持版本始终最新，和原生应用需要手动更新不同。
+ **安全性** - 强制通过 HTTPS 进行通信
+ **可被识别** - 可以被识别为原生的应用，同时通过设置 manifest，也可以进行 SEO 优化，使得搜索引擎可以找到你的 APP。
+ **用户提醒** - 用户在没有打开应用的时候可以收到推送的提醒。
+ **可安装** - 用户通过保存书签至桌面的方式即可“安装”应用，而不需要在 App Store 里安装。
+ **可链接** - 通过分享 URL 的形式就能传播应用，而不需要复杂的安装流程。

> 具体的代码教程可以自行在 Google 对 PWA 进行介绍的[官网](https://developers.google.com/web/)上阅读，本文着重介绍 PWA 概念中的各个技术点以及一些思考。

确实看上去很美，实现这些功能所要用到的一些技术点也并不是很复杂，我个人认为其中最重要的环节是 Service Worker 这个东西，它是使得 PWA 能区别于传统 web 应用的主要原因。

### Service Worker
Service Worker 是浏览器在后台运行的一段脚本，和在页面中运行的脚本是不一样的，它的存在，使我们不需要页面或者用户的操作就能在不被察觉的地方做很多以前做不到的事情。它作为一种 JavaScript Worker，并不能直接操作页面中的 DOM，而是通过 `postMessage` 接口和页面进行通行，由页面的脚本决定如何操作 DOM。这让我想起了 Vue 2.0 中对组件通信方式的修改，子组件只能通过 emit 事件的方式通知父组件，由父组件自己修改自己的状态，扯远了。

它作为一个在后台运行的脚本程序，和主页面的生命周期是完全不同的，一般来说，在一个 web 应用启动的时候，需要你先注册 service worker，但 service worker 不是所有浏览器都支持的，所以你可能需要这么做：
```JavaScript
if ('serviceWorker' in navigator) {
  // register the service worker
}
```
注册完成之后，会进入 service worker 生命周期中的 install 阶段，如果要使应用能够支持离线运行，一般要在这个阶段对应用必需的资源进行缓存，如果需要缓存的资源体积较大的话，从性能的角度来看 [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) 是一个比较好的选择。Service worker 的生命周期控制写起来是很直观的，直接在 `self` 对象上添加事件监听就行了：
```JavaScript
self.addEventListener('install', function(e) {
  // do some caching stuff
});
```
Install 阶段结束以后会紧接着进入 activate 阶段，在这个阶段中一般会进行一些旧缓存的清理工作等，为后面页面的正常工作做好准备，这个阶段结束之后 service worker 就会接管页面了。要注意的一点是，**最初注册 service worker 的页面这个时候并不会被控制，只有在它再次被重新加载的时候才会被 service worker 控制**。之后，service worker 的状态切换有两种可能，一种是被终止，之后的操作不需要它发挥作用，终止掉以释放空间；另一种则是活动状态，可能会监听页面的请求事件，或是向主进程 postMessage 等，这根据不同的业务需求有所不同。用一张图可以很直观的表现出这个过程：
![sw-lifecycle](https://raw.githubusercontent.com/classicemi/blog/master/images/pwa/sw-lifecycle.png)

下面一段代码比较完整的展示了应用中启用 service worker 应该怎么写：
```JavaScript
// app.js
// register a service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(registration => {
    console.log('[Service Worker]registration is successful with scope: ', registration.scope);
  }).catch(err => {
    console.error('[Service Worker]registration failed: ', err);
  });
}

// sw.js
const urlsToCache = [
  '/',
  '/script/main.js'
];

// add resources to caches
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('cache-v1')
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});
// cache refresh rules
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all
    });
  );
});
```




lighthouse
firebase
Flipkart 转化率提高 70%，AliExpress 提升 104%
