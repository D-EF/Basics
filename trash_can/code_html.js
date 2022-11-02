/*
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2022-11-03 01:24:24
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2022-11-03 01:24:27
 * @FilePath: \site\js\import\Basics\trash_can\code_html.js
 * @Description: 
 * 
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */

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
// 添加要转义的字符
encodeHTML.regex=[
    /</g,
    />/g,
    /"/g,
    /'/g,
    /\{/g,
    /\}/g,
    /\[/g,
    /\]/g
];
encodeHTML.rStrL=[
    "&#60;",
    "&#62;",
    "&#34;",
    "&#39;",
    "&#123;",
    "&#125;",
    "&#91;",
    "&#93;"
];
//end 

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