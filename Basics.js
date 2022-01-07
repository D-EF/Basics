/*!
 * Basics.js 应该在所有脚本之前载入
 */

/*
 * @Author: Darth_Eternalfaith
 * @LastEditTime: 2022-01-05 14:44:11
 * @LastEditors: Darth_Eternalfaith
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
 * 数组移位
 * @param {Array}  arr  数组
 * @param {Number} l    移动步长
 * @returns {Array} 返回一个新数组
 */
function arrayMove(arr,l){
    if(arr.length===0) return [];
    var arr=[].concat(arr);
    var ll=Math.abs(l)%arr.length;
    if(ll===0)return arr;
    var temp;
    if(l<0){
        temp=arr.splice(0,ll);
        return arr.concat(temp);
    }else{
        temp=arr.splice(arr.length-ll,Infinity)
        return temp.concat(arr);
    }
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
 * @returns {Node[]} 保留引用的链接
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
/**对比两个列表项是否相同 (无序)
 * @param {Array}   a1       要进行比较的数组
 * @param {Array}   a2       要进行比较的数组
 * @return {Boolean}    返回是否相同
 */
// 本来是给KeyNotbook用的 
function arrayDiff(a1,a2){
    var hash=new Map();
    var rtn=[];
    var i;
    for(i=arr1.length-1;i>=0;--i){
        hash.set(arr1[i],false);
    }
    for(i=arr2.length-1;i>=0;--i){
        if(hash.has(arr2[i])){
            hash.set(arr2[i],true);
        }else{
            rtn.push(arr2[i]);
        }
    }
    hash.forEach((value,key)=>{
        if(!value){
            rtn.push(key);
        }
    });
    return rtn.length;
}
/** 重载函数类 */
class OlFunction extends Function{
    // 写成类的语法纯粹是为了让编辑器认代码提示
    
    /**
     * 请使用 OlFunction.create 函数
     */
    constructor(){
        console.error("请使用 OlFunction.create()");
        /** @type {{parameterType:parameterType,fnc:fnc,codeComments:codeComments}[]} 重载函数 */
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
 * @returns {{str:String,hit:String[]}}
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
            if(arrayDiff(this.keysdownFF[i],keycode).length){
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
                if(arrayDiff(this.keysdownFF[i],this.downingKeyCodes).length){
                    this.keysdownF[i].call(this.FElement,e);
                    return;
                }
            }
        }
        else{
            for(i=this.keysdownFF.length-1;i>=0;--i){
                if(arrayDiff(this.keysdownFF[i],this.downingKeyCodes).length&&!this.keysdownF.keepFlag){
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
     * @type {Function[]}
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
     * @returns {String[][]}
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
         * @param {String[]} _cl 指令的字符串数组
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
 * @param {String[]} _nameList 文件名列表
 * @param {String[]} _afertList 后缀名列表
 * @param {Function} callBack 搜索完成的回调函数 callBack({String[]}); 参数是搜索到的所有文件路径的列表
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
     * @param {DEF_MediaObjMark[]} DEF_MediaObjMarkArray DEF_MediaObjMark 的数组
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
 * @return {DEF_MediaObj[]} 返回 DEF_MediaObj 数组
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
     * @param {HashListener[]} listeners
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



/**
 * 在 (0,0) 与 (1,1) 之间的三阶贝塞尔曲线
 * @param {Number} p1x (0,0) 的 控制点 的 x 坐标
 * @param {Number} p1y (0,0) 的 控制点 的 y 坐标
 * @param {Number} p2x (1,1) 的 控制点 的 x 坐标
 * @param {Number} p2y (1,1) 的 控制点 的 y 坐标
 */
 function UnitBezier(p1x,p1y,p2x,p2y) {
    //该贝塞尔曲线的a、b、c计算和获取坐标来自:https://www.cnblogs.com/yanan-boke/p/8875571.html
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

/**
 * 贝塞尔曲线求pt点 算法来自 https://pomax.github.io/bezierinfo/zh-CN/index.html
 * @param {{x:Number,y:Number}[]} points 控制点集合
 * @param {Number} t t参数
 * @returns {{x:Number,y:Number}} 返回对应点
 */
function getBezierCurvePoint_deCasteljau(points,t){
    if(points.length>1){
        var newPoints=new Array(points.length-1);
        var x,y;
        var td=1-t;
        for(var i=newPoints.length-1;i>=0;--i){
            x=td*points[i].x+t*points[i+1].x;
            y=td*points[i].y+t*points[i+1].y;
            newPoints[i]={x:x,y:y};
        }
        return getBezierCurvePoint_deCasteljau(newPoints,t);
    }else{
        return points[0];
    }
}

/**
 * 矩阵乘法
 * @param {Number[][]} m1 左侧矩阵
 * @param {Number[][]} m2 右侧矩阵
 */
function matrixMULT(m1,m2){
    if(m1[0].length!=m2.length) throw new Error("矩阵乘法格式错误");

    var rtn=new Array(m1.length);
    for(var i=rtn.length-1;i>=0;--i){
        rtn[i]=new Array(m2[0].length);
    }

    var i=0,j=0,k=0;
    do{
        j=0
        do{
            k=0;
            var temp=0;
            do{
                temp+=m1[i][k]*m2[k][j];
                ++k;
            }while(k<m1[0].length);
            rtn[i][j]=temp;
            ++j;
        }while(j<m2[0].length);
        ++i;
    }while(i<m1.length);
    return rtn;
}

/**
 * @type {Number[][]} 帕斯卡三角
 */
const Pascals_Triangle=[[1]];
calc_Pascals_Triangle(3);
/**
 * 演算帕斯卡三角
 * @param {Number} n 到多少阶停止
 * @returns 返回帕斯卡三角 的 不规则二维数组, 别修改内容返回值的内容!
 */
function calc_Pascals_Triangle(n){
    var i,j;
    var rtn=Pascals_Triangle;
    for(i=rtn.length;i<=n;++i){
        rtn.push([]);
        for(j=0;j<i+1;++j){
            rtn[i].push((rtn[i-1][j]||0)+(rtn[i-1][j-1]||0));
        }
    }
    return rtn;
}

const Bezier_Matrixs=[[1]];
/**
 * 贝塞尔曲线的矩阵 
 * @param {Number} n n阶贝塞尔曲线
 */
function get_Bezier_Matrix(n){
    if(Bezier_Matrixs[n])return Bezier_Matrixs[n];

    if(Pascals_Triangle.length<=n)calc_Pascals_Triangle(n);
    var i,j,f;
    var m=new Array(n+1);
    for(i=n;i>=0;--i){
        m[i]=new Array(i+1);
        for(j=i,f=1;j>=0;--j){
            m[i][j]=Pascals_Triangle[i][j]*Pascals_Triangle[n][i]*f;
            f*=-1;
        }
    }
    Bezier_Matrixs.length=n+1;
    Bezier_Matrixs[n]=m;
    return m;
}

/**
 * 用控制点得到各次幂的系数
 * @param {Number[]} points 控制点集合
 */
function get_Bezier_Coefficient(points){
    var n=points.length-1;
    var m=get_Bezier_Matrix(n);
    var rtn=new Array(points.length);
    var i,j,temp;
    for(i=n;i>=0;--i){
        temp=0;
        for(j=i;j>=0;--j){
            temp+=m[i][j]*points[j];
        }
        rtn[i]=temp;
    }
    return rtn;
}

/**
 * 求贝塞尔曲线的导函数的控制点 (一维)
 * @param {Number[]} points 原曲线的控制点集合 
 * @returns {Number[]} 导函数的控制点
 */
 function bezierDerivatives_points(points){
    var n=points.length-2;
    var rtn=new Array(n+1);
    if(n<0)return {x:0,y:0}
    for(var i=n;i>=0;--i){
        rtn[i]=n*(points[i+1]-points[i])
    }
    return rtn;
}

/**
 * 计算贝塞尔曲线分割时使用的 Q 矩阵 (不补零)
 * @param {Number} n  n阶贝塞尔曲线
 * @param {Number} t  t参数 0~1
 */
 function createBezierCutMatrix_Q(n,t){
    if(Pascals_Triangle.length<=n){
        calc_Pascals_Triangle(n);
    }
    var i,j,k;
    var rtn=new Array(n+1);
    for(i=n;i>=0;--i){
        rtn[i]=Pascals_Triangle[i].concat();
    }
    var temp=t,
        td=t-1;
    // i 是行下标, j 是列下标
    for(i=1;i<=n;++i,temp*=t){
        for(j=i;j<=n;++j){
            rtn[j][i]*=temp;
        }
    }
    temp=-td;
    for(i=n-1;i>=0;--i,temp*=-td){
        for(j=i,k=n;j>=0;--j,--k){
            rtn[k][j]*=temp;
        }
    }
    return rtn;
}

/**
 * 用矩阵分割贝塞尔曲线
 * @param {Number[]} points        控制点集合
 * @param {Number[][]} matrix 分割时使用的矩阵, 用 createBezierCutMatrix_Q 函数生成
 * @param {Boolean} flag 前后两边 false(0)为p1起点, true(!0)为p4终点
 */
function bezierCut_By_Matrix(points,matrix,flag){
    var n=points.length-1,
        i,j,
        rtn=new Array(points.length),
        temp;

    //j是行下标 i是列下标
    if(flag){
        // pt起点, p4终点
        for(i=n;i>=0;--i){
            temp=0;
            for(j=i;j>=0;--j){
                temp+=points[n-j]*matrix[i][j];
            }
            rtn[n-i]=temp;
        }
    }else{
        // p1起点, pt终点
        for(i=n;i>=0;--i){
            temp=0;
            for(j=i;j>=0;--j){
                temp+=points[j]*matrix[i][j];
            }
            rtn[i]=temp;
        }
    }
    return rtn;
}

/**
 * 求二次函数的根
 * @param {Number} a 2次系数 
 * @param {Number} b 1次系数 
 * @param {Number} c 0次系数 
 * @returns 
 */
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
/**
 * 三次函数曲线求单调性(极点)
 * @param {Number} a 3次系数
 * @param {Number} b 2次系数
 * @param {Number} c 1次系数
 * @returns {Number[]} 
 */
function monotonicityOfCubic(a,b,c){
    var d=zeroOfSquare(3*a,2*b,c);
    if(d.length!==2){
        return [];
    }
    return [
        ((a * d[0] + b) * d[0] + c) * d[0],
        ((a * d[1] + b) * d[1] + c) * d[1]
    ]
}
/**
 * 解二元一次方程
 * z1+o1*x=z2+o2*y;
 * z3+o3*x=z4+o4*y;
 * @returns {{x:Number,y:Number}} 
 */
function binaryLinearEquation(z1,o1,z2,o2,z3,o3,z4,o4){
    var x=(z2*o4+o2*z3-z4*o2-z1*o4)/(o1*o4-o2*o3),
        y=(z3+o3*x-z4)/o4;
    return {x:x,y:y};
}

/**
 * 近似相等, 用于浮点误差计算后判断结果是否相近; 
 * @param {Number} num1 数字
 * @param {Number} num2 数字
 * @param {Number} tolerance 容差， 默认为 1e-12
 */
 function approximately(num1,num2,tolerance){
    return Math.abs(num1-num2)<(tolerance||1e-12);
}

/**
 * 多次函数的导数
 * @param {Number[]} coefficients 各次幂的系数 [1, t^1, t^2, t^3, ...]
 * @returns {Number[]}  导数的各次幂的系数 [1, t^1, t^2, t^3, ...] 长度会比形参少 1
 */
 function derivative(coefficients){
    var i=coefficients.length-1,
        rtn=new Array(i);
    for(;i>0;--i){
        rtn[i-1]=coefficients[i]*i;
    }
    return rtn;
}

/**
 * 解一元三次方程, ax^3+bx^2+cx+d=0
 * @param {Number[]} coefficient 系数集合从低次幂到高次幂 [ 1, x, x^2, x^3 ]
 * @returns {Number[]} 返回根的集合
 */
function root_of_1_3(coefficient){
    var a=coefficient[2]||0,
        b=coefficient[1]||0,
        c=coefficient[0]||0,
        d=coefficient[3]||0;

    //一元一至三次函数求根公式编程表示 来自 https://pomax.github.io/bezierinfo/zh-CN/index.html#extremities
    
    // Quartic curves: Cardano's algorithm.

    // do a check to see whether we even need cubic solving:
    if (approximately(d, 0)) {
        // this is not a cubic curve.
        if (approximately(a, 0)) {
            // in fact, this is not a quadratic curve either.
            if (approximately(b, 0)) {
                // in fact in fact, there are no solutions.
                return [];
            }
            // linear solution
            return [-c / b];
        }
        // quadratic solution
        var k=b * b - 4 * a * c;
        if(k<0)return [];
        var q = Math.sqrt(k), a2 = 2 * a;
        return [(q - b) / a2, (-b - q) / a2];
    }
    
    a /= d;
    b /= d;
    c /= d;

    var p = (3 * b - a * a) / 3,
        p3 = p / 3,
        q = (2 * a * a * a - 9 * a * b + 27 * c) / 27,
        q2 = q / 2,
        discriminant = q2 * q2 + p3 * p3 * p3;

    // and some variables we're going to use later on:
    var u1, v1, root1, root2, root3;

    // three possible real roots:
    if (discriminant < 0) {
        var mp3 = -p / 3,
            mp33 = mp3 * mp3 * mp3,
            r = Math.sqrt(mp33),
            t = -q / (2 * r),
            cosphi = t < -1 ? -1 : t > 1 ? 1 : t,
            phi = Math.acos(cosphi),
            crtr = root_of_1_3.cuberoot(r),
            t1 = 2 * crtr;
        root1 = t1 * Math.cos(phi / 3) - a / 3;
        root2 = t1 * Math.cos((phi + 2 * Math.PI) / 3) - a / 3;
        root3 = t1 * Math.cos((phi + 4 * Math.PI) / 3) - a / 3;
        return [root1, root2, root3];
    }

    // three real roots, but two of them are equal:
    if (discriminant === 0) {
        u1 = q2 < 0 ? root_of_1_3.cuberoot(-q2) : -root_of_1_3.cuberoot(q2);
        root1 = 2 * u1 - a / 3;
        root2 = -u1 - a / 3;
        return [root1, root2];
    }

    // one real root, two complex roots
    var sd = Math.sqrt(discriminant);
    u1 = root_of_1_3.cuberoot(sd - q2);
    v1 = root_of_1_3.cuberoot(sd + q2);
    root1 = u1 - v1 - a / 3;
    return [root1];
}
root_of_1_3.cuberoot=function(v){
    return v < 0?-Math.pow(-v, 1 / 3) : Math.pow(v, 1 / 3);
}

/**
 * 通过系数创建贝塞尔曲线控制点
 * @param {Number[]}    coefficient 
 * @returns {Number[]}  
 */
function coefficientToPoints(coefficient){
    var n=coefficient.length,
        rtn=new Array(n),
        m=get_Bezier_Matrix(--n),
        temp;
    
    for(var i=0;i<=n;++i){
        temp=coefficient[i];
        for(var j=0;j<i;++j){
            temp-=rtn[j]*m[i][j]
        }
        rtn[i]=temp/m[i][j];
    }
    return rtn;
}