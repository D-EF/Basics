<!--
 * @LastEditTime: 2021-06-27 02:46:04
 * @LastEditors: Darth_Eternalfaith
-->
# 提供一些函数, 全局变量 和 一些类 的js文件
**使用请遵守 apache 2.0 协议, 在拷贝的代码中请注明代码来源**
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
``` javascript
arrayEqual(a1,a2)   
```
    @param {Array}   a1       要进行比较的数组   
    @param {Array}   a2       要进行比较的数组   
    @return {Boolean}    返回是否相同   
---

## 对比两个列表项是否相同(不区分项的类型和顺序) arrayCmp
``` javascript
arrayCmp(a1,a2)   
```
    @param {Array}   a1       要进行比较的数组   
    @param {Array}   a2       要进行比较的数组   
    @return {Boolean}    返回是否相同   
---

## 类继承函数 inheritClass 
``` javascript
inheritClass(_basics,_derived)
``` 
将 function 写法的类进行继承
在派生类中不能直接使用 Class.prototype={}   
而是使用 Class.prototype.act=function(){/* do something */}

---
## 对部分字符转码 encodeHTML
``` javascript
encodeHTML(str)
```
为了防止服务器出错对部分字符进行编码   
@param {String} str <>"'{}[] to &#ascii;   
@returns {String} 转换后的字符串   
    
如果需要修改，请修改下列静态属性   
* encodeHTML.regex 存放正则表达式   
* encodeHTML.rStrL 存放对应字符   
---
## 模板字符串 templateStringRender
``` javascript
templateStringRender(str,that,argArray,opKey="${",edKey="}",opKeyMask='\\',edKeyMask='\\')
```
@param {String} _str  字符串   
@param {Object} that this 指针   
@param {Array} argArray 实参   
@param {String} _opKey 插值关键文本 op   
@param {String} _edKey 插值关键文本 ed   
@returns {{str:String,hit:Array\< String \>}}   
* hit 是被认为是

## 将字符串转换成js的类型 strToVar 
将字符串转换成js的类型, 相当于JSON.parse, 如果只是个字符串就是字符串(口胡)
* 参数和 JSON.parse 一样

---
## <span id="addKeyEvent">添加keyNotBook按键事件 addKeyEvent</span>
``` javascript
addKeyEvent(_Element,_keepFlag,_keycode,_event,_type)   
``` 
    @param {Document} _Element 添加事件的元素   
    @param {Boolean} _keepFlag 是否重复触发事件   
    @param {Number||Array} _keycode 按键的 keycode 如果是组合键 需要输入数组   
    @param {Function} _event 触发的事件   
    @param {Boolean} _type false=>down;true=>up   

---
## <span id="removeKeyEvent">移除keyNotBook事件 removeKeyEvent</span>
``` javascript
removeKeyEvent(_Element,_keycode,_event,_type)   
``` 
    @param {Document} _Element    
    @param {Number||Array} _keycode    
    @param {Function} _event    
    @param {Boolean} _type false=>down;true=>up.   
---
## 添加resize事件 addResizeEvent
``` javascript
addResizeEvent(_element,_listener)
```
    给element添加resize事件, 没有 e 事件参数   
    @param {Element} _element 绑定的元素   
    @param {Function} _listener 触发的函数   
---


# 类
文件中部分的类有使用上面的函数, 它们不能直接拷贝走就使用; 部分类使用了 class 语法, 所以不能在 ie 中使用

---
## UnitBezier 贝塞尔曲线 
在 (0,0) 与 (1,1) 之间的三阶贝塞尔曲线
*这个贝塞尔曲线的算法来自网络 详见代码*

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

## OlFunction 重载函数 
*注意, 该类使用了 clss 语法，所以不能直接使用于ie*    
没有构造函数, 写成类的语法纯粹是为了让编辑器认代码提示

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

## Delegate 委托 
*注意, 该类使用了 clss 语法，所以不能直接使用于ie*   
没有构造函数, 写成类的语法纯粹是为了让编辑器认代码提示
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
---

## KeyNotbook 按键记录器  
建议使用 函数 <a id="#addKeyEvent">addKeyEvent</a>(_Element,_keepFlag,_keycode,_event,_type) 来使用这个类
* 构造函数 KeyNotbook()   
    @param {Element} FElement 加入到的元素  
    *因为属性没什么被外部使用就不写文档里了*
### 方法
* setDKeyFunc(keycode,func)
    添加按键事件   
    @param {Number||Array} keycode 触发回调的按键 keycode, 接受 数字 或者 数组   
    @param {Function} func 触发后的回调函数   
* removeDKeyFunc(_keycode,func)
    移除按键事件   
    @param {Number||Array} _keycode 触发回调的按键 keycode, 接受 数字 或者 数组   
    @param {Function} func 触发后的回调函数   
* setKey(e)
    按下按键需要触发事件
* removeKey(e)
    抬起按键需要触发事件

---

## Stepper 步进器 
* 构造函数 Stepper(max,min,now)   
    @param {Number} max 步进器的最大值   
    @param {Number} min 步进器的最小值   
    @param {Number} now 步进器的当前值   
### 方法
* toString()返回当前值
* set()   
    设置当前值    
    @param {Number} _i 目标
* next(_l)
    让步进器步进
    @param {Number} _l 步长
    @returns {Number} 返回步进后的值
* overflowHanding()
    让步进器的溢出值回到范围内
---

## DEF_CUEOBJ 存储 cue 格式为js的obj格式 
*注意, 该类使用了 clss 语法，所以不能直接使用于ie*   
构造函数无参数   请使用 函数 loadCue(str) 创建
### 属性 
* @type {String}                  performer     演出者/作者
* @type {String}                  songwriter    歌唱者
* @type {String}                  title         标题
* @type {String}                  file          文件路径
* @type {String}                  fileType      文件类型
* @type {Array<String>}           rem           额外指令/注释
* @type {Array<DEF_CUEOBJTrack>}  track         分轨道

### 方法 
* selectRem(rem1) 
  @param {String} rem1 rem 的 第一个指令
* 方法集 setCommand 详见代码
  
---

## DEF_CUEOBJTrack 在 DEF_CUEOBJ 中的分轨道
*注意, 该类使用了 clss 语法，所以不能直接使用于ie*   
构造函数 
DEF_CUEOBJTrack(file,root,trackIndex)   
@param {String}      file        文件路径   
@param {DEF_CUEOBJ}  root        根 对象   
@param {Number}      trackIndex  轨道序号   

### 属性
* @type {String}          performer     演出者/作者
* @type {String}          songwriter    歌唱者
* @type {String}          title         标题
* @type {Number}          ListIndex     在 列表 中的序号
* @type {Array<String>}   rem           额外指令/注释
* @type {Number}          trackIndex    轨道序号
* @type {DEF_CUEOBJ}      root          根
* @type {String}          file          文件路径
* @type {Number}          op            在波形文件中的 开始时间(单位 秒)
* @type {Number}          ed            在波形文件中的 结束时间(单位 秒)
* @type {Object}          indexList     子 index 的列表

### 方法
* getDuration() 获取当前轨道的长度 单位(秒)
  
---

## DEF_MediaObj 给我的 audio 控制器 用的数据对象
*注意, 该类使用了 clss 语法，所以不能直接使用于ie*   
构造函数 constructor(src,title) 

### 属性
* @type {String}                title       标题
* @type {Array<String>}         cover       封面 (url)
* @type {String}                artist      艺术家
* @type {String}                songwriter  歌唱者
* @type {String}                performer   表演者
* @type {String}                album       专辑
* @type {Number}                op          开始时间
* @type {Number}                ed          结束时间
* @type {Number}                duration    持续时间
* @type {DEF_MediaObjMarkList}  mark        标记集合
* @type {String}                urlList     文件 url 列表

### 方法
* 静态方法 f(src,callback)
    通过路径创建mediaObj, 并尝试读取 ID3
    @param {String} src  媒体的链接
    @param {Function} callback 读取 id3 之后的回调 callback(rtn{DEF_MediaObj})
* getArtist()
    获取 "Artist" 编曲者 and 演唱者
* clone()
    克隆
* copy()
    拷贝
* getDuration()
  获取当前轨道的长度
    @param {Audio} audio 当前正在播放这个文件的 Audio 元素
    @param {Function} _callback _callback({Number}Duration) 某些情况无法直接获取当前的长度，所以需要传入回调函数接收值
    3个重载 fnc(audio) 和 fnc(callback); 用 audio 的重载可以返回长度, 可以不用 callback
---

## DEF_MediaObjMarkList 给媒体做标记的列表 
*注意, 该类使用了 clss 语法，所以不能直接使用于ie*      
构造函数constructor(DEF_MediaObjMarkArray)   
DEF_MediaObjMark 的列表   
@param {Array<DEF_MediaObjMark>} DEF_MediaObjMarkArray DEF_MediaObjMark 的数组   

### 属性
* @type{Array<DEF_MediaObjMark>}    list    存储着 mark 的 数组

### 方法
* reCount()
    重置内容中的所有计数器
* touchMarkByTime(mediaCtrl,time,afterTolerance)
    根据时刻触发标记, 如果有两个会被触发 将会仅触发在 list 中靠后的    
    @param {Exctrl} mediaCtrl 媒体控件    
    @param {Number} time 时刻    
    @param {Number} afterTolerance 向后容差 在容差内的时刻也会触发    

---

## DEF_MediaObjMark 给 DEF_MediaObj 的时间轴 做标记
构造函数 constructor(command,time,maxTouch)
@param {String} command 遭遇标记指令的   
@param {Number} time 时刻   
@param {Number} maxTouch 最大触发次数   

## hash 监听者的发生器 Hashcaller
*注意, 该类使用了 clss 语法，所以不能直接使用于ie*   
构造函数constructor(onlyTouchOne=true)



---

## HashListener

# 对已有的类增加功能

## Element.prototype.getChildElement()
获取元素的所有后代元素

## Date.prototype.toString()
* 添加了一个重载 toString(str)
    @param {String} str 用%{控制字符}{长度}控制打印字符: Y-年 M-月 D-日 d-星期几 h-小时 m-分钟 s-秒 如果没有写长度将使用自动长度, 如果长度超出将在前面补0; 例: %Y6-%M2-%D -> 001970-01-1