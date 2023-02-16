/*!
 * 垃圾代码放置处
 */

/*
 * @Date: 2022-01-11 16:50:17
 * @LastEditors: Darth_Eternalfaith
 * @LastEditTime: 2022-02-28 15:47:47
 * @FilePath: \def-web\js\basics\test\dump.js
 */

/**判断是否能支持某些input的type
*/
function inputSupportsTypeF(){
    var selectInputSupportsType=function (type){
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
 * @return {boolean} 返回是否是数字
 */
function inputNumber(e){
    var event=event||e||window.event;
    if(!(event.keyCode>47&&event.keyCode<58)){
       stopPE(e)
       return false
    }
    else return true;
}
