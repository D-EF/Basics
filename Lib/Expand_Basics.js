/*
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2022-11-03 01:00:17
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2022-12-18 23:10:38
 * @FilePath: \site\js\import\Basics\Lib\Expand_Basics.js
 * @Description: 
 * 
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */

/** @type {Function} 空函数 返回 undefiend */
globalThis.nullfnc=function nullfnc(){};

// open * 兼容性增强 * open
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
    globalThis.requestAnimationFrame=globalThis.requestAnimationFrame||function (fnc){return setTimeout(fnc, 24);}
    globalThis.cancelAnimationFrame=globalThis.cancelAnimationFrame||clearTimeout;
    globalThis.performance=performance||{now:Date.now};
// end  * 兼容性增强 * end 


// open * 对 functoin 的拓展 * open

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

    /** 重载函数类 */
    class OverloadFunction extends Function{
        /**
         * @param   {function} default_fnc 当没有和实参对应的重载时默认执行的函数
         * @return  {OverloadFunction} 带重载的函数
         * 用 .addOverload 添加重载
         */
        constructor(default_fnc){
            return OverloadFunction._create(default_fnc);
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
        /** 创建重载函数
         * @param   {function} default_fnc 当没有和实参对应的重载时默认执行的函数
         * @return  {OverloadFunction} 带重载的函数
         * 用 .addOverload 添加重载
         */
        static _create(default_fnc){
            var OverloadFunction=(function(){
                return function(){
                    var i,j,flag=false;
                    var length=arguments.length;
                    j=i==length-1;
                    while(j>=0&&arguments[j]===undefined){--length;--j;};
                    for(i=OverloadFunction.ols.length-1;i>=0;--i){
                        if(length===OverloadFunction.ols[i].parameterType.length){
                            flag=true;
                            for(j=length-1;flag&&j>=0;--j){
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
            OverloadFunction.addOverload=OverloadFunction.prototype.addOverload;
            return OverloadFunction;
        }
    }

    /** 委托 */
    class Delegate extends Function{
        
        constructor(){
            return Delegate._create();
            /** @type {Function[]}*/
            this.act_list;
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
        static _create(){
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

    /** 时间变动回调操作 */
    class Date_Callback{
        constructor(){

            /** @type {{[time_long:string]:(function(number)|Delegate)}} 时间单位分变动回调委托 */
            this.delegate_set={};
            /** @type {{[time_long:String]:number}} 计时器集合 */
            this.timers={};
        }

        /** 增加 时间单位分变动回调函数
         * @param {string} key 回调函数委托与计时器的索引
         * @param {number} time_long 每次回调的间隔(步长)
         * @param {number} deviation 初始化与第一次回调的间隔 取负值将设置为当前时间戳取余步长 (now % time_long)
         * @param {function(number)} callback 回调函数
         */
        add_Callback(key,time_long,deviation,callback){
            if(!this.delegate_set[key]){
                this.delegate_set[key]=new Delegate();
            }
            this.delegate_set[key].addAct(this,callback);
            this._init_Callback(key,time_long,deviation,callback);
        }
        /** 初始化, 创建计时器
         * @param {string} key 回调函数委托与计时器的索引
         * @param {number} time_long 每次回调的间隔(步长)
         * @param {number} deviation 初始化与第一次回调的间隔 取负值将设置为当前时间戳取余步长 (now % time_long)
         * @returns 
         */
        _init_Callback(key,time_long,deviation){
            if(this.timers[key]) return;

            var that=this;
            var millisecond__now_to_next=deviation<0?(time_long-Date.now()%time_long):deviation;

            that.timers[key]=setTimeout(function(){
                that.delegate_set[key](Date.now());
                that.timers[key]=setInterval(function(){
                    that.delegate_set[key](Date.now());
                }, time_long);
            }, millisecond__now_to_next);
        }
        /** @type {number} 一分钟的毫秒数 */
        static MINUTE = 60000;
        /** @type {number} 一小时的毫秒数 */
        static HOURS  = 3600000;
    }

// end  * 对 functoin 的拓展 * end 

// open * 原有的api函数重载 * open
    /** 将时间类型转换成字符串
     */
     (function(){
        var temp=Date.prototype.toString;
        Date.prototype.toString=OverloadFunction._create(temp);
        /** @param {String} str 用%{控制字符}{长度}控制打印字符: Y-年 M-月 D-日 d-星期几 h-小时 m-分钟 s-秒 n-毫秒 如果没有写长度将使用自动长度, 如果长度超出将在前面补0; 例: %Y6-%M2-%D -> 001970-01-1
         */
        Date.prototype.toString.addOverload([String],function(str){
            /** @type {Date} */
            var that=this,
            mapping_date_time={
                Y:that.getFullYear().toString(),
                M:(that.getMonth()+1).toString(),
                D:that.getDate().toString(),
                d:that.getDay().toString(),
                h:that.getHours().toString(),
                m:that.getMinutes().toString(),
                s:that.getSeconds().toString(),
                n:that.getMilliseconds().toString()
            }
            var i,rtn=[],tstr;
            for(i=0;i<str.length;++i){
                if(str[i]==='%'){
                    ++i;
                    if(mapping_date_time[str[i]]!==undefined){
                        var ti=parseInt(str[i+1]),tempstr=[];
                        if(isNaN(ti)){
                            tstr=mapping_date_time[str[i]];
                        }else{
                            ti=parseInt(str.slice(i+1))
                            if(ti>mapping_date_time[str[i]].length){
                                do{
                                    tempstr.push('0');
                                    --ti;
                                }while(ti>mapping_date_time[str[i]].length)
                            }
                            tempstr.push(mapping_date_time[str[i]].slice(mapping_date_time[str[i]].length-ti));
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
// end  * 原有的api函数重载 * end 

// open * 数值操作拓展 * open
    // open * 步进器 * open
        /** 步进器
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
             * 用来添加监听的 当发生返回时调用 this.regression_listener[i].call(this,this.i,val,this);
             * val是表示往前走了还是往后走了 用不同正负的数字表示
             * @type {function(this:Stepper,Number,Number,Stepper))[]}
             */
            this.regression_listener=[];
            this.i=now||0;
            this.overflowHanding();
        }
        /** Stepper 拷贝函数
         * @param {Stepper} stepper 拷贝对象
         * @returns {Stepper}
         */
        Stepper.copy=function (stepper){
            return new Stepper(stepper.max,stepper.min,stepper.valueOf())
        }
        Stepper.prototype={
            
            /** 拷贝函数
             * @returns {Stepper}
             */
            copy(){
                return new Stepper(this.max,this.min,this.valueOf());
            },
            /** 用于获取当前值
             * @returns {Number}
             */
            valueOf:function(){
                return this.i;
            },
            /** 用于获取当前值(字符串)
             * @returns {String}
             */
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
                    this._regressionlin_Call(-1);
                }
                else if(this.i>this.max){
                    this.i=this.min+(this.i-this.max)%(l+1)-1;
                    this._regressionlin_Call(+1);
                }
                return this.i;
            },
            /**
             * 触发溢出后的回调
             * @param {Number} val 表示正向溢出了还是逆向溢出了 +1 -1
             */
            _regressionlin_Call(val){
                for(var i=this.regression_listener.length-1;i>=0;--i){
                    this.regression_listener[i].call(this,this.i,val,this);
                }
            }
        }
    // end  * 步进器 * end 

    /** 二分法查找显式查找表
     * @param {Number[]}   lut 显式查找表 应为正序排序的 Number 类型数组 (如路径到当前下标指令的长度)
     * @param {Number}     val   值     
     * @param {String}     [key]  如果是对象数组, 使用属性作为查找表的关键字
     * @return {int}    返回对应下标    溢出将直接使用首或尾的值
     */
    function select_Lut__Binary(lut,val,key){
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

// end  * 数值操作拓展 * end 

// open * 字符串操作拓展 * open

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

    /** 某字符是否能作为数字的一元
     * @param {char} _char 
     * @return {Boolean}
     */
    function canBeNumberChar(_char){
        return ((_char>='1'&&_char<='9')||_char==='0'||('+-.eE'.indexOf(_char)!==-1));
    }

// end  * 字符串操作拓展 * end 

export{
    inheritClass,
    OverloadFunction as OlFunction,
    Delegate,
    Date_Callback,
    Stepper,
    select_Lut__Binary,
    templateStringRender,
    strToVar,
    canBeNumberChar
}