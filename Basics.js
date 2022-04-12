/*!
 * Basics.js 应该在所有脚本之前载入
 */

/*
 * @Author: Darth_Eternalfaith
 * @LastEditTime: 2022-04-12 14:16:42
 * @LastEditors: Darth_Eternalfaith
 */
 
/** 当前运行环境 (可能是 window 或 worker)
 */
var thisEnvironment=window||worker||this;
thisEnvironment.thisEnvironment=thisEnvironment;
thisEnvironment.zero=0;

function nullfnc(){}
thisEnvironment.nullfnc=nullfnc;
// if(this.Element&&Element.prototype.attachEvent){
//     Element.prototype.addEventListener=Element.prototype.attachEvent;
// }

/** [judgeOs UA & 内核 判断]
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

Array.prototype.remove=function(item){
    this.splice(this.indexOf(item),1);
}
Array.prototype.insertList=function(index,list){
    var temp=Array.from(list);
    temp.unshift(0);
    temp.unshift(index);
    Array.prototype.splice.apply(this,temp);
}
Array.prototype.get_lastItem=function(){
    return this[this.length-1];
}
Array.prototype.set_lastItem=function(val){
    return this[this.length-1]=val;
}

/** 用 rad 表示的 1deg */
Math.DEG=Math.PI/180;

/** 数组移位
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
/** 获取当前运行脚本的地址
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
        var rExtractUri = /((?:http|https|file):\/\/.*?\/.+?.js):\d+:\d+$/, 
        absPath = rExtractUri.exec(stack);
        return absPath[1] || '';
    }
}
/** 把相对地址转换成绝对地址
 * @param {String} _fileURL 相对路径
 * @param {String} rootURL  起始路径
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
/**对比两个列表项是否相同 (无序)
 * @param {Array}   arr1       要进行比较的数组
 * @param {Array}   arr2       要进行比较的数组
 * @return {Array}    返回差异的内容的数组
 */
// 本来是给KeyNotbook用的 
function arrayDiff(arr1,arr2){
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
    return rtn;
}
/**对比两个列表项是否有差异 (无序)
 * @param {Array}   arr1       要进行比较的数组
 * @param {Array}   arr2       要进行比较的数组
 * @return {Boolean} 是否有差异
 */
function arrayHasDiff(arr1,arr2){
    if(arr1.length!=arr2.length)return true;
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
            return true;
        }
    }
    hash.forEach((value,key)=>{
        if(!value){
            return true;
        }
    });
    return false;
    
}
/** 重载函数类
 * 请使用 OlFunction.create 函数, 写成类的语法纯粹是为了让编辑器认代码提示
 * 
 */
class OlFunction extends Function{
    /** 请使用 OlFunction.create 函数, 写成类的语法纯粹是为了让编辑器认代码提示
     */
    constructor(){
        console.error("请使用 OlFunction.create()");
        /** @type {{parameterType:parameterType,fnc:fnc,codeComments:codeComments}[]} 重载函数 */
        this.ols=[];
        /** @type {function} 默认动作*/
        this.default_fnc=new Function();
    }
    /** 添加一个重载
     * @param {Array} parameterType   形参的类型
     * @param {function}    fnc             执行的函数
     * @param {String}      codeComments    没用的属性, 作为函数的注释
    */
    addOverload(parameterType,fnc,codeComments){
        this.ols.push({parameterType:parameterType,fnc:fnc,codeComments:codeComments});
    }
    // 如果需要ie中使用，把 create 和 addOverload 拷贝走就行
    /** 创建重载函数
     * @param   {function} default_fnc 当没有和实参对应的重载时默认执行的函数
     * @return  {OlFunction} 带重载的函数
     * 用 .addOverload 添加重载
     */
    static create(default_fnc){
        var OverloadFunction=(function(){
            return function(){
                var i=arguments.length-1,j,flag=false;
                var l=arguments.length;
                j=arguments.length-1;
                while(j>=0&&arguments[j]===undefined){--l;--j;};
                for(i=OverloadFunction.ols.length-1;i>=0;--i){
                    if(l===OverloadFunction.ols[i].parameterType.length){
                        flag=true;
                        for(j=l-1;flag&&j>=0;--j){
                            flag=(arguments[j].constructor===OverloadFunction.ols[i].parameterType[j]||arguments[j] instanceof OverloadFunction.ols[i].parameterType[j]);
                        }
                        if(flag)break;
                    }
                }
                if(flag){
                    return OverloadFunction.ols[i].fnc.apply(this,arguments);
                }
                else{
                    return OverloadFunction.default_fnc.apply(this,arguments);
                }
            }
        })();
        OverloadFunction.ols=[];
        OverloadFunction.default_fnc=default_fnc;
        OverloadFunction.addOverload=OlFunction.prototype.addOverload;
        return OverloadFunction;
    }
}

/**继承
 * @param {function} _basics   基类
 * @param {function} _derived  子类
 */
function inheritClass(_basics,_derived){
    // 创建一个没有实例方法的类
    var Super = function(){};
    Super.prototype = _basics.prototype;
    //将实例作为子类的原型
    _derived.prototype = new Super();
}

/** 委托 请使用 Delegate.create() 而不是使用构造函数
 */
class Delegate extends Function{
    /** 请使用 Delegate.create() */
    constructor(){
        this.act_list=[];
        throw new Error("请使用 Delegate.create()");
    }

    /**添加一个委托
     * @param {*} tgt   执行动作的this指向
     * @param {function} act 执行的动作
     * @returns {Delegate} 返回当前
     */
    addAct(tgt,act){
        this.act_list.push({tgt:tgt,act:act});
        return this;
    }
    /**移除一个委托
     * 参数和加入相同
     * @returns {Delegate} 返回当前
     */
    removeAct(tgt,act){
        var i;
        for(i=this.act_list.length-1;i>=0;--i){
            if(this.act_list[i].tgt===tgt&&this.act_list[i].act===act){
                this.act_list.splice(i,1);
                return this;
            }
        }
        return this;
    }
    /** 使用 TGT 移除委托 所有带有相同tgt的委托全部会被移除
     * @param {*} tgt   用添加委托时的tgt属性标识
     * @returns {Delegate} 返回当前
     */
    removeActs_ByTGT(tgt){
        var i=this.act_list.length-1;
        for(;i>0;--i){
            if(this.act_list[i].tgt===tgt){
                this.act_list.splice(i,1);
            }
        }
        return this;
    }   
    /** 创建一个委托对象
     * @returns {Delegate} fnc.apply(delegate.act_list[i].tgt,arguments)
     */
    static create(){
        var delegate=(function(){
            return function(){
                var i=delegate.act_list.length;
                var rtns=new Array(i);
                for(--i;i>=0;--i){
                    rtns[i]={
                        tgt:delegate.act_list[i].tgt,
                        rtn:delegate.act_list[i].act.apply(delegate.act_list[i].tgt,arguments)
                    }
                }
                return rtns;
            }
        })();
        delegate.act_list=[];
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

/** 模版字符串 可以在原字符串中使用 '\\' 屏蔽 插值关键文本
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

/** 将字符串转换成js的类型, 相当于JSON.parse, 如果只是个字符串就是字符串(口胡)
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

/** Hashcaller
 */
class Hashcaller{
    constructor(flag_only_touch_one=true){
        /** @type {RegExp[]} */
        this.listeners=[];
        /**如果冲突(有多个能够匹配到的表达式)仅取下标大的监听者触发 */
        this.flag_only_touch_one=flag_only_touch_one;
        this.last_listener_index=-1;
        var that=this;
        window.addEventListener("hashchange",function(){that.touchHashListener()});
    }
    /** 添加一个监听者对象 后添加的会比前面的更优先
     * @param {HashListener} listener
     */
    add(listener){
        this.listeners.push(listener);
    }
    /** 添加一个监听者对象数组
     * @param {HashListener[]} listeners
     */
    addList(listeners){
        for(var i=listeners.length-1;i>=0;--i){
            this.add(listeners[i]);
        }
    }
    /** 触发 location.hash
     */
    touchHashListener(){
        if((typeof window.lowhash!='undefined')&&(window.lowhash!=location.hash)){
            var regex;
            for(var i=this.listeners.length-1;i>=0;--i)
            if(regex=this.listeners[i].exec(location.hash)){
                this.listeners[i].listener(regex);
                this.last_listener_index=i;
                if(this.flag_only_touch_one)break;
            }
        }
        window.lowhash=location.hash;
    }
}
/** HashListener obj
 */
class HashListener{
    /** 
     * @param {RegExp} regExp       hash的正则表达式
     * @param {function(RegExpExecArray)} listener   监听者 调用时会引用 regExp 的 regex
     * @param {Boolean} filter_flag  选择是否过滤 hash 中的 /^#\// 默认为过滤
     */
    constructor(regExp,listener,filter_flag=true){
        this.hash_selector=regExp;
        this.listener=listener;
        this.filter_flag=filter_flag;
    }
    /** 测试表达式能否匹配字符串
     * @param {String} _string  文本
     */
    exec(_string){
        var string;
        if((this.filter_flag)&&(_string.indexOf("#/")===0)){
            string=_string.slice(2);
        }
        else{
            string=_string;
        }
        return this.hash_selector.exec(string);
    }
}
var hashcaller=new Hashcaller();
/** 将时间类型转换成字符串
 */
(function(){
var temp=Date.prototype.toString;
Date.prototype.toString=OlFunction.create(temp);
/** @param {String} str 用%{控制字符}{长度}控制打印字符: Y-年 M-月 D-日 d-星期几 h-小时 m-分钟 s-秒 如果没有写长度将使用自动长度, 如果长度超出将在前面补0; 例: %Y6-%M2-%D -> 001970-01-1
 */
Date.prototype.toString.addOverload([String],function(str){
    var that=this,
    d={
        Y:that.getFullYear().toString(),
        M:(that.getMonth()+1).toString(),
        D:that.getDate().toString(),
        d:that.getDay().toString(),
        h:that.getHours().toString(),
        m:that.get_Minutes().toString(),
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

// temp
/** 请求 api
 * @param {String} method 请求方式
 * @param {String} url 请求地址
 * @param {function(this: XMLHttpRequest,ProgressEvent<EventTarget>)} callback 回调函数
 * @param {any} body 加在 send 里的实参
 */
 function requestAPI(method,url,callback,body){
    /**@type {XMLHttpRequest} */
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
/** 某字符是否能作为数字的一元
 * @param {char} _char 
 * @return {Boolean}
 */
function canBeNumberChar(_char){
    return ((_char>='1'&&_char<='9')||_char==='0'||('+-.eE'.indexOf(_char)!==-1));
}
/**
 * def牌 广播员
 */
class DEF_Caller{
    constructor(){
        this._listeners=[];
        /** @type {Object<Delegate>} */
        this._callbacks={};
    }
    /** 创建监听者
     * @param {{key:Function}} callbacks 回调函数集合 属性全为 Function 的对象
     * @returns {Array} 返回一个数组
     */
    create_Listener(callbacks){
        var rtn=[];
        this.add_Listener(rtn,callbacks)
        return rtn;
    }
    /** 增加 监听者(订阅者) 
     * @param {*} tgt 监听者 给回调函数当this指向用的
     * @param {{key:Function}} callbacks 回调函数集合 属性全为 Function 的对象
     * @returns {DEF_Caller} 返回当前的对象
     */
    add_Listener(tgt,callbacks){
        var keys=Object.keys(callbacks),
            i=keys.length-1,
            key="";
        
        this._listeners.push(tgt);

        for(;i>=0;--i){
            key=keys[i];
            if(!this._callbacks[key]){
                this._callbacks[key]=Delegate.create();
            }
            this._callbacks[key].addAct(tgt,callbacks[key]);
        }
        return this;
    }
    /** 移除监听者
     * @param {*} tgt 
     * @returns {DEF_Caller}
     */
    remove_Listener(tgt){
        var keys=Object.keys(callbacks),
            i=keys.length-1,
            key="";
        for(;i>=0;--i){
            key=keys[i];
            this._callbacks[key].removeActs_ByTGT(tgt);
        }
        this._listeners.lastIndexOf(tgt);
    }
    call(key){
        var _key=key;
        var args=Array.from(arguments);
        args.shift();
        this._callbacks[_key].apply(this,args);
    }

    /** 预设的 移除 回调, 将对应的项移除
     * @this  {Array}  this指向当前的监听者数据
     * @param {Number} op 被修改的项的下标(起点)
     * @param {Number} length 被修改的长度
     */
    static _remove_Def(op,length){
        this.splice(op,length);
    }
    /** 预设的 插入 回调, 在监听者中插入null
     * @this  {Array}  this指向当前的监听者数据
     * @param {Number} op 被修改的项的下标(起点)
     * @param {Array} values 插入的内容集合
     */
    static _insert_Def(op,values){
        var l=values.length,
            insp=new Array(l);
        for(--l;l>=0;--l){
            insp[l]=null;
        }
        insp.unshift(0);
        insp.unshift(op);
        Array.prototype.splice.apply(this,insp);
    }
    /** 预设的 修改 回调, 将监听者中的与修改的内容相同下标的item设为null
     * @this  {Array}  this指向当前的监听者数据
     * @param {Number} op 被修改的项的下标(起点)
     * @param {Number} ed 被修改的项的下标(终点)
     */
    static _update_Def(op,ed){
        var i=op;
        do{
            this[i]=null;
        }while(i<ed);
    }
}

/** 二分法查找显式查找表
 * @param {Number[]} lut 显式查找表 应为正序排序的 Number 类型数组 (如路径到当前下标指令的长度)
 * @param {Number} val   值     
 * @param {String} key   非必要参数 如果是对象数组, 使用属性作为查找表的关键字
 * @return {Number} 返回对应下标    溢出将直接使用首或尾的值
 */
function select_lut__Binary(lut,val,key){
    var find = false,
        low = 0,
        high = lut.length-1,
        i,
        temp;
    
    while (!find&&low <= high){
        i = parseInt((low+high)*0.5); 
        temp=lut[i];
        if(key){
            temp=temp[key];
        }

        if (val > temp){
            low = i + 1;
        }
        else if(val<=temp&&((lut[i-1]===undefined)||(val>(key?lut[i-1][key]:lut[i-1][key])))){
            return i;
        }
        else{
            high = i - 1;
        }
    }
    return low;
}


Number.copy=Boolean.copy=String.copy=function(tgt){
    return tgt;
}
Object.copy=function(tgt){
    return Object.assign({},tgt);
}
Array.copy=function(tgt){
    return Array.from(tgt);
}
Map.copy=function(tgt){
    return new Map(tgt);
}

class CQRS_Command{
    /** CQRS_History 的命令
     * @param {Boolean} type false 赋值, true 运行成员函数
     * @param {String[]} path 执行操作的路径
     * @param {*[]} _arguments 执行命令时使用的参数
     */
    constructor(type,path,_arguments){
        this.type=type;
        this.path=path;
        this.arguments=_arguments;
    }
    /** 执行动作
     * @param {*} tgt 操作的对象的根
     */
    do(tgt){
        var temp=tgt,
            i=0,
            l=this.path.length-1;
        while(i<l){
            temp=temp[this.path[i]];
            ++i;
        }
        if(this.type){
            temp[this.path[i]].apply(temp[this.path[i]],this.arguments);
        }else{
            temp[this.path[i]]=this.arguments;
        }
    }
}

class CQRS_History{
    /** 
     * @param {*}  
     */
    constructor(obj){
        /** @type {*} 当前图元的根 */
        this._now=obj;
        /** @type {{index:Number,cache:*}[]} 缓存 lut 表 */
        this.lut_cache=[];
        /** @type {CQRS_command[]} 记录的历史指令 */
        this.command=[];
        /** @type {Number} lut查找表的缓存步长 */
        this._lut_cache_step_length=20;

        this.derived_Cache();
    }
    derived_Cache(){
        var obj=this._now;
        if(obj&&obj.constructor.copy){
            this.lut_cache.push({index:this.command.length-1,cache:obj.constructor.copy(obj)});
        }else if(obj&&obj.copy){
            this.lut_cache.push({index:this.command.length-1,cache:obj.copy()});
        }else{
            throw new TypeError("obj must can copy!");
        }
    }
    /**
     * 
     * @param {CQRS_Command} command 
     */
    add_Command(command){
        this.command.push();
        command.do(this._now);
        if(this.lut_cache[this.lut_cache.length].index+this._lut_cache_step_length<=this.command.length){
            this.derived_Cache();
        }
    }

}

/**
 * @typedef HadDependencyObject 使用依赖的对象
 * @property {Map<String,Delegate>} _dependency_mapping_delegates   set时的委托集合
 * @property {Map<String,DependencyMapping_Notbook>} _dependency_mapping_notbook 记录依赖的对象的集合
 */
/**
 * @typedef DependencyMapping_Notbook 记录依赖的item
 * @property {HadDependencyObject} rely_on_TGT 依赖的对象
 * @property {String} rely_on_key 依赖的key
 */

/** 依赖映射 tgt[key] 会得到 rely_on_TGT[key]
 * @param {HadDependencyObject} tgt 要操作的对象
 * @param {*} rely_on_TGT     数据来源
 * @param {String[]} keys   tgt上的key
 * @param {String[]} [_rely_on_keys] 可选参数 relyOnTGT上的key, 下标和keys要对应
 * @return {HadDependencyObject} 返回 tgt 
 */
function dependencyMapping(tgt,rely_on_TGT,keys,_rely_on_keys){
    var rely_on_keys=_rely_on_keys||keys;
    var map=tgt._dependency_mapping_notbook;
    if(!map){
        map=tgt._dependency_mapping_notbook=new Map();
    }
    for(let i=keys.length-1;i>=0;--i){
        Object.defineProperty(tgt,keys[i],{
            get() { return rely_on_TGT[rely_on_keys[i]]; },
            /** @this {HadDependencyObject} */
            set(val){
                var old=rely_on_TGT[rely_on_keys[i]];
                rely_on_TGT[rely_on_keys[i]]=val;
                this._dependency_mapping_delegates&&
                this._dependency_mapping_delegates.has(keys[i])&&
                this._dependency_mapping_delegates.get(keys[i])(old,val,rely_on_TGT,this);
            }
        });
        map.set(keys[i],{rely_on_TGT:rely_on_TGT,rely_on_key:rely_on_keys[i]});
    }
    return tgt;
}
/** 寻找依赖的根部
 * @param {*} tgt 使用了依赖的对象
 * @param {String} key key
 * @return {{root:DependencyMapping_Notbook,head:DependencyMapping_Notbook}} 返回根部对象(数据来源) 和 第一次派生依赖的对象 和 key
 */
function get_root__DependencyMapping(tgt,_key){
    var root={rely_on_TGT:tgt ,rely_on_key:_key},
        head={rely_on_TGT:root,rely_on_key:_key},
        map=tgt._dependency_mapping_notbook,
        key=_key;
    while(map&&map.has(key)){
        head=root;
        root=map.get(key);
        map=root.rely_on_TGT._dependency_mapping_notbook;
        key=root.rely_on_key;
    }
    return {root:root,head:head};
}
/** 添加依赖的数据修改时的委托; 注意: 当直接使用root对象进行修改时 委托不会被执行
 * @param {HadDependencyObject} tgt 使用了依赖的对象
 * @param {String} key 对象上的key
 * @param {function} callback 回调函数 callback(old_value,new_val,root_data,head_dependency) this 指向 tgt, 不能在这里再给属性赋值; 如果必要,直接修改root的内容
 */
function add_DependencyListener(tgt,key,callback){
    var temp=get_root__DependencyMapping(tgt,key);
    var handMain=temp.head;
    if(!handMain.rely_on_TGT._dependency_mapping_delegates){
        handMain.rely_on_TGT._dependency_mapping_delegates=new Map();
    }
    if(!handMain.rely_on_TGT._dependency_mapping_delegates.has(handMain.rely_on_key)){
        handMain.rely_on_TGT._dependency_mapping_delegates.set(handMain.rely_on_key,Delegate.create());
    }
    handMain.rely_on_TGT._dependency_mapping_delegates.get(handMain.rely_on_key).addAct(tgt,callback);
}

class  Iterator__MyVirtual{
    constructor(data){
        this.data=data;
    }
    /** 初始化
     * @virtual
     */
    init(){}
    
    /** 是否遍历完
     * @virtual
     */
    judge_IsNotEnd(){}

    /** 下一个
     * @virtual
     */
    next(){}
    
    /** 当前数据
     * @virtual
     * @return {*} 返回当前
     */
    get_Now(){}
}

/**
 * @typedef TreeNode 缺血模型的树节点
 * @property {*} data 
 * @property {*[]} children 
 */

class Iterator__Tree extends Iterator__MyVirtual{
    /** 树结构迭代器器
     * @param {TreeNode} data 
     * @param {String} childrenKey 
     */
    constructor(data,childrenKey="children"){
        super(data);
        this.childrenKey=childrenKey;
        this._gi=[];
        this._gg=[];
        this._path=[];
    }
    /** 获取子节点列表
     * @param {TreeNode} item 
     * @returns {Array}
     */
    _get_Itemchildren(item){
        if(this.childrenKey){
            return item[this.childrenKey];
        }else{
            return item;
        }
    }
    /** 获取目标深度的父节点
     * @param {Number} depth 
     * @returns {TreeNode}
     */
    _get_Parent(depth){
        return (depth?this._gg[depth-1]:this.data);
    }
    init(){
        this._depth=0;
        this._t_depth=0;
        this._gi.length=1;
        this._gi[0]=0;
        this._path.length=1
        this._path[0]=0;
        this._gg.length=1;
        this._gg[0]=this.data;
        this._di=0;
        this.next();
        if(!this._get_Itemchildren(this.data).length){
            this._depth=-1;
        }
    }
    judge_IsNotEnd(){
        return this._depth>=0;
    }
    next(){
        this._di++;
        var gg=this._gg,
        path=this._path,
        gi=this._gi,
        d=this._t_depth,
        od=this._depth;
        if(d<0){
            this._depth=d;
            return;
        }
        gg[d]=this._get_Itemchildren(this._get_Parent(d))[gi[d]];
        path.length=d+1;
        path[d]=gi[d];
        this._now_path=Array.from(path);
        do{
            if(gg[d]!=undefined){
                od=d;
                this._depth=od;
                if(this._get_Itemchildren(gg[d]).length){
                    // 下潜
                    ++d;
                    gi[d]=0;
                    gg[d]=this._get_Itemchildren(this._get_Parent(d))[gi[d]];
                }
                else{
                    // 上潜
                    gi[d]++;
                    if(this._get_Itemchildren(this._get_Parent(d))[gi[d]]===undefined){
                        break;
                    }
                }
                this._t_depth=d;
                return;
            }
        }while(0);
        do{
            --d;
            ++gi[d];
        }while(d>=0&&((gg[d]=this._get_Itemchildren(this._get_Parent(d))[gi[d]])===undefined));
        // this._depth=od;
        this._t_depth=d;
    }
    get_Now(){
        return this._gg[this._depth];
    }
    /** 获取当前路径
     * @returns {Number[]} 返回下标形式的路径
     */
    get_now__Path(){
        return this._now_path;
    }
    /** 获取当前迭代的次数
     * @returns {Number} 当前是第几次迭代
     */
    get_now__Di(){
        return this._di;
    }
    /** 获取当前迭代的次数
     * @returns {Number} 当前是第几次迭代
     */
    get_now__Depth(){
        return this._depth;
    }
}

export {
    judgeOs,
    arrayMove,
    getCurrAbsPath,
    rltToAbs,
    arrayEqual,
    arrayDiff,
    arrayHasDiff,
    OlFunction,
    inheritClass,
    Delegate,
    encodeHTML,
    decodeHTML,
    templateStringRender,
    strToVar,
    Hashcaller,
    HashListener,
    hashcaller,
    requestAPI,
    download,
    canBeNumberChar,
    DEF_Caller,
    select_lut__binary,
    CQRS_Command,
    CQRS_History,
    dependencyMapping,
    get_root__dependencyMapping,
    add_dependencyListener,
    Iterator__MyVirtual,
    Iterator__Tree,
};