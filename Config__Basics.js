/*!
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2023-02-21 01:52:12
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2023-02-21 02:23:00
 * @FilePath: \site\js\import\Basics\Config__Basics.js
 * @Description: 库 Basics 的配置
 * @
 * @Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */


/**
 * @typedef CONFIG__BASICS
 * @property {boolean}   OVERLOAD_NATIVE_FUNCTOIN   是否重载原生js中的函数
 */

/**
 * 
 */
const CONFIG__BASICS=Object.assign({
    OVERLOAD_NATIVE_FUNCTOIN:true
},globalThis.CONFIG__BASICS);

export {
    CONFIG__BASICS as CONFIG
}