/*
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2022-11-03 01:06:52
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2022-11-03 01:08:24
 * @FilePath: \site\js\import\Basics\Lib\Expand_List.js
 * @Description: 给 数组(列表) 的功能
 * 
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */

/** @type {Symbol} 执行 arrayEqual 时使用 ArrayEqual_EqualObj 作为参数会直接为返回 true. If the function 'arrayEqual' params (a1/a2) has ArrayEqual_EqualObj. It will return true! */
const ArrayEqual_EqualObj=Symbol?Symbol("If the function 'arrayEqual' params (a1/a2) has ArrayEqual_EqualObj. It will return true! "):{};

/** 数组移位
 * @param {AllTypeArray}  arr  数组
 * @param {Number} long    移动步长
 * @returns {Array} 返回一个新数组
 */
function arrayMove(arr,long){
    if(!arr.length) return new arr.constructor(arr);
    var ll=Math.abs(long)%arr.length;
    if(!ll)return new arr.constructor(arr);
    var temp;
    if(long<0){
        temp=arr.splice(0,ll);
        return new arr.constructor([...arr,...temp]);
    }else{
        temp=arr.splice(arr.length-ll,Infinity)
        return new arr.constructor([...temp,...arr]);
    }
}

/**对比两个列表项是否相同
 * @param {AllTypeArray} a1 要进行比较的数组
 * @param {AllTypeArray} a2 要进行比较的数组
 * @param {Boolean} [checkType] 对类型是否宽松 默认否 (使用==还是===)
 * @returns {Boolean}    返回是否相同
 */
function arrayEqual(a1,a2,checkType){
    if(a1===ArrayEqual_EqualObj||a2===ArrayEqual_EqualObj){
        return true
    }
    if(a1.length!=a2.length)return false;
    var i=a1.length;
    for(--i;i>=0;--i){
        if(checkType?(!a1[i]==a2[i]):(!a1[i]===a2[i]))return false;
    }
    return true;
}

/**对比两个列表项是否相同 (无序)
 * @param {Array}   arr1       要进行比较的数组
 * @param {Array}   arr2       要进行比较的数组
 * @returns {Array}    返回差异的内容的数组
 */
function arrayDiff(arr1,arr2){
    // 本来是给KeyNotbook用的 
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
 * @returns {Boolean} 是否有差异
 */
function arrayHasDiff(arr1,arr2){
    if(arr1.length!=arr2.length)return true;
    var hash=new Map();
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

export{
    ArrayEqual_EqualObj,
    arrayMove,
    arrayEqual,
    arrayDiff,
    arrayHasDiff
}