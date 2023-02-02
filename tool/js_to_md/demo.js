/*
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2022-10-20 21:19:37
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2022-10-20 23:34:49
 * @FilePath: \site\js\import\Basics\tool\js_to_md\demo.js
 * @Description: 
 * 
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */

// open * 第一级标题1 * open
    //```
    /**/    /** 配置 */
    /**/    var config={
    /**/        /** @type {Number} 1角度的弧度表示 */
    /**/        DEG:Math.PI/180,
    /**/    }
    //```
// end  * 第一级标题1 * end 

// open * 第一级标题2 * open

    /** 示例的类 */
    class Demo{

        /** 
         * 构造函数的说明尽量放第二行
         * @param {Number} param1 参数1
         */
         constructor(param1){
            /** @type {Number[]} 数据 */
            this.data=[Date.now(),param1];
            /** @type {Number} 索引 */
            this.index=++Demo._c;
        }

        // open * 静态属性 成员变量 * open 
            /** @type {Number} 实例化次数*/
            static _c=0;
            /** @type {object} demo静态成员变量(对象)*/
            static obj={
                asd:123
            };
        // end  * 静态属性 成员变量 * end  

        // open * 方法 成员函数 * open
            
            /** 这是将放入标题的一行说明
             * 详细说明 demo二次函数
             * ```
             * f(x)=x^2+x+1
             * ```
             * @param {Number} x 参数x
             * @return {Number} 返回y
             */
            calc_DemoFunction(x){
                return x*(x+1)+1;
            }

            /** 获取索引
             * @return {Number}
             */
            get_Index(){return this.index}

        // end  * 方法 成员函数 * end
        
        /*h*/ static cnm="这行不会被放进md文件中哦";
    }

    /**
     * 全局demo函数
     * ```
     * f(x)= |x|^3
     * ```
     * @param {Number} 传入参数x
     * @return {Number} 返回y
     */
    function calc_DemoFunction__Outsize(x){
        return Math.abs(x*x*x);
    }

// end  * 第一级标题2 * end 
