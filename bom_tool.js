/*
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2022-09-16 23:48:00
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2022-09-16 23:48:48
 * @FilePath: \site\js\import\Basics\bom_tool.js
 * @Description: 
 * 
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */

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

export {
    Hashcaller,
    HashListener,
    hashcaller,
}