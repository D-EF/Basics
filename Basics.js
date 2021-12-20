/*!
 * Basics.js 应该在所有脚本之前载入
 */

/*
 * @Author: Darth_Eternalfaith
 * @LastEditTime: 2021-12-05 18:46:47
 * @LastEditors: Darth_Eternalfaith
 * test
 */

/**
 * 当前运行环境 (可能是 window 或 worker)
 */
var thisEnvironment=this;
var zero=0;

Object.copy=function(tgt){
    return Object.assign({},tgt);
}

function nullfnc(){}
// if(this.Element&&Element.prototype.attachEvent){
//     Element.prototype.addEventListener=Element.prototype.attachEvent;
// }

/**
 * [judgeOs UA & 内核 判断]
 * @returns {{isTabvar:Boolean,isPhone:Boolean,isAndroid:Boolean,isPc:Boolean,isFireFox:Boolean,isWebkit:Boolean,isIE:Boolean,isMozilla:Boolean}} [description]
 */
function judgeOs() {
    var ua = navigator.userAgent,
        isWindowsPhone = /(?:Windows Phone)/.test(ua),
        isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
        // 平板
        isFireFox = ua.indexOf("Mozilla") != -1,
        isTabvar = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tabvar)/.test(ua)),
        isPhone = /(?:iPhone)/.test(ua) && !isTabvar,
        isPc = !isPhone && !isAndroid && !isSymbian,
        isAndroid = ua.indexOf("Android") != -1,
        isAndroid = ua.indexOf("Android") != -1,
        isIE = ua.indexOf("Trident") != -1,
        isWebkit = ua.indexOf("isWebkit") != -1,
        isMozilla = ua.indexOf("Mozilla") != -1;
    return {
        isTabvar: isTabvar,
        isPhone: isPhone,
        isAndroid: isAndroid,
        isPc: isPc,
        isFireFox: isFireFox,
        isWebkit: isWebkit,
        isIE: isIE,
        isMozilla: isMozilla
    };
}

//旧版本浏览器兼容Object.keys函数   form https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if (!Object.keys) {
    Object.keys = (function () {
      var hasOwnProperty = Object.prototype.hasOwnProperty,
          hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
          dontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
          ],
          dontEnumsLength = dontEnums.length;
  
      return function (obj) {
        if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');
  
        var result = [];
  
        for (var prop in obj) {
          if (hasOwnProperty.call(obj, prop)) result.push(prop);
        }
  
        if (hasDontEnumBug) {
          for (var i=0; i < dontEnumsLength; i++) {
            if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
          }
        }
        return result;
      }
    })()
};

/** 用 rad 表示的 1deg */
Math.DEG=Math.PI/180;

/**
 * 在 (0,0) 与 (1,1) 之间的三阶贝塞尔曲线
 * @param {Number} p1x (0,0) 的 控制点 的 x 坐标
 * @param {Number} p1y (0,0) 的 控制点 的 y 坐标
 * @param {Number} p2x (1,1) 的 控制点 的 x 坐标
 * @param {Number} p2y (1,1) 的 控制点 的 y 坐标
 */
//该贝塞尔曲线的a、b、c计算和获取坐标来自:https://www.cnblogs.com/yanan-boke/p/8875571.html
function UnitBezier(p1x,p1y,p2x,p2y) {
    
    this.cx = 3.0 * p1x;
    this.bx = 3.0 * (p2x - p1x) - this.cx;
    this.ax = 1.0 - this.cx -this.bx;    
    this.cy = 3.0 * p1y;
    this.by = 3.0 * (p2y - p1y) - this.cy;
    this.ay = 1.0 - this.cy - this.by;
}
UnitBezier.prototype = {
    /**
     * 根据时间柄参数得到x坐标
     * @param {Number} t 时间柄参数
     * @returns {Number} x坐标
     */
    sampleCurveX : function(t) {
        return ((this.ax * t + this.bx) * t + this.cx) * t;
    },
    /**
     * 根据时间柄参数得到y坐标
     * @param {Number} t 时间柄参数
     * @returns {Number} y坐标
     */
    sampleCurveY : function(t) {  
        return ((this.ay * t + this.by) * t + this.cy) * t;
    },
    /**
     * 重置贝塞尔曲线
     */
    ReBezier : function(p1x,p1y,p2x,p2y){
        this.cx = 3.0 * p1x;
        this.bx = 3.0 * (p2x - p1x) - this.cx;
        this.ax = 1.0 - this.cx -this.bx;    
        this.cy = 3.0 * p1y;
        this.by = 3.0 * (p2y - p1y) - this.cy;
        this.ay = 1.0 - this.cy - this.by;
    },
    monotonicityOfX(){
        return monotonicityOfCubic(this.ax,this.bx,this.cx);
    },
    monotonicityOfY(){
        return monotonicityOfCubic(this.ay,this.by,this.cy);
    }
}

function zeroOfSquare(a,b,c){
    var discriminant=b*b-4*a*c;
    if(discriminant<0){
        return [];
    }
    if(discriminant===0){
        return [-b/a*0.5];
    }
    discriminant = Math.sqrt(discriminant);
    var k= 1 / (2 * a);
    return [(-b - discriminant)*k,(-b + discriminant)*k];
}

function monotonicityOfCubic(a,b,c){
    var d=zeroOfSquare(a,b,c);
    if(d.length!==2){
        return [];
    }
    return [
        ((this.ay * d[0] + this.by) * d[0] + this.cy) * d[0],
        ((this.ay * d[1] + this.by) * d[1] + this.cy) * d[1]
    ]
}
/** 阻止事件冒泡 */
function stopPropagation(e){e.stopPropagation();}

/** 阻止默认事件发生 */
function stopEvent(e){
    if (e&&e.preventDefault)e.preventDefault(); //阻止默认浏览器动作(W3C)
    else window.event.returnValue = false; //IE中阻止函数器默认动作的方式
    return false;
}

/** stopPropagation & Event 阻止冒泡和默认事件 */
function stopPE(e){
    e.stopPropagation();
    if (e&&e.preventDefault)e.preventDefault(); //阻止默认浏览器动作(W3C)
    else window.event.returnValue = false; //IE中阻止函数器默认动作的方式
    return false;
}

/**判断是否能支持某些input的type
*/
function inputSupportsTypeF(){
    function selectInputSupportsType(type){
        if(!document.createElement) return false;
        var input = document.createElement('input');
        input.setAttribute('type',type);
        return !(input.type==='text' && type!='text');
    }
    return {
        number:selectInputSupportsType("number"),   //数字输入框
        range:selectInputSupportsType("range"),     //滑动条
        color:selectInputSupportsType("color"),     //颜色板
        search:selectInputSupportsType("search"),   //搜索
        url:selectInputSupportsType("url"),         //url
        email:selectInputSupportsType("email"),     //e-mail
        //时间选择 op
        date:selectInputSupportsType("date"),       
        month:selectInputSupportsType("month"),
        week:selectInputSupportsType("week"),
        time:selectInputSupportsType("time"),
        datetime:selectInputSupportsType("datetime"),
        datetimeLocal:selectInputSupportsType("datetime-local")
        //时间选择 ed
    }
    //要用再加
}

/** 在 keydown 事件中使用 让控件仅接受数字
 * @param {Event} e 
 * @return {Boolean} 返回是否是数字
 */
function inputNumber(e){
    var event=event||e||window.event;
    if(!(event.keyCode>47&&event.keyCode<58)){
       stopPE(e)
       return false
    }
    else return true;
}

/**
 * 获取当前运行脚本的地址
 * @returns {String}
 */
function getCurrAbsPath(){
    if(document.currentScript){
        return document.currentScript.src;
    }
    else{
        var a = {}, stack;
        try{
            a.b();
        }
        catch(e){
            stack = e.stack || e.sourceURL || e.stacktrace; 
        }
        var rExtractUri = /(?:http|https|file):\/\/.*?\/.+?.js/, 
        absPath = rExtractUri.exec(stack);
        return absPath[0] || '';
    }
}
/**
 * 把相对地址转换成绝对地址
 * @param {String} _fileURL 
 */
function rltToAbs(_fileURL,rootURL){
    var fileURL,fileURL_Root;
    if(rootURL){
        fileURL_Root=rootURL; 
    }
    else if(fileURL_Root=getCurrAbsPath());
    else{
        fileURL_Root=this.location.href;
    }
    if(_fileURL.indexOf("://")!=-1){
        // 这个是绝对路径
        fileURL=_fileURL;
    }
    else{
        // 相对路径
        var urlspc=1;
        var i;
        var tempUrl="";
        for(i=0;i<_fileURL.length;i+=3){
            if(_fileURL[i]==='.'&&_fileURL[i+1]==='.'&&_fileURL[i+2]==='/'){
                ++urlspc;
            }
            else{
                for(var j=i;j<_fileURL.length;++j){
                    if(_fileURL[j]!='/'&&_fileURL[j]!='.'){
                        tempUrl=_fileURL.slice(j);
                        break;
                    }
                }
                break;
            }
        }
        // console.log(tempUrl);
        i=fileURL_Root.length-1;
        // if(fileURL_Root[i]==='/')--i;
        for(;(i>=0)&&(urlspc);--i){
            if(fileURL_Root[i]==='/'){
                --urlspc;
            }
        }
        fileURL=fileURL_Root.slice(0,i+1)+'/'+tempUrl;
    }
    return fileURL;
}
/**对比两个列表项是否相同
 * @param {Array}   a1       要进行比较的数组
 * @param {Array}   a2       要进行比较的数组
 * @return {Boolean}    返回是否相同
*/
function arrayEqual(a1,a2){
    if(a1.length!=a2.length)return false;
    var i=a1.length;
    for(--i;i>=0;--i){
        if(a1[i]!=a2[i])return false;
    }
    return true;
}
/**
 * NodeList 转换为 Array
 * @param {NodeList} nodelist 
 * @returns {Array<Node>} 保留引用的链接
 */
function nodeListToArray(nodelist){
    var array=null;
    try{
        array=Array.prototype.slice.call(nodelist,0);//非ie浏览器  ie8-将NodeList实现为COM对象，不能用这种方式检测
    }catch(ex){//ie8-
        var i=nodelist.length-1;
        array=new Array(i+1);
        for(;i<nodelist.length;i++){
            array.push(nodelist[0]);
        }
    }
    return array;
}
/**对比两个列表项是否相同(不区分项的类型和顺序)
 * @param {Array}   a1       要进行比较的数组
 * @param {Array}   a2       要进行比较的数组
 * @return {Boolean}    返回是否相同
 */
// 本来是给KeyNotbook用的 
function arrayCmp(a1,a2){
    if(a1&&a2){
        if(a1.length!=a2.length)
            return false;
        var ALength=a1.length;
        var flags=Array(ALength)
        for(var i=ALength-1;i>=0;--i){
            for(var j=ALength-1;j>=0;--j){
                if(a1[i]===a2[j]){
                    flags[i]=true;
                }
            }
        }
        for(var i=ALength-1;i>=0;--i){
            if(!flags[i])return false;
        }
        return true;
    }
}

/** 重载函数类 */
class OlFunction extends Function{
    // 写成类的语法纯粹是为了让编辑器认代码提示
    
    /**
     * 请使用 OlFunction.create 函数
     */
    constructor(){
        console.error("请使用 OlFunction.create()");
        /** @type {Array<{parameterType:parameterType,fnc:fnc,codeComments:codeComments}>} 重载函数 */
        this.ols=[];
        /** @type {Function} */
        this.defaultFnc=new Function();
    }
    /**
     * 添加一个重载
     * @param {Array} parameterType   形参的类型
     * @param {Function}    fnc             执行的函数
     * @param {String}      codeComments    没用的属性, 作为函数的注释
    */
    addOverload(parameterType,fnc,codeComments){
        this.ols.push({parameterType:parameterType,fnc:fnc,codeComments:codeComments});
    }
    // 如果需要ie中使用，把 create 和 addOverload 拷贝走就行
    /**
     * 创建重载函数
     * @param   {Function} defaultFnc 当没有和实参对应的重载时默认执行的函数
     * @return  {OlFunction} 带重载的函数
     * 用 .addOverload 添加重载
     */
    static create(defaultFnc){
        var OverloadFunction=(function(){
            return function(){
                var i=arguments.length-1,j,flag=false;
                for(i=OverloadFunction.ols.length-1;i>=0;--i){
                    if(arguments.length===OverloadFunction.ols[i].parameterType.length){
                        flag=true;
                        for(j=arguments.length-1;flag&&j>=0;--j){
                            flag=(arguments[j].constructor===OverloadFunction.ols[i].parameterType[j]||arguments[j] instanceof OverloadFunction.ols[i].parameterType[j]);
                        }
                        if(flag)break;
                    }
                }
                if(flag){
                    return OverloadFunction.ols[i].fnc.apply(this,arguments);
                }
                else{
                    return OverloadFunction.defaultFnc.apply(this,arguments);
                }
            }
        })();
        OverloadFunction.ols=[];
        OverloadFunction.defaultFnc=defaultFnc;
        OverloadFunction.addOverload=OlFunction.prototype.addOverload;
        return OverloadFunction;
    }
}

/**继承
 * @param {*} _basics   基类
 * @param {*} _derived  子类
 */
function inheritClass(_basics,_derived){
    // 创建一个没有实例方法的类
    var Super = function(){};
    Super.prototype = _basics.prototype;
    //将实例作为子类的原型
    _derived.prototype = new Super();
}

/**
 * 委托
 */
class Delegate{
    /** 请使用 Delegate.ctrate() */
    constructor(){
        this.actList=[];
        console.error("请使用 Delegate.ctrate()");
    }

    /**添加一个委托
     * @param {Object} tgt   执行动作的this指向
     * @param {Function} act 执行的动作
     */
    addAct(tgt,act){
        this.actList.push({tgt:tgt,act:act});
    }
    /**移除一个委托
     * 参数和加入相同
     * @returns {Boolean} 返回是否移除成功
     */
    removeAct(tgt,act){
        var i;
        for(i=this.actList.length-1;i>=0;--i){
            if(this.actList[i].tgt===tgt&&this.actList[i].act===act){
                this.actList.splice(i,1);
                return true;
            }
        }
        return false;
    }
    /**
     * @returns {Delegate} 返回一个委托对象
     */
    static ctrate(){
        var delegate=(function(){
            return function(){
                var i=delegate.actList.length;
                var rtns=new Array(i);
                for(--i;i>=0;--i){
                    rtns[i]={
                        tgt:delegate.actList[i].tgt,
                        rtn:delegate.actList[i].act.apply(delegate.actList[i].tgt,arguments)
                    }
                }
                return rtns;
            }
        })();
        delegate.actList=[];
        delegate.addAct=Delegate.prototype.addAct;
        delegate.removeAct=Delegate.prototype.removeAct;
        return delegate;
    }
}

/**为了防止服务器出错对部分字符进行编码
 * @param {String} str <>"'{}[] to &#ascii;
 * @returns {String} 转换后的字符串
 */
function encodeHTML(str){
    var enStr=str;
    for(var i=encodeHTML.regex.length-1;i>=0;--i){
        enStr=enStr.replace(encodeHTML.regex[i],encodeHTML.rStrL[i]);
    }
    return enStr;
}
encodeHTML.regex=[];
encodeHTML.rStrL=[];
(function(){
    encodeHTML.regex.push(/</g);   encodeHTML.rStrL.push("&#60;");
    encodeHTML.regex.push(/>/g);   encodeHTML.rStrL.push("&#62;");
    encodeHTML.regex.push(/"/g);   encodeHTML.rStrL.push("&#34;");
    encodeHTML.regex.push(/'/g);   encodeHTML.rStrL.push("&#39;");
    encodeHTML.regex.push(/\{/g);  encodeHTML.rStrL.push("&#123;");
    encodeHTML.regex.push(/\}/g);  encodeHTML.rStrL.push("&#125;");
    encodeHTML.regex.push(/\[/g);  encodeHTML.rStrL.push("&#91;");
    encodeHTML.regex.push(/\]/g);  encodeHTML.rStrL.push("&#93;");
})()

//对部分转义的字符反转义
function decodeHTML(str){
    var enStr=str;
    for(var i=decodeHTML.regex.length-1;i>=0;--i){
        enStr=enStr.replace(decodeHTML.regex[i],decodeHTML.rStrL[i]);
    }
    return enStr;
}
decodeHTML.regex=[/&amp;/g  ];
decodeHTML.rStrL=["&"       ];

/**
 * 模版字符串 可以在原字符串中使用 '\' 屏蔽 插值关键文本
 * @param {String} _str  字符串
 * @param {Object} that this 指针
 * @param {Array} argArray 实参
 * @param {String} opKey 插值关键文本 op; 默认 "${"
 * @param {String} edKey 插值关键文本 ed; 默认 "}"
 * @param {char}   opKeyMask 插值关键文本 的屏蔽字符; 默认'\'
 * @param {char}   edKeyMask 插值关键文本 的屏蔽字符; 默认'\'
 * @returns {{str:String,hit:Array<String>}}
 */
 function templateStringRender(str,that,argArray,opKey="${",edKey="}",opKeyMask='\\',edKeyMask='\\'){
    if(Object.keys(that).length){
        var temp=[],tempstr="",hit=[];
        var strkey="\"'`",strKP=0,strFlag=false;
        var q,p;// q是左
        var headFlag=0,footFlag=0;
        for(p=0,q=0;str[p];++p){
            if((headFlag=((str[p]===opKey[0])&&(str[p-1]!=opKeyMask))))
            for(var i=1;i<opKey.length;++i){
                if(!(headFlag=str[p+i]===opKey[i])){break;}
            }
            if(headFlag){ // 检测到头
                temp.push(str.slice(q,p));
                q=p+opKey.length;
                tempstr="";
                while(p<str.length){
                    ++p;
                    if((!strFlag)){
                        for(strKP=strkey.length-1;strKP>=0;--strKP){
                            if(strkey[strKP]===str[p]){
                                strFlag=true;
                                break;
                            }
                        }
                    }else{
                        if((strkey[strKP]===str[p])&&(str[p-1]!=='\\')){
                            strFlag=false;
                        }
                    }
                    if((footFlag=(str[p]===edKey[0]))&&!strFlag){
                        if((str[p-1]!=edKeyMask)){
                            for(var j=1;j<edKey.length;++j){
                                if(!(footFlag=str[p+i]===edKey[i])){break;}
                            }
                            if(footFlag){
                                tempstr+=str.slice(q,p);
                                temp.push((new Function(["tgt"],"return "+tempstr)).apply(that,argArray));
                                hit.push({expression:tempstr,value:temp[temp.length-1]});
                                q=p+edKey.length;
                                break;
                            }
                        }else{
                            tempstr+=str.slice(q,p-1);
                            q=p;
                        }
                    }
                }
            }
        }
        temp.push(str.slice(q,p));
        return {str:temp.join(""),hit:hit};
    }
}

/**
 * 将字符串转换成js的类型, 相当于JSON.parse, 如果只是个字符串就是字符串(口胡)
 * 参数和 JSON.parse 一样
 */
function strToVar(str,reviver){
    var ed=str.length-1;
    if(str[0]==='"'&&str[ed]==='"');
    else if(str[0]==="{"&&str[0]==="}");
    else if(str[0]==="["&&str[0]==="]");
    else if(!isNaN(Number(str)));
    else{
        // 这个字符串是不符合格式的 直接输出字符串
        return str;
        // 不尝试更深
    }
    JSON.parse(str,reviver);
}

// 强化 对 dom 操作

/**获取所有后代元素*/
if(this.Element)
Element.prototype.getChildElement=function(){
    var chE=[];
    var _chE=this.children;
    for(var i=0;i<_chE.length;++i){
        chE.push(_chE[i])
        chE=chE.concat((_chE[i].getChildElement()));
    }
    return chE;
}

/**按键记录器key notbook
 * @param {Element} FElement 加入到的元素
*/
function KeyNotbook(FElement){
    this.FElement=FElement;
    this.downingKeyCodes=[];
    this.keysdownF  =[];    //function
    this.keysdownFF =[];    //function flag
    this.keysupF={};
}
KeyNotbook.prototype={
    constructor:KeyNotbook,
    /**
     * 添加按键事件
     * @param {Number||Array} keycode 触发回调的按键 keycode, 接受 数字 或者 数组
     * @param {Function} func 触发后的回调函数
     */
    setDKeyFunc:function(keycode,func){
        if(!keycode||!func){
            return -1;
        }
        if(keycode.constructor===Number){
            this.keysdownFF.push([keycode]);
        }
        else if(keycode.constructor===Array){
            this.keysdownFF.push(keycode);
        }
        this.keysdownF.push(func);
    },
    /**
     * 移除按键事件
     * @param {Number||Array} _keycode 触发回调的按键 keycode, 接受 数字 或者 数组
     * @param {Function} func 触发后的回调函数
     */
    removeDKeyFunc:function(_keycode,func){
        var keycode;
        if(!_keycode||!func){
            return -1;
        }
        if(_keycode.constructor===Number){
            keycode=[_keycode];
        }
        else if(_keycode.constructor===Array){
            keycode=_keycode;
        }
        for(var i=this.keysdownFF.length-1;i>=0;--i){
            if(arrayCmp(this.keysdownFF[i],keycode)){
                if(this.keysdownF[i]===func){
                    this.keysdownF.splice(i,1);
                    this.keysdownFF.splice(i,1);
                    break;
                }
            }
        }
    },

    /**按下新按键*/
    setKey:function(e){
        var flag=false;
        var i=0;
        var downingKALength=this.downingKeyCodes.length;
        if(downingKALength)
        for(var j=downingKALength-1;j>=0;--j){
            if(flag)break;
            flag=e.keyCode===this.downingKeyCodes[j];
            i++;
        }
        if(!flag){
            // 有新的按键按下
            this.downingKeyCodes[i]=e.keyCode;
            for(i=this.keysdownFF.length-1;i>=0;--i){
                if(arrayCmp(this.keysdownFF[i],this.downingKeyCodes)){
                    this.keysdownF[i].call(this.FElement,e);
                    return;
                }
            }
        }
        else{
            for(i=this.keysdownFF.length-1;i>=0;--i){
                if(arrayCmp(this.keysdownFF[i],this.downingKeyCodes)&&!this.keysdownF.keepFlag){
                    this.keysdownF[i].call(this.FElement,e);
                    return;
                }
            }
        }
    },

    /**抬起按键*/
    removeKey:function(e){
        var downingKALength=this.downingKeyCodes.length;
        if(downingKALength)
        for(var i=downingKALength-1;i>=0;--i){
            if(e.keyCode===this.downingKeyCodes[i]){
                this.downingKeyCodes.splice(i,1);
                if(this.keysupF[e.keyCode.toString()])this.keysupF[e.keyCode.toString()].call(this.FElement,e);
                return 0;
            }
        }
    },
    reNB:function(){
        this.downingKeyCodes=[];
    }
}

/**
 * 给element添加按键事件
 * @param {Document} _Element 添加事件的元素
 * @param {Boolean} _keepFlag 是否重复触发事件
 * @param {Number||Array} _keycode 按键的 keycode 如果是组合键 需要输入数组
 * @param {Function} _event 触发的事件
 * @param {Boolean} _type false=>down;true=>up
 */
function addKeyEvent(_Element,_keepFlag,_keycode,_event,_type){
    var thisKeyNotbook;
    if(!_Element.keyNotbook){
        _Element.keyNotbook=new KeyNotbook();
        thisKeyNotbook=_Element.keyNotbook;
        thisKeyNotbook.FElement=_Element;
        _Element.addEventListener("keydown" ,function(e){thisKeyNotbook.setKey(e)});
        _Element.addEventListener("keyup"   ,function(e){thisKeyNotbook.removeKey(e)});
        _Element.addEventListener("blur"    ,function(e){thisKeyNotbook.reNB()});
    }
    else{
        thisKeyNotbook=_Element.keyNotbook;
    }
    if(_type){
        thisKeyNotbook.keysupF[_keycode.toString()]=_event;
    }
    else{
        thisKeyNotbook.setDKeyFunc(_keycode,_event);
        thisKeyNotbook.keysdownF[thisKeyNotbook.keysdownF.length-1].keepFlag=_keepFlag;
    }
}

/**
 * 移除 element 上的 keyNotBook 的事件
 * @param {Document} _Element 
 * @param {Number||Array} _keycode 
 * @param {Function} _event 
 * @param {Boolean} _type false=>down;true=>up
 */
function removeKeyEvent(_Element,_keycode,_event,_type){
    if(_Element.keyNotbook){
        var thisKeyNotbook=_Element.keyNotbook;
        if(_type){
            delete thisKeyNotbook.keysupF[_keycode.toString()];
        }
        else{
            thisKeyNotbook.removeDKeyFunc(_keycode,_event);
        }
    }
}

/**
 * 给element添加resize事件, 没有 e 事件参数
 * @param {Element} _element 绑定的元素
 * @param {Function} _listener 触发的函数
 */
function addResizeEvent(_element,_listener){   
    if(_element.resizeMarkFlag){
        element.resizeListener.push(_listener);
    }
    else{
        _element.resizeListener=[_listener];
        var mark1 =document.createElement("div"),
            mark1C=document.createElement("div"),
            mark2C=document.createElement("div");
        var lowWidth=_element.offsetWidth||1;
        var lowHeight=_element.offsetHeight||1;
        var maxWidth=lowWidth*9999,maxHeight=lowHeight*9999;
        mark1.style.cssText="position:absolute;top:0;left:0;right:0;bottom:0;z-index=-10000;min-Width:1px;min-height:1px;overflow:hidden;visibility:hidden;";

        mark1C.style.cssText="width:300%;height:300%;";
        mark2C.style.cssText=`width:${maxWidth}px;height:${maxHeight}px;`;
        
        var mark2=mark1.cloneNode(false);
        
        mark1.appendChild(mark1C);
        mark2.appendChild(mark2C);
        _element.appendChild(mark1);
        _element.appendChild(mark2);

        mark1.scrollTop=maxHeight;
        mark1.scrollLeft=maxWidth;
        mark2.scrollTop=maxHeight;
        mark2.scrollLeft=maxWidth;

        mark1.markBrother=mark2;
        mark2.markBrother=mark1;

        function m_resize(){
            if(lowWidth!=_element.offsetWidth||lowHeight!=_element.offsetHeight){
                // console.log(2);
                lowWidth=_element.offsetWidth;
                lowHeight=_element.offsetHeight;
                for(var i=_element.resizeListener.length-1;i>=0;--i){
                    _element.resizeListener[i].call(_element);
                }
                if(maxWidth<lowWidth||maxHeight<lowWidth)
                maxWidth=lowWidth*9999,maxHeight=lowWidth*9999;
                mark2C.style.cssText=`width:${maxWidth}px;height:${maxHeight}px;`;
            }
        }
        function m_scroll(e){
            m_resize();
            mark1.scrollTop=maxHeight;
            mark1.scrollLeft=maxWidth;
            mark2.scrollTop=maxHeight;
            mark2.scrollLeft=maxWidth;
        }
        mark1.onscroll=mark2.onscroll=m_scroll;
        _element.resizeMarkFlag=true;
        _element.resizeMark1=mark1;
        _element.resizeMark2=mark2;
    }
}
/**
 * 用于复位 addResizeEvent 
 * 给使用过 addResizeEvent 的元素使用
 */
addResizeEvent.reResize=function(_element){
    if(_element.resizeMarkFlag){
        var lowWidth=_element.offsetWidth||1;
        var lowHeight=_element.offsetHeight||1;
        var maxWidth=lowWidth*999,maxHeight=lowHeight*999;

        _element.resizeMark1.scrollTop=maxHeight;
        _element.resizeMark1.scrollLeft=maxWidth;
        _element.resizeMark2.scrollTop=maxHeight;
        _element.resizeMark2.scrollLeft=maxWidth;
    }
}
/**
 * @param {Number} max 步进器的最大值
 * @param {Number} min 步进器的最小值
 * @param {Number} now 步进器的当前值
 */
function Stepper(max,min,now){
    this.max=max===undefined?Infinity:max;
    this.min=(min===undefined)?(0>this.max?this.max-1:0):(min);
    if(this.max<this.min){
        var temp=this.min;
        this.min=this.max;
        this.max=temp;
    }
    /**
     * 用来添加监听的
     * @type {Array<Function>}
     */
    this.regressionlinListener=[];
    this.i=now||0;
    this.overflowHanding();
}

Stepper.prototype={
    valueOf:function(){
        return this.i;
    },
    toString:function(){
        return this.i.toString();
    },
    /**
     * 设置当前值
     * @param {Number} _i 目标
     * @returns {Number} 返回修改后的值
     */
    set:function(_i){
        this.i=_i;
        this.overflowHanding();
        return this.i;
    },
    /**
     * 让步进器步进
     * @param {Number} _l 步长
     * @returns {Number} 返回步进后的位置
     */
    next:function(_l){
        var l=_l===undefined?1:_l;
        this.i+=l;
        
        this.overflowHanding();

        return this.i;
    },
    /**
     * 让步进器的溢出值回到范围内
     */
    overflowHanding:function(){
        if(this.max===this.min) return this.i=this.min;
        var l=this.max-this.min+1;
        if(this.i<this.min){
            this.i=this.max-(this.min-this.i)%(l+1)+1;
            this.regressionlin_call();
        }
        else if(this.i>this.max){
            this.i=this.min+(this.i-this.max)%(l+1)-1;
            this.regressionlin_call();
        }
        return this.i;
    },
    regressionlin_call(){
        for(var i=this.regressionlinListener.length-1;i>=0;--i){
            this.regressionlinListener(this.i,this);
        }
    }
}

function download(url,name){
    var xhr=new XMLHttpRequest();
    xhr.open("Get",url);
    xhr.requestType="blob";
    xhr.send();
    xhr.onload=function(){
        var data=this.response;
        var tempA=document.createElement("a");
        var dataurl=URL.createObjectURL(data);
        console.log(dataurl);
        tempA.setAttribute("href",dataurl);
        tempA.setAttribute("download",name===undefined?"":name);
        tempA.click();
    }
}

/**
 * 存储 cue 格式为js的obj格式
 * 参考资料来自: https://tieba.baidu.com/p/6160083867
 */
function DEF_CUEOBJ(){
    this.performer="";
    this.songwriter="";
    this.title="";
    this.file="";
    this.fileType="";
    this.rem=[];
    this.track=[];
}
DEF_CUEOBJ.prototype={
    /**
     * 查找rem指令
     * @param {String} rem1 rem 的 第一个指令
     * @returns {Array<Array<String>>}
     */
    selectRem:function(rem1){
        var rtn=[];
        for(var i=this.rem.length-1;i>=0;--i){
            if(this.rem[i][1]&& this.rem[i][1]===rem1){
                rtn.push(this.rem[i]);
            }
        }
        return rtn;
    },
    /** 处理 rem 命令的集合 */
    setCommand:{
        // 在此处添加对cue格式的指令的处理
        // 由于我只需要处理音乐文件的 所以省略了很多指令
        /**
         * @param {Array<String>} _cl 指令的字符串数组
         */
        rem:function(_cl){
            this.rem.push(_cl);
        },
        file:function(_cl){
            this.file=_cl[1];
            this.fileType=_cl[2];
        },
        title:function(_cl){
            this.title=_cl[1];
        },
        performer:function(_cl){
            this.performer=_cl[1];
        },
        songwriter:function(_cl){
            this.songwriter=_cl[1];
        },

        // track
        // 因为js的继承反射内容是复制这个对象的引用，所以即使是在子类追加也会追加到基类上，非常拉跨。   所以我把子类的反射的内容写在基类上了...
        
        index:function(_cl){
            var indexNub=parseInt(_cl[1]);
            var time=cue_timeToSecond(_cl[2]);
            var lastTrack;
            if(this.root.track.length-2>=0){
                lastTrack=this.root.track[this.root.track.length-2];
            }
            switch(indexNub){
                case 1:
                    this.op=time;
                    if(lastTrack&&(lastTrack.ed===undefined)){
                        lastTrack.ed=time;
                    }
                break;
                case 0:
                    lastTrack.ed=time;
                break;
                default:
                    this.indexList.push(time);
                break;
            }
        }
    }
}
/**
 * cue 的一截轨道内容
 * @param {String}      file        文件路径
 * @param {DEF_CUEOBJ}  root        根 对象
 * @param {Number}      trackIndex  轨道序号
 */
function DEF_CUEOBJTrack(file,root,trackIndex){
    this.performer="";
    this.songwriter="";
    this.title="";
    this.ListIndex;
    this.rem=[];
    this.trackIndex=trackIndex;
    this.root=root;
    this.file=file;
    this.op;    //秒
    this.ed;
    this.indexList=[];
}
inheritClass(DEF_CUEOBJ,DEF_CUEOBJTrack);

DEF_CUEOBJTrack.prototype.getDuration=function(){
    return this.ed-this.op;
}

/**
 * 把cue的表示时间的格式转换成秒
 * @param {String} timeStr mm:ss:ff
 * @returns {Number}
 */
function cue_timeToSecond(timeStr){
    var temp=timeStr.split(':');
    
    return parseInt(temp[0])*60+parseInt(temp[1])+parseInt(temp[2])/75;
}
/**
 * 解析 cue 格式 的字符串
 * @param {String} str 
 */
function loadCue(str){
    var p=0,q=0,isQuotes=false;
    var tempStr;
    var rtn=new DEF_CUEOBJ();
    var that=rtn;
    var CommandList=[];
    for(;p<str.length;++p){
        if(str[p]!=' '){
            for(q=p;(p<=str.length);++p){
                if(str[p]==='\"'){
                    isQuotes=!isQuotes;
                    if(isQuotes){
                        q=p+1;
                    }
                }
                if((str[p]===' ')&&(!isQuotes)){
                    // 记录指令
                    if(str[p-1]==='\"'){
                        tempStr=str.slice(q,p-1);
                    }else{
                        tempStr=str.slice(q,p);
                    }
                    CommandList.push(tempStr);
                    q=p+1;
                }
                else if((str[p]==="\n")||(str[p]==="\r")||(str.length===p)){
                    // 换行 进入下一条指令
                    if(str[p-1]==='\"'){
                        tempStr=str.slice(q,p-1);
                    }else{
                        tempStr=str.slice(q,p);
                    }
                    CommandList.push(tempStr);

                    if(CommandList[0].toLowerCase()==="track"){
                        that=new DEF_CUEOBJTrack(rtn.file, rtn, rtn.track.length);
                        rtn.track.push(that);
                    }
                    else{
                        if(that.setCommand[CommandList[0].toLowerCase()]){
                            that.setCommand[CommandList[0].toLowerCase()].call(that,CommandList);
                        }
                        else{
                            // 不支持这个指令
                        }
                    }

                    do{ ++p; } while((str[p+1]==="\n")||(str[p+1]==="\r"));
                    CommandList=[];
                    break;
                }
            }
        }
    }
    return rtn;
}

/** 
 * 查找图片文件
 * @param {String} _rootUrl 根目录
 * @param {Array<String>} _nameList 文件名列表
 * @param {Array<String>} _afertList 后缀名列表
 * @param {Function} callBack 搜索完成的回调函数 callBack({Array<String>}); 参数是搜索到的所有文件路径的列表
 */
function selectImg(_rootUrl,_nameList,_afertList,callBack){
    var temp=new Array(_afertList.length);
    var c=0,ctgt=_afertList.length*_nameList.length;
    var rtn=[];
    for(var i=temp.length-1;i>=0;--i){
        temp[i]=new Image();
        temp[i].onload=function(){
            rtn.push(this.src);
            c++;
            if(c>=ctgt){
                callBack(rtn);
            }
            else{
                this.n_index+=1;
                if(this.n_index>=_nameList.length)return;
                this.src=_rootUrl+_nameList[this.n_index]+this.n_afert;
            }
        }
        temp[i].onerror=function(e){
            c++;
            if(c>=ctgt){
                callBack(rtn);
            }
            else{
                this.n_index+=1;
                if(this.n_index>=_nameList.length)return;
                this.src=_rootUrl+_nameList[this.n_index]+this.n_afert;
            }
        }
        temp[i].n_index=0;
        temp[i].n_afert=_afertList[i];
        temp[i].src=_rootUrl+_nameList[temp[i].n_index]+temp[i].n_afert;
    }
    // callBack(rtn);
}

/** 
 * 给我的 audio 控制器 用的数据对象
 */
class DEF_MediaObj{
    /**
     * @param {String}  scr     媒体文件的 url
     * @param {String}  title   标题
     */
    constructor(src,title){
        this.title="";
        this.cover=[];
        this.artist="";
        this.songwriter="";
        this.performer="";
        this.album="";

        this.op=0;
        this.ed=0;
        this.duration=0;
        this.mark=new DEF_MediaObjMarkList();

        this.urlList=[];
        if(src){
            this.title=src;
            this.urlList.push(src);
        }
        if(title){
            this.title=title;
        }
    }
    /**
     * 通过路径创建mediaObj, 并尝试读取 ID3
     * @param {String} src  媒体的链接
     * @param {Function} callback 读取 id3 之后的回调 callback(rtn{DEF_MediaObj})
     */
    static f(src,callback){
        var rtn=new DEF_MediaObj(src);
        var after=src.slice(src.lastIndexOf('.'));
        if(after===".mp3"){
            ID3.loadTags(src,function(){
                var tags = ID3.getAllTags(src);
                var image = tags.picture;
                if (image) {
                    var base64String = "";
                    for (var i = 0; i < image.data.length; i++) {
                        base64String += String.fromCharCode(image.data[i]);
                    }
                    var base64 = "data:" + image.format + ";base64," +
                            window.btoa(base64String);
                    rtn.cover.push(base64);
                }
                if(tags.title) rtn.title=tags.title;
                if(tags.artist) rtn.artist=tags.artist;
                if(tags.album) rtn.album=tags.album;
                callback(rtn);
            },
            {tags: ["title","artist","album","picture"]});
        }
        return rtn;
    }
    /**
     * 拷贝以创建一个 DEF_MediaObj
     * @param {Object} baseObj
     * @returns {DEF_MediaObj}
     */
    static copy(baseObj){
        var rtn=new DEF_MediaObj();
        Object.assign(rtn,baseObj);

        rtn.urlList=new Array(i);
        if(baseObj.urlList){
            var i=baseObj.urlList.length;
            rtn.urlList=new Array(i);
            for(--i;i>=0;--i){
                rtn.urlList[i]=this.urlList[i];
            }
        }
        rtn.mark=new DEF_MediaObjMarkList();
        if(baseObj.mark){
            for(i=0;i<this.mark.list;++i){
                rtn.mark.list[i]=this.mark.list[i].copy();
            }
        }
        return rtn;
    }
    /**
     * 克隆以创建一个 DEF_MediaObj
     * @param {Object} baseObj
     * @returns {DEF_MediaObj}
     */
    static clone(baseObj){
        var rtn=new DEF_MediaObj();
        Object.assign(rtn,baseObj);
        return rtn;
    }
    /**
     * 获取 "Artist" 编曲者 and 演唱者
     */
    getArtist(){
        return this.performer + "/" + this.songwriter;
    }
    /**
     * 克隆当前对象
     * @returns {DEF_MediaObj}
     */
    clone(){
        return DEF_MediaObj.clone(this);;
    }
    /**
     * 拷贝当前对象
     * @returns {DEF_MediaObj}
     */
    copy(){
        return DEF_MediaObj.copy(this);
    }
}

/**
 * 获取当前轨道的长度
 * @param {Audio} audio 当前正在播放这个文件的 Audio 元素
 * @param {Function} _callback _callback({Number}Duration) 某些情况无法直接获取当前的长度，所以需要传入回调函数接收值
 * 3个重载 fnc(audio) 和 fnc(callback); 用 audio 的重载可以返回长度, 可以不用 callback
 */
DEF_MediaObj.prototype.getDuration=OlFunction.create();
DEF_MediaObj.prototype.getDuration.addOverload([Function],
    function(_callback){
        var that=this;
        if(!this.ed){
            var tempAudio=new Audio(),tempHTML=[];
            for(var i=this.urlList.length;i>=0;--i){
                tempHTML.push("<source src=\""+this.urlList[i]+"\"/>");
            }
            tempAudio.innerHTML=tempHTML;
            if(!this.op){
                tempAudio.abort=function(e){
                    var d=this.duration;
                    _callBack(d);
                }
            }else{
                tempAudio.abort=function(e){
                    var d=this.duration-that.op;
                    _callBack(d);
                }
            }
            tempAudio.load();
        }else{
            var d=this.ed-this.op;
            _callback(d);
            console.log(d);
            return d;
        }
    }
);
DEF_MediaObj.prototype.getDuration.addOverload([Audio],
    function(audio){
        if(!this.ed){
            var d;
            if(!this.op){
                d=audio.duration;
            }else{
                d=audio.duration-this.op;
            }
        }else{
            var d=this.ed-this.op;
        }
        return d;
    }
);
DEF_MediaObj.prototype.getDuration.addOverload([Audio,Function],
    function(audio,_callback){
        var d=this.getDuration(audio);
        _callback(d);
        return d;
    }
);

/**
 * 给媒体做标记的列表 因为浏览器的 updata 事件触发 大概每秒触发四次，所以会有误差
 */
class DEF_MediaObjMarkList{
    /**
     * DEF_MediaObjMark 的列表
     * @param {Array<DEF_MediaObjMark>} DEF_MediaObjMarkArray DEF_MediaObjMark 的数组
     */
    constructor(DEF_MediaObjMarkArray){
        this.list=DEF_MediaObjMarkArray||[];
    }
    /**
     * 重置所有计数器
     */
    reCount(){
        for(var i=this.list.length-1;i>=0;--i){
            this.list[i].reCount();
        }
    }
    /**
     * 根据时刻触发标记, 如果有两个会被触发 将会仅触发在 list 中靠后的
     * @param {Exctrl} mediaCtrl 媒体控件
     * @param {Number} time 时刻
     * @param {Number} afterTolerance 向后容差 在容差内的时刻也会触发
     */
    touchMarkByTime(mediaCtrl,time,afterTolerance){
        for(var i=this.list.length-1;i>=0;--i){
            if((this.list[i].time<=time)&&(this.list[i].time+afterTolerance>=time)){
                if(this.list[i].touch(mediaCtrl))return;
            }
        }
    }
}
/**
 * 给 DEF_MediaObj 的时间轴 做标记
 */
class DEF_MediaObjMark{
    /**
     * @param {String} command 遭遇标记 的 指令
     * @param {Number} time 时刻
     * @param {Number} maxTouch 最大触发次数
     */
    constructor(command,time,maxTouch){
        this.command=command;
        this.time=time||0;
        this.maxTouch=maxTouch||1;
        this.count=this.maxTouch;
    }
    copy(){
        var rtn=new DEF_MediaObjMark();
        Object.assign(rtn,this);
        return rtn;
    }
    /**
     * 重置计数器
     */
    reCount(){
        this.count=this.maxTouch;
    }
    /**
     * 触发标记
     * @param {ExCtrl} audioCtrl
     */
    touch(mediaCtrl){
        if(!this.count)return false;
        var action=this.commandList[this.command.split(' ')[0]];
        if(action instanceof Function)action.call(this,mediaCtrl);
        --this.count;
    }
}
DEF_MediaObjMark.prototype.commandList={
    go(mediaCtrl){
        var tgtTime=parseFloat(this.command.split(' ')[1]);
        mediaCtrl.setCurrentTime(tgtTime);
    }
}

/**
 * @param {DEF_CUEOBJ} _cueobj
 * @param {String} _url 为了找到轨道文件, 需要提供 cue 的路径
 * @return {Array<DEF_MediaObj>} 返回 DEF_MediaObj 数组
 */
function cueObjToMediaObj(_cueobj,_url){
    var rtn=[],urlList=[rltToAbs(_cueobj.file,_url)];
    var tempObj;
    var cover=[];
    selectImg(_url.slice(0,_url.lastIndexOf('/')+1),["cover","front"],[".jpg",".jpeg",".png",".gif",".svg"],
    function(imgList){
        if(imgList.length>0){
            cover.push(...imgList);
        }else{
            var afterL=urlList[0].length,
                after=urlList[0][afterL-3]+urlList[0][afterL-2]+urlList[0][afterL-1];
            if(after==="mp3"){
                ID3.loadTags(urlList[0],function(){
                    var tags = ID3.getAllTags(urlList[0]);
                    var image = tags.picture;
                    if (image) {
                        var base64String = "";
                        for (var i = 0; i < image.data.length; i++) {
                            base64String += String.fromCharCode(image.data[i]);
                        }
                        var base64 = "data:" + image.format + ";base64," +
                                window.btoa(base64String);
                        cover.push(base64);
                    }
                },
                {tags: ["title","artist","album","picture"]});
            }
        }
    });
    for(var i=0;i<_cueobj.track.length;++i){
        tempObj=new DEF_MediaObj();
        tempObj.urlList=urlList;
        tempObj.title=_cueobj.track[i].title;
        tempObj.album=_cueobj.title;
        tempObj.songwriter=_cueobj.track[i].songwriter||_cueobj.songwriter;
        tempObj.performer=_cueobj.track[i].performer||_cueobj.performer;
        tempObj.cover=cover;
        tempObj.op=_cueobj.track[i].op;
        tempObj.ed=_cueobj.track[i].ed;

        rtn.push(tempObj);
    }
    return rtn;
}

// selectImg("./img/",["1","2","3","4","5"],[".jpg",".jpeg",".png",".gif"],function(e){console.log(e)});

/**
 * 请求 api
 * @param {String} method 请求方式
 * @param {String} url 请求地址
 * @param {Function} callback 回调函数
 * @param {any} body 加在 send 里的实参
 */
function requestAPI(method,url,callback,body){
    var xmlHttp;
    if(thisEnvironment.XMLHttpRequest){
        xmlHttp=new XMLHttpRequest();
    }
    else{
        xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
    }
    xmlHttp.open(method,url);
    xmlHttp.onload=callback;
    xmlHttp.send(body);
    return xmlHttp;
}

/**
 * 点击站内链接调用的函数, 另链接不跳转而是成为锚点链接
 */
function linkClick(e,tgt){
    var _event=e||event;
    var tgt=tgt||this;
    var linkTarget=tgt.getAttribute("target");
    var tempStr;
    if(tgt.host===window.location.host){
        // var hostchar=this.pathname.slice(this.pathname.indexOf('/')+1,this.pathname.slice(this.pathname.indexOf('/')+1).indexOf('/')+1);
        switch (_event.button){
            case 0:
                if((!linkTarget||linkTarget==='_self')&&(!e.ctrlKey)){
                    window.location.href='#/'+tgt.href.substr(tgt.href.indexOf(tgt.host)+(tgt.host.length)+1);
                    stopPE(e);
                    // if(tempStr=tgt.getAttribute("title")){
                        //     window.document.title=tempStr;
                        // }
                        hashcaller.touchHashListener();
                    return false;
                }
            break;
            case 1:
                // window.open(this.getAttribute('href'));
            break;
            default:
                break;
            }
        }
}
/**
 * 让站内链接失效 链接不跳转而是成为锚点链接
 */
function setupLinkClick(){
    document.addEventListener("click",function(e){
        var tgt=e.target;
        while(tgt.tagName!="HTML"){
            if(tgt.tagName==="A"){
                linkClick(e,tgt);
                break;
            }
            tgt=tgt.parentElement;
        }
    });
}
/**
 * Hashcaller
 */
class Hashcaller{
    constructor(onlyTouchOne=true){
        this.listeners=[];
        /**如果冲突(有多个能够匹配到的表达式)仅取下标大的监听者触发 */
        this.onlyTouchOne=onlyTouchOne;
        this.lastListenerIndex=-1;
        var that=this;
        window.addEventListener("hashchange",function(){that.touchHashListener()});
    }
    /**
     * 添加一个监听者对象 后添加的会比前面的更优先
     * @param {HashListener} listener
     */
    add(listener){
        this.listeners.push(listener);
    }
    /**
     * 添加一个监听者对象数组
     * @param {Array<HashListener>} listeners
     */
    addList(listeners){
        for(var i=listeners.length-1;i>=0;--i){
            this.add(listeners[i]);
        }
    }
    /**
     * 触发 location.hash
     */
    touchHashListener(){
        if((typeof window.lowhash!='undefined')&&(window.lowhash!=location.hash)){
            var regex;
            for(var i=this.listeners.length-1;i>=0;--i)
            if(regex=this.listeners[i].exec(location.hash)){
                this.listeners[i].listener(regex);
                this.lastListenerIndex=i;
                if(this.onlyTouchOne)break;
            }
        }
        window.lowhash=location.hash;
    }
}
/**
 * HashListener obj
 */
class HashListener{
    /**
     * @param {RegExp} regExp       hash的正则表达式
     * @param {Function} listener   监听者 调用时会引用 regExp 的 regex
     * @param {Boolean} filterFlag  选择是否过滤 hash 中的 /^#\// 默认为过滤
     */
    constructor(regExp,listener,filterFlag=true){
        this.hashSelector=regExp;
        this.listener=listener;
        this.filterFlag=filterFlag;
    }
    /**
     * 测试表达式能否匹配字符串
     * @param {String} _string  文本
     */
    exec(_string){
        var string;
        if((this.filterFlag)&&(_string.indexOf("#/")===0)){
            string=_string.slice(2);
        }
        else{
            string=_string;
        }
        return this.hashSelector.exec(string);
    }
}
var hashcaller=new Hashcaller();
/**
 * 将时间类型转换成字符串
 */
(function(){
var temp=Date.prototype.toString;
Date.prototype.toString=OlFunction.create(temp);
/**
 * @param {String} str 用%{控制字符}{长度}控制打印字符: Y-年 M-月 D-日 d-星期几 h-小时 m-分钟 s-秒 如果没有写长度将使用自动长度, 如果长度超出将在前面补0; 例: %Y6-%M2-%D -> 001970-01-1
 */
Date.prototype.toString.addOverload([String],function(str){
    var that=this,
    d={
        Y:that.getFullYear().toString(),
        M:(that.getMonth()+1).toString(),
        D:that.getDate().toString(),
        d:that.getDay().toString(),
        h:that.getHours().toString(),
        m:that.getMinutes().toString(),
        s:that.getSeconds().toString()
    }
    var i,rtn=[],tstr;
    for(i=0;i<str.length;++i){
        if(str[i]==='%'){
            ++i;
            if(d[str[i]]!=undefined){
                var ti=parseInt(str[i+1]),tempstr=[];
                if(isNaN(ti)){
                    tstr=d[str[i]];
                }else{
                    ti=parseInt(str.slice(i+1))
                    if(ti>d[str[i]].length){
                        do{
                            tempstr.push('0');
                            --ti;
                        }while(ti>d[str[i]].length)
                    }
                    tempstr.push(d[str[i]].slice(d[str[i]].length-ti));
                    i+=ti.toString().length;
                    tstr=tempstr.join('');
                }
            // }else if(str[i]==='%'){
            //     tstr='%'
            }else{
                tstr='%'+str[i];
            }
        }else{
            tstr=str[i];
        }
        rtn.push(tstr);
    }
    return rtn.join('');
},"用%{控制字符}{长度}控制打印字符: Y-年 M-月 D-日 d-星期几 h-小时 m-分钟 s-秒 如果没有写长度将使用自动长度; 例: %Y-%M2-%D -> 1970-01-1");
})();