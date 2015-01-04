## 序言
JavsScript是当下最流行的编程语言。由于现在的浏览器在不需要安装任何插件的情况下就能完全理解JavaScript，因此它也被认为是一门“互联网语言”。JavaScript的发展非常迅速，以至于它已经不仅仅是一门前端语言，而是在服务器端（Node.js）和数据库（MongoDB）方面都得到了应用。

对于任何职业技术人员来说，理解数据结构的知识都是非常重要的。作为一名开发者，意味着你能够借助编程语言和数据结构的帮助去解决问题。它们在我们解决问题的过程中扮演了非常重要的角色。而错误的数据结构也会影响我们所写程序的性能。因此，了解不同的数据结构和它们的正确应用方式是十分重要的。

算法在计算机科学中也有着举足轻重的地位。解决同一个问题有许多方法，一些方法就比另一些更好。这也是为什么学习一些最著名的算法同样非常重要的原因。

快乐编程！

### 本书的内容
*第一章，JavaScript——简要概述*， 涵盖了在学习数据结构和算法之前你需要了解的JavaScript语言基础。它同时也包括了搭建本书所需开发环境的方法。

*第二章，数组*，解释了如何使用最基础，最被广泛使用的数据结构，数组。本章介绍了如何声明，初始化数组；添加、删除数组元素的方法以及如何使用 JavaScript 原生数组方法。

*第三章，堆栈*，介绍堆栈数据结构，描述了如何创建一个堆栈并添加和删除元素。本章同样介绍了如何使用堆栈去解决一些计算机科学方面的问题。

*第四章，队列*，介绍了队列数据结构，描述了如何创建一个队列并添加和删除元素。本章同样介绍了如何使用队列去解决一些计算机科学方面的问题以及队列和堆栈之间主要的不同点。

*第五章，链表*，解释了如何从头使用对象和指针的概念创建一个链表数据结构，介绍了声明、创建链表以及添加、删除元素的方法。本章同样介绍了不同类型的链表，包括双向链表和循环链表。

*第六章，集合*，介绍了集合数据结构以及如何用它来储存不重复的元素。本章同样介绍了不同的集合运算符以及如何实现和使用它们。

*第七章，字典和哈希表*，解释了字典和哈希表数据结构以及它们之间的不同点。本章包含如何声明、创建和使用两种数据结构以及解决哈希表中的冲突和创建更好的哈希函数的方法。

*第八章，树*，介绍了树数据结构以及它的术语，主要介绍二叉查找树以及树用来查找、遍历、添加和删除节点的方法。本章同样介绍了如何进一步深入学习树的方法，包括应该学习的与树相关的算法。

*第九章，图*，介绍了图数据结构的奇妙世界和它在现实问题上的应用。本章介绍了与图相关的最常用的术语、表示图的不同的方式、如何使用广度优先查找和深度优先查找来遍历图以及它的应用。

*第十章，排序和查找算法*，探索了最常用的排序算法，例如冒泡排序法（以及它的优化版本）、选择排序法、插入排序法、归并排序法和快速排序法。本章也介绍了一些查找算法，包括顺序检索和二分查找法。

*第十一章，更多算法*，介绍了一些算法技巧和著名的大 O 记号，包含了递归概念的介绍和一些高级算法技巧，例如动态规划和贪婪算法。本章介绍了大 O 记号和它的概念。最后，本章介绍了如何进一步提升你的算法知识。这是一个在 Packt 出版社网站上的在线章节。你可以从 [https://www.packtpub.com/sites/ default/files/downloads/4874OS_Chapter11_More_About_Algorithms.pdf](https://www.packtpub.com/sites/ default/files/downloads/4874OS_Chapter11_More_About_Algorithms.pdf) 下载。

*附录，大 O 记号速查表*，列出了本书所用算法的复杂度（使用大 O 记号形式）。本章同样为在线章节，你可以从 [https://www.packtpub.com/sites/default/files/ downloads/4874OS_Appendix_Big_O_Cheat_Sheet.pdf](https://www.packtpub.com/sites/default/files/ downloads/4874OS_Appendix_Big_O_Cheat_Sheet.pdf) 下载。

## 第一章 JavaScript——简要概述
JavaScript 是一门非常强大的语言。它是世界上最流行的编程语言，也是杰出的互联网编程语言之一。举例来说，GitHub（世界最大的代码托管平台，可通过 [https://github.com](https://github.com) 访问）上托管了超过400,000 个 JavaScript 仓库（使用 JavaScript 的项目是最多的，参考 [http://goo.gl/ZFx6mg](http://goo.gl/ZFx6mg)）。GitHub 上使用 JavaScript 的项目数量每年都在增长。

JavaScript 并不是一门只能用在前端的编程语言，借助 Node.js，JavaScript 也可以运行在后端。Node 包模块（[https://www.npmjs.org/](https://www.npmjs.org/)）的数量也在以指数形式增长。

如果你想要成为一名 Web 开发者的话，JavaScript 将是你的必备技能。

在这本书中，我们将会学习使用率最高的数据结构和算法。但是为什么我们要用 JavaScript 来学习数据结构和算法呢？其实我们已经回答了这个问题。JavaScript 非常流行，同时由于 JavaScript 是一种函数式语言，被用来学习数据结构也很合适。另一方面，使用 JavaScript 来学习数据结构也和使用标准的编程语言，例如 C 语言或 Java，有很大不同（也更加简单），这种学习新东西的方式是很有趣的。而且又是谁规定数据结构和算法只是为 C 或 Java 这样的标准编程语言准备的呢？在做前端开发的过程中，你也许也需要实现这些语言特性的一部分。

学习数据结构和算法非常重要。首要原因就是数据结构和算法可以高效地解决最常见的问题。这会大大改善你将来所写代码的质量（包括性能——如果你选择了错误的数据结构或依赖特定情境的算法，代码的性能将会出现问题）。其次，在大学中，计算机科学的开篇课程就包括算法。最后，如果你想在最优秀的 IT（信息技术）企业（例如 Google，Amazon，Ebay 等）工作的话，数据结构和算法也会是面试的内容。

### 搭建开发环境
和其他语言相比，JavaScript 的优势之一就是在使用它之前，你不需要安装和配置复杂的环境。每台电脑都已经有了符合要求的环境，即使它的用户没有任何的开发经验。一个浏览器就足够了！

如果要执行本书上的示例代码，我推荐你安装 Google Chrome 或 Firefox 浏览器（你可以使用你最喜欢的一个），你喜欢的编辑器（例如 Sublime Text），和一个 web 服务器（XAMPP 或任何你喜欢的服务器，这一步是可选的）。Chrome，Firefox，Sublime Text 和 XAMPP 都适用于 Windows，Linux 和 Mac OS 操作系统。

如果你使用 Firefox，推荐你安装 Firebug 插件（[https://getfirebug.com/](https://getfirebug.com/)）。

我们下面将会介绍三种搭建环境的方式供你选择。

#### 有浏览器就够了
你可以使用的最简单的环境就是浏览器。

你可以使用 Firefox + Firebug。Firebug 安装好后你将会在浏览器的右上角看到如下图标：

打开 Firebug 后（点击它的图标即可），你将会看到 Console 标签页，在这个命令行区域中，你可以输入 JavaScript 代码，如下图所示（你需要点击 Run 按钮来执行代码）：

你也可以扩展命令行，使它填满整个 Firebug 插件的界面。

你也可以使用 Google Chrome。Chrome 自带了 Google Developer Tools。你可以先打开设置菜单，再定位到 Tools | Developer Tools 子菜单来打开它，如下图所示：

然后，在 Console 标签中，你可以运行你的 JavaScript 代码来进行测试，如下：

#### 使用 web 服务器（XAMPP）
第二种你可能想在你的电脑上安装的环境也很简单，但是比直接使用浏览器要复杂一些。

你将会需要安装 XAMPP（https://www.apachefriends.org）或任何你喜欢的 web 服务器。然后，在 XAMPP 的安装目录中，你可以找到 htdocs 目录。你可以在里面创建一个新的文件夹并且在里面运行本书中所使用的代码，或者你也可以下载本书的源代码并将它们放在 htdocs 目录中，如下图所示：

然后，你可以在浏览器中通过本地服务器的 URL 来访问代码（需要先启动 XAMPP 服务器），如下图所示（不要忘了启动 Firebug 或 Google Developer Tools 来获得输出结果）：

#### 使用完全的 JavaScript 环境（Node.js）
第三个选择是使用一个纯 JavaScript 环境！不同于使用 XAMPP 这样一个 Apache 服务器，我们可以使用一个 JavaScript 服务器。

要实现这一目标，我们需要先安装 Node.js。打开 [http://nodejs.org/](http://nodejs.org/) 并下载和安装 Node.js。然后，打开终端（如果你使用的是 Windows，打开包含 Node.js 的命令提示符）并运行如下命令：
```
npm install http-server -g
```
请确保你输入了命令而不是将其复制并粘贴。复制这条命令可能会产生一些错误。

你也可以以管理员身份执行这条命令。在 Linux 和 Mac OS 操作系统中，执行如下命令：
```
sudo npm install http-server -g
```
这条命令将会安装`http-server`，它是一个 JavaScript 服务器。改变所在目录并定位到本书源代码所在目录，输入`http-server`，就可以在终端启动一个服务器并执行示例代码，如下面截图所示：

如要执行示例代码，请打开浏览器并通过`http-server`命令指定的端口连接到`localhost`：

### JavaScript 基础
在学习各种各样的数据结构和算法之前，先让我们简要概述一下 JavaScript 语言。本节主要介绍后续章节实现的算法所需的 JavaScript 语言基础。

在开始之前，先让我们来看一下在 HTML 页面中使用 JavaScript 的两种方式：
``` html
<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
    </head>
    <body>
        <script>
            alert('Hello, World!');
        </script>
    </body>
</html>
```
第一种方式如上述代码所示。我们需要创建一个 HTML 文件并在其中书写代码。在本示例中，我们在 HTML 文件中声明了一个`script`标签，在这个`script`标签中，有我们的 JavaScript 代码。

第二种方式，我们需要创建一个 JavaScript 文件（我们可以将其保存为`01-HelloWorld.js`），在这个文件中，我们可以写入如下代码：
``` javascript
alert('Hello, World!');
```
然后，我们的 HTML 文件看起来就像这样：
``` html
<!DOCTYPE html>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body>
    <script src="01-HellowWorld.js">
    </script>
</body>
</html>
```
第二个示例演示了如何在一个 HTML 文件中引入一个 JavaScript 文件。

执行这两个示例中的任何一个，我们都会得到相同的输出结果。但是，第二种方式是最好的。

> 你可能会在网上看到使用 JavaScript `include` 语句或是在`head`标签中插入 JavaScript 代码的方式。但最好的实现方式是将所有的 JavaScript 代码都在`body`标签的最后插入。使用这种方式，浏览器在加载脚本之前就会解析 HTML。这样能够提高页面的性能。

#### 变量
变量用来存储数据，它们可以在任何时候被设置，更新和检索。被赋给一个变量的值有自己的类型。在 JavaScript 中，可用的数据类型有数字、字符串、布尔值、函数和对象类型。除此之外，还有`undefined`、`null`、数组，日期和正则表达式类型。下面是如何在 JavaScript 中使用变量的示例：
``` javascript
var num = 1; //{1}
num = 3; //{2}

var price = 1.5; //{3}
var name = 'Packt'; //{4}
var trueValue = true; //{5}
var nullVar = null; //{6}
var und; //{7}
```
第一行给出了如何在 JavaScript 中声明一个变量的示例（我们声明了一个数字变量）。尽管声明变量时使用`var`关键字并不是必须的，但在声明一个新变量时总是使用`var`是一个好习惯。

第二行中，我们给已存在的变量赋予了新的值。JavaScript 不是一种强类型语言。也就是说你可以声明一个变量并初始化为一个数字，然后再将它重新赋值为一个字符串或任何数据类型。但将一个变量重新赋一个数据类型和它的初始数据类型不同的值也不是一个好习惯。

第三行中，我们又声明了一个数字，但是这次声明的是一个十进制浮点数。在第四行，我们声明了一个字符串；第五行，我们声明了一个布尔值；第六行，我们声明了一个`null`值；第七行，我们声明了一个`undefined`值。`null`代表没有值存在，而`undefined`代表一个变量已经被声明，但是还没有被赋予任何值：
``` javascript
console.log("num: "+ num);
console.log("name: "+ name);
console.log("trueValue: "+ trueValue);
console.log("price: "+ price);
console.log("nullVar: "+ nullVar);
console.log("und: "+ und);
```
以上代码说明我们可以使用`console.log`来输出我们声明的每个变量的值。

> 在本书的示例中，有三种可以输出 JavaScript 中的值的方法。第一种是使用`alert('My text here')`语句，它会在浏览器的弹出对话框中显示输出的结果；第二种方式是使用`console.log('My text here')`，它会在调试工具的Console标签页显示输出结果（Google Developer Tools 或者 Firebug，根据你使用的浏览器而定）。最后，第三种方法是使用`document.write('My text here')`，将输出直接显示在 HTML 页面上。你可以使用你最习惯的方式。
