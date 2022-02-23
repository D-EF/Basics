/*!
 * 提供一点dom操作强化
 */

/*
 * @Date: 2022-01-11 16:43:21
 * @LastEditors: Darth_Eternalfaith
 * @LastEditTime: 2022-02-23 20:45:31
 * @FilePath: \def-web\js\basics\dom_tool.js
 */
import {
    arrayDiff,
    arrayEqual,
    array_has_Diff,
    hashcaller,
} from "./Basics.js"

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

/** NodeList 转换为 Array
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


// 强化 对 dom 操作

/**获取所有后代元素*/
if(thisEnvironment.Element)
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
*/
function KeyNotbook(){
    /**@type {Number[]} 记录中的按下的按键 */
    this.downingKeyCodes=[];
    /**@type {Function[]} 动作函数*/
    this.keysdownF  =[];
    /**@type {Number[][]} 组合键记录表*/
    this.keysdownFF =[];
    this.keysupF={};
}
KeyNotbook.prototype={
    constructor:KeyNotbook,
    /** 添加按键事件
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
    /** 移除按键事件
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
    setKey:function(e,tgt){
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
                if(this.keysdownF[i].orderFlag?
                    arrayEqual(this.keysdownFF[i],this.downingKeyCodes):
                    !array_has_Diff(this.keysdownFF[i],this.downingKeyCodes)
                    ){
                    this.keysdownF[i].call(tgt,e);
                    return;
                }
            }
        }
        else{
            for(i=this.keysdownFF.length-1;i>=0;--i){
                if(!this.keysdownF[i].keepFlag&&
                (this.keysdownF[i].orderFlag?arrayEqual(this.keysdownFF[i],this.downingKeyCodes):
                !array_has_Diff(this.keysdownFF[i],this.downingKeyCodes))){
                    this.keysdownF[i].call(tgt,e);
                    return;
                }
            }
        }
    },

    /**抬起按键*/
    removeKey:function(e,tgt){
        var downingKALength=this.downingKeyCodes.length;
        if(downingKALength)
        for(var i=downingKALength-1;i>=0;--i){
            if(e.keyCode===this.downingKeyCodes[i]){
                this.downingKeyCodes.splice(i,1);
                if(this.keysupF[e.keyCode.toString()])this.keysupF[e.keyCode.toString()].call(tgt,e);
                return 0;
            }
        }
    },
    reNB:function(){
        this.downingKeyCodes.length=0;  
    }
}

/** 给element添加按键事件
 * @param {Document} _Element 添加事件的元素
 * @param {Boolean} _keepFlag 按住键盘是否重复触发事件
 * @param {Boolean} _orderFlag 组合键是否需要有序
 * @param {Number||Array} _keycode 按键的 keycode 如果是组合键 需要输入数组
 * @param {Function} _event 触发的事件
 * @param {Boolean} _type false=>down;true=>up
 */
function addKeyEvent(_Element,_keepFlag,_orderFlag,_keycode,_event,_type){
    var thisKeyNotbook,i;
    if(!_Element.keyNotbook){
        _Element.keyNotbook=new KeyNotbook();
        thisKeyNotbook=_Element.keyNotbook;
        _Element.addEventListener("keydown" ,function(e){thisKeyNotbook.setKey(e,this)});
        _Element.addEventListener("keyup"   ,function(e){thisKeyNotbook.removeKey(e,this)});
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
        i=thisKeyNotbook.keysdownF.length-1;
        thisKeyNotbook.keysdownF[i].keepFlag=_keepFlag;
        thisKeyNotbook.keysdownF[i].orderFlag=_orderFlag;
    }
}
/** 移除 element 上的 keyNotBook 的事件
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

/** 给element添加resize事件, 没有 e 事件参数
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
/** 用于复位 addResizeEvent 
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

/** 点击站内链接调用的函数, 另链接不跳转而是成为锚点链接
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
/** 让站内链接失效 链接不跳转而是成为锚点链接
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


export{
    stopPropagation,
    stopEvent,
    stopPE,
    nodeListToArray,
    KeyNotbook,
    addKeyEvent,
    removeKeyEvent,
    addResizeEvent,
    linkClick,
    setupLinkClick
}