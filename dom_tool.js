/*!
 * 提供一点dom操作强化
 */

/*
 * @Date: 2022-01-11 16:43:21
 * @LastEditors: Darth_Eternalfaith
 * @LastEditTime: 2022-05-14 11:31:42
 * @FilePath: \PrimitivesTGT-2D_Editor\js\import\basics\dom_tool.js
 */
import {
    arrayDiff,
    arrayEqual,
    arrayHasDiff,
    canBeNumberChar,
    hashcaller,
} from "./Basics.js"

/** 阻止事件冒泡 */
function stopPropagation(e){e.stopPropagation();window.event.cancelBubble=true;}

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
window.stopPE=stopPE;
window.stopEvent=stopEvent;
window.stopPropagation=stopPropagation;

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
if(globalThis.Element)
Element.prototype.getChildElement=function(){
    var chE=[];
    var _chE=this.children;
    for(var i=0;i<_chE.length;++i){
        chE.push(_chE[i])
        chE=chE.concat((_chE[i].getChildElement()));
    }
    return chE;
}

/** @type {*} keyCode to code的映射表 */
KeyNotbook.mapping__keyCode_code={'27':'escape','112':'f1','113':'f2','114':'f3','115':'f4','116':'f5','117':'f6','118':'f7','119':'f8','120':'f9','121':'f10','122':'f11','123':'f12','145':'scrolllock','19':'pause','192':'backquote','49':'digit1','50':'digit2','51':'digit3','52':'digit4','53':'digit5','54':'digit6','55':'digit7','56':'digit8','57':'digit9','48':'digit0','189':'minus','187':'equal','8':'backspace','45':'insert','36':'home','33':'pageup','144':'numlock','111':'numpaddivide','106':'numpadmultiply','109':'numpadsubtract','9':'tab','81':'keyq','87':'keyw','69':'keye','82':'keyr','84':'keyt','89':'keyy','85':'keyu','73':'keyi','79':'keyo','80':'keyp','219':'bracketleft','221':'bracketright','220':'backslash','46':'delete','35':'end','34':'pagedown','36':'numpad7','38':'numpad8','33':'numpad9','107':'numpadadd','20':'capslock','65':'keya','83':'keys','68':'keyd','70':'keyf','71':'keyg','72':'keyh','74':'keyj','75':'keyk','76':'keyl','186':'semicolon','222':'quote','13':'enter','37':'numpad4','12':'numpad5','39':'numpad6','90':'keyz','88':'keyx','67':'keyc','86':'keyv','66':'keyb','78':'keyn','77':'keym','188':'comma','190':'period','191':'slash','16':'shift','38':'arrowup','35':'numpad1','40':'numpad2','34':'numpad3','13':'numpadenter','17':'control','91':'metaleft','18':'alt','32':'space','93':'contextmenu','37':'arrowleft','40':'arrowdown','39':'arrowright','45':'numpad0','46':'numpaddecimal'};
/** 
 * @param {Number|String} _val 
 * @returns {String} 返回 code
 */
KeyNotbook.toCode=function(_val){
    var val=_val;
    if(val.constructor===Number||val instanceof Number){
        return KeyNotbook.mapping__keyCode_code[val];
    }else if(val.constructor===String||val instanceof String){
        if(canBeNumberChar(val[0])&&((!val[1])||canBeNumberChar(val[1]))){
            return KeyNotbook.mapping__keyCode_code[val];
        }
        val=val.toLowerCase();
        if(val.indexOf("shift")!=-1){
            return "shift";
        }
        if(val.indexOf("control")!=-1){
            return "control";
        }
        if(val.indexOf("ctrl")!=-1){
            return "control";
        }
        if(val.indexOf("alt")!=-1){
            return "alt";
        }
        return val;
    }
}

/**按键记录器key notbook
*/
function KeyNotbook(){
    /**@type {String[]} 记录中的按下的按键 列表项为 KeyboardEvent.code */
    this.downing_key_codes=[];
    /**@type {function(this:Element,KeyboardEvent)[]} 动作函数*/
    this.keys_down_fuc  =[];
    /**@type {String[][]} 组合键记录表 列表项为 KeyboardEvent.code*/
    this.keys_down_table =[];
    this.keys_up_fnc={};
    this.state={
        base:{
            keys_down_fuc:this.keys_down_fuc,
            keys_down_table:this.keys_down_table
        }
    }
}
KeyNotbook.prototype={
    /** 变更状态以替换key事件 
     * @param {String} key 状态的key，初始状态为 base
     */
    change_State:function(key){
        if(!this.state[key]){
            this.state[key]={
                keys_down_fuc:[],
                keys_down_table:[]
            }
        }
        var state=this.state[key];
        this.keys_down_fuc   =state.keys_down_fuc
        this.keys_down_table =state.keys_down_table
    },
    constructor:KeyNotbook,
    /** 添加按键事件
     * @param {Number|String|(Number|String)[]} keycode 触发回调的按键 keycode, 接受 数字(keyCode) or 字符串(code) or 数组
     * @param {function(this:Element,KeyboardEvent)} func 触发后的回调函数
     */
    setDKeyFunc:function(keycode,func){
        if(!keycode||!func){
            return -1;
        }if(keycode.constructor===Array||keycode instanceof Array){
            var i,temp=new Array(keycode.length);
            for(i=keycode.length-1;i>=0;--i){
                temp[i]=KeyNotbook.toCode(keycode[i]);
            }
            this.keys_down_table.push(temp);
        }else{
            this.keys_down_table.push([KeyNotbook.toCode(keycode)]);
        }
        this.keys_down_fuc.push(func);
    },
    /** 移除按键事件
     * @param {Number|Array} _keycode 触发回调的按键 keycode, 接受 数字 或者 数组
     * @param {function(this:Element,KeyboardEvent)} func 触发后的回调函数
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
        for(var i=this.keys_down_table.length-1;i>=0;--i){
            if(arrayDiff(this.keys_down_table[i],keycode).length){
                if(this.keys_down_fuc[i]===func){
                    this.keys_down_fuc.splice(i,1);
                    this.keys_down_table.splice(i,1);
                    break;
                }
            }
        }
    },

    /**按下新按键
     * @param {KeyboardEvent} e 事件对象
     * @param {Element} tgt 事件触发的元素
     * @returns 
     */
    setKey:function(e,tgt){
        var flag=false;
        var i=0;
        var downingKALength=this.downing_key_codes.length;
        var code=KeyNotbook.toCode(e.code||e.keyCode);
        if(downingKALength)
        for(var j=downingKALength-1;j>=0;--j){
            if(flag)break;
            flag=code===this.downing_key_codes[j];
            i++;
        }
        if(!flag){
            // 有新的按键按下
            this.downing_key_codes[i]=code;
            for(i=this.keys_down_table.length-1;i>=0;--i){
                if(this.keys_down_fuc[i].orderFlag?
                    arrayEqual(this.keys_down_table[i],this.downing_key_codes):
                    !arrayHasDiff(this.keys_down_table[i],this.downing_key_codes)
                    ){
                    this.keys_down_fuc[i].call(tgt,e);
                    return;
                }
            }
        }
        else{
            for(i=this.keys_down_table.length-1;i>=0;--i){
                if(!this.keys_down_fuc[i].keepFlag&&
                (this.keys_down_fuc[i].orderFlag?arrayEqual(this.keys_down_table[i],this.downing_key_codes):
                !arrayHasDiff(this.keys_down_table[i],this.downing_key_codes))){
                    this.keys_down_fuc[i].call(tgt,e);
                    return;
                }
            }
        }
    },

    /**抬起按键
     * @param {KeyboardEvent} e 事件对象
     * @param {Element} tgt     事件触发的元素
     * @returns 
     */
    removeKey:function(e,tgt){
        var code=KeyNotbook.toCode(e.code||e.keyCode);
        var downingKALength=this.downing_key_codes.length;
        if(downingKALength)
        for(var i=downingKALength-1;i>=0;--i){
            if(code===this.downing_key_codes[i]){
                this.downing_key_codes.splice(i,1);
                if(this.keys_up_fnc[code])this.keys_up_fnc[code].call(tgt,e);
                return 0;
            }
        }
    },
    reNB:function(){
        this.downing_key_codes.length=0;  
    }
}

/** 给element添加按键事件 当有冲突时，后添加的事件触发后不会再触发之前的
 * @param {Element} _Element 添加事件的元素
 * @param {Boolean} _keepFlag 按住键盘是否重复触发事件
 * @param {Boolean} _orderFlag 组合键是否需要有序
 * @param {Number|Array} _keycode 按键的 keycode 如果是组合键 需要输入数组
 * @param {function(this:Element,KeyboardEvent)} act_fnc 触发的动作函数
 * @param {Boolean} _type false=>down;true=>up 注意up只能有一个按键
 */
function addKeyEvent(_Element,_keepFlag,_orderFlag,_keycode,act_fnc,_type){
    var thisKeyNotbook,i;
    if(!_Element.keyNotbook){
        _Element.keyNotbook=new KeyNotbook();
        thisKeyNotbook=_Element.keyNotbook;
        _Element.addEventListener("keydown" ,function(e){thisKeyNotbook.setKey(e,this)});
        _Element.addEventListener("keyup"   ,function(e){thisKeyNotbook.removeKey(e,this)});
        _Element.addEventListener("focuslose",function(e){thisKeyNotbook.reNB()});
    }
    else{
        thisKeyNotbook=_Element.keyNotbook;
    }
    if(_type){
        thisKeyNotbook.keys_up_fnc[_keycode.toString()]=act_fnc;
    }
    else{
        thisKeyNotbook.setDKeyFunc(_keycode,act_fnc);
        i=thisKeyNotbook.keys_down_fuc.length-1;
        thisKeyNotbook.keys_down_fuc[i].keepFlag=_keepFlag;
        thisKeyNotbook.keys_down_fuc[i].orderFlag=_orderFlag;
    }
}
/** 移除 element 上的 keyNotBook 的事件
 * @param {Element} _Element 
 * @param {Number|Array} _keycode 
 * @param {function(this:Element,KeyboardEvent)} act_fnc 这个函数应该与 addKeyEvent 时使用的保持一致
 * @param {Boolean} _type false=>down;true=>up
 */
function removeKeyEvent(_Element,_keycode,act_fnc,_type){
    if(_Element.keyNotbook){
        var thisKeyNotbook=_Element.keyNotbook;
        if(_type){
            delete thisKeyNotbook.keys_up_fnc[_keycode.toString()];
        }
        else{
            thisKeyNotbook.removeDKeyFunc(_keycode,act_fnc);
        }
    }
}



/** 给element添加resize事件, 没有 e 事件参数
 * @param {HTMLElement} _element 绑定的元素
 * @param {function(this:Element)} _listener 触发的函数 没有 e 事件参数
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

        var m_Resize=function(){
            if(lowWidth!=_element.offsetWidth||lowHeight!=_element.offsetHeight){
                                lowWidth=_element.offsetWidth;
                lowHeight=_element.offsetHeight;
                for(var i=_element.resizeListener.length-1;i>=0;--i){
                    _element.resizeListener[i].call(_element);
                }
                if(maxWidth<lowWidth||maxHeight<lowWidth)
                maxWidth=lowWidth*9999,maxHeight=lowWidth*9999;
                mark2C.style.cssText=`width:${maxWidth}px;height:${maxHeight}px;`;
            }
        },
        m_scroll=function(e){
            m_Resize();
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
/** 移除 addResizeEvent 给element添加resize事件
 * @param {HTMLElement} _element 
 * @param {function(this:Element)} _listener 
 * @returns 
 */
function removeResizeEvent(_element,_listener){
    if(_element.resizeMarkFlag){
        element.resizeListener.splice(element.resizeListener.indexOf(_listener),1);
        return 1;
    }
    return 0;
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

/** @type {String[]} 自定义事件类型记录表 */
HTMLElement._event_type=[];
/** @type {function(this:Element,Element)[]} 注册触发自定义事件类型的函数 */
HTMLElement._event_touch_fnc=[];

/** 增加 dom 事件类型
 * @param {String} type 事件类型名 
 * @param {function(this:Element,Element)} func_for_registeCustomEvent  用于注册的触发事件的函数
 * 要在函数中执行 this.dispatchEvent(e); e 为对应 type 的 事件对象 (建议使用 new CustomEvent())
 */
function addEventType(type,func_for_registeCustomEvent){
    HTMLElement._event_type.push(type);
    HTMLElement._event_touch_fnc.push(func_for_registeCustomEvent);
}

var _addEventListener=HTMLElement.prototype.addEventListener;
HTMLElement.prototype.addEventListener=function(type,listener){
    if(HTMLElement._event_touch_fnc[HTMLElement._event_type.indexOf(type)]){
        if(!this._custom_Event_registry){
            this._custom_Event_registry={};
        }
        if(!this._custom_Event_registry[type]){
            this._custom_Event_registry[type]=[listener];
            HTMLElement._event_touch_fnc[HTMLElement._event_type.lastIndexOf(type)].call(this,this);
        }else{
            this._custom_Event_registry[type].push(listener);
        }
    }
    _addEventListener.apply(this,arguments);
}

// 增加焦点丢失事件
addEventType("focuslose",function(tgt){
    tgt.addEventListener("focusout",function(e){
        tgt.focusloseFlag=true;
        setTimeout(function(){
            var temp=document.activeElement;
            while(temp&&(!(temp===tgt))){
                temp=temp.parentElement;
            }
            if(!temp){
                tgt.focusloseFlag=false;
                tgt.dispatchEvent(new CustomEvent("focuslose"));
            }
        }, 0);
    });
    window.addEventListener("blur",function(){
        tgt.focusloseFlag=false;
        tgt.dispatchEvent(new CustomEvent("focuslose"));
    });
});

// 增加鼠标按键丢失事件
addEventType("mousefree",function(tgt){
    if(tgt._has_mousefree)return;
    tgt._has_mousefree=true;
    tgt.addEventListener("mouseleave",function(e){
        tgt.dispatchEvent(new MouseEvent("mousefree",e));
    });
    tgt.addEventListener("mouseup",function(e){
        tgt.dispatchEvent(new MouseEvent("mousefree",e));
    });
});


function download_flie(url,name){
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

export{
    stopPropagation,
    stopEvent,
    stopPE,
    nodeListToArray,
    KeyNotbook,
    addKeyEvent,
    removeKeyEvent,
    addResizeEvent,
    removeResizeEvent,
    linkClick,
    setupLinkClick,
    addEventType,
    download_flie
}

