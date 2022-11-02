/*
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2022-11-03 01:29:25
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2022-11-03 01:31:05
 * @FilePath: \site\js\import\Basics\trash_can\hash_caller_dom.js
 * @Description: 
 * 
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */

// dom
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