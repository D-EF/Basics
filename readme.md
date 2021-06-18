# 提供一些函数, 全局变量 和 一些类 的js文件
**使用请遵守 apache 2.0 协议, 在拷贝的代码中请注明代码来源**
![DEF](https://gitee.com/darth_ef/def-web/blob/master/img/logo.svg "DEF")
---
# 全局变量
## thisEnvironment   
指向当前运行环境   

---

## Math.DEG
一度角度对应的弧度 = Math.PI/180

---   
##

# 函数
## 让 dom 停止触发事件
在 dom 事件 中运行
* stopPropagation(e)   
    阻止事件冒泡
* stopEvent(e)   
    阻止默认事件发生
* stopPE(e)   
    阻止冒泡和默认事件
---   
## inputSupportsTypeF
## 让控件仅接受数字 inputNumber
* 在 keydown 事件 中运行 inputNumber(e); 可以让控件仅接受数字   
---

## 获取当前运行脚本的地址 getCurrAbsPath
* getCurrAbsPath()
---

## 把 url 相对地址转换成绝对地址 rltToAbs
* 例1:    
  ``` javascript
  rltToAbs("url","http://127.0.0.1/index") 
   // "http://127.0.0.1/url"
  ```
* 例2: 
  ``` javascript
  rltToAbs("../../../img/logo.svg","http://127.0.0.1/index/js/basics/basics.js") 
  // "http://127.0.0.1/img/logo.svg"
  ```
---

## 对比两个列表项是否相同 arrayEqual
* arrayEqual(a1,a2)   
    @param {Array}   a1       要进行比较的数组   
    @param {Array}   a2       要进行比较的数组   
    @return {Boolean}    返回是否相同   
---

## 对比两个列表项是否相同(不区分项的类型和顺序) arrayCmp
* arrayCmp(a1,a2)   
    @param {Array}   a1       要进行比较的数组   
    @param {Array}   a2       要进行比较的数组   
    @return {Boolean}    返回是否相同   
---

## 类继承函数 inheritClass 
将 function 写法的类进行继承
在派生类中不能直接使用 Class.prototype={}   
而是使用 Class.prototype.act=function(){/* do something */}

---
## 对部分字符转码 encodeHTML
如果需要修改，请修改下列静态属性   
* encodeHTML.regex 存放正则表达式   
* encodeHTML.rStrL 存放对应字符   
---
## 模板字符串 templateStringRender
@param {String} _str  字符串   
@param {Object} that this 指针   
@param {Array} argArray 实参   
@param {String} _opKey 插值关键文本 op   
@param {String} _edKey 插值关键文本 ed   
@returns {{str:String,hit:Array\< String \>}}   
* hit 是被认为是

# 类
文件中部分的类有使用上面的函数, 它们不能直接拷贝走就使用; 大量使用 class 语法, 所以不能在 ie 中使用

---
## 贝塞尔曲线 UnitBezier
在 (0,0) 与 (1,1) 之间的三阶贝塞尔曲线

* 构造函数 UnitBezier(p1x,p1y,p2x,p2y)  
    @param {Number} p1x (0,0) 的 控制点 的 x 坐标   
    @param {Number} p1y (0,0) 的 控制点 的 y 坐标   
    @param {Number} p2x (1,1) 的 控制点 的 x 坐标   
    @param {Number} p2y (1,1) 的 控制点 的 y 坐标   

* sampleCurveX(t) , sampleCurveY(t)
    根据时间柄参数得到x坐标
    @param {Number} t 时间柄参数
    @returns {Number} x坐标

---

## 重载函数 OlFunction
没有构造函数, 
* 使用 OlFunction.create(defineFnc)创建一个重载函数   
    @param {Function} defaultFnc 当没有和实参对应的重载时默认执行的函数
  
* 使用 addOverload(parameterType,fnc) 以添加重载
    @param {Array} parameterType   形参的类型
    @param {Function}    fnc 执行的函数
    后加入的会先运行
    
* 使用例 
  ``` javascript
  var fnc=OlFunction.create(function(){console.log("def")});
  fnc.addOverload([String],function(str){console.log(str)});
  fnc.addOverload([String,Number],function(str,nub){for(var i=0,i<nub;++i)console.log(i+':'+str)});
  
  fnc();        // def
  fnc("abc");   // abc
  fnc("abc",3); // 打印三次 abc
  ```
---

# 委托 Delegate
没有构造函数
* 使用 Delegate.create()创建一个委托   
  
* 使用 addAct(tgt,fnc) 以添加委托
    @param {Object} tgt   委托的对象
    @param {Function} fnc 执行的函数
    后加入的会先运行
* 移除一个委托 removeAct(tgt,fnc) 参数和加入的一样才能移除
    @returns {Boolean} 返回是否移除成功
* 使用例 
  ``` javascript
  var delegate=Delegate.create();
  var tgt=new Date();
  var act2=function(){console.log(this.toString())};
  delegate.addAct(tgt,function(){console.log(this.valueOf())});
  delegate.addAct(tgt,act2);

  fnc();        // 先打印 tgt转换出的文本 后打印 tgt 的时间戳
  fnc.removeAct(tgt,act2);
  fnc();        //打印 tgt 的 时间戳

  ```