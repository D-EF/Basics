/*!
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2022-12-24 23:15:02
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2023-02-16 23:27:56
 * @FilePath: \site\js\import\NML\test\base__test.js
 * @Description: 
 * 
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */

/** 参数遇到 false 时抛出异常 */
function callback_CalcErr__Throw(...arg){
    if(arg.includes(false)||arg.includes(undefined)||arg.includes(null)){
        throw new Error("Bad calc!");
    }
    return arg;
}


/** 参数遇到 false 时打印错误 */
function callback_CalcErr__ErrLog(...arg){
    if(arg.includes(false)||arg.includes(undefined)||arg.includes(null)){
        console.error("Bad calc!");
    }
    return arg;
}

export{
    callback_CalcErr__Throw,
    callback_CalcErr__ErrLog
}