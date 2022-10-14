
// open * 字符串处理 * open
    /**
     * @callback process_Line
     * @param {String} str 处理中的一行字符串
     * @param {Number} line_index 处理中的第几行
     * @param {Boolean} close_flag 是否结束
     * @return {String} 返回字符串
     */

    /** 处理代码块
     * @param {String} str 原本的代码
     * @param {String|RegExp} head_regexp 选择到头部的选择器
     * @param {process_Line} process_Line 各行处理函数 返回字符串
     * @return {String} 返回处理后的代码
     */
    function process_Block(str,head_regexp,process_Line){
        var rtn=[],
            temp=str,
            i=0,j=0,t=0,
            q=0,p=0,
            brackets_stack=[],
            l=0,
            isNotes=0,
            isString=0,
            close_flag=true;

        var MAPPING_NOTES_OPEN=[
            '',
            '//',
            '/*'
        ],MAPPING_NOTES_END=[
            '',
            '\n',
            '*/'
        ],
        MAPPING_STR_FLAGS=" '\"`",
        MAPPING_BRACKETS_OPEN=" {[",
        MAPPING_BRACKETS_END =" }]";

        do{
            i=head_regexp.exec(temp);
            if(i){
                // 命中 head_regexp
                l=0
                rtn.push(temp.slice(p,i.index));
                temp=temp.slice(i.index);
                q=p=0;
                do{
                    do{
                        ++p;
                        if(!(isString||isNotes)){
                            j=3;
                            do{
                                if(temp[p]===MAPPING_STR_FLAGS[j]){ //字符串
                                    isString=j;
                                    break;
                                }else if((j<3)&&((temp[p]===MAPPING_NOTES_OPEN[j][0])&&(temp[p+1]===MAPPING_NOTES_OPEN[j][1]))){ //注释
                                    ++p;
                                    isNotes=j;
                                    break;
                                }else 
                                //括号
                                if(j<MAPPING_BRACKETS_OPEN.length){
                                    if(temp[p]===MAPPING_BRACKETS_OPEN[j]){
                                        brackets_stack.push(j);

                                        // console.log(brackets_stack);

                                        close_flag=false;
                                    }else if(temp[p]===MAPPING_BRACKETS_END[j]){
                                        if(brackets_stack[brackets_stack.length-1]===j){
                                            brackets_stack.pop();

                                            // console.log(brackets_stack);

                                            if(!brackets_stack.length){
                                                close_flag=true;
                                                break;
                                            }
                                        }else{
                                            console.error("括号未闭合");
                                            // throw new Error("括号未闭合");
                                        }
                                    }
                                }
                                --j;
                            }while(j>0);
                        }else{
                            if(isString){
                                if(temp[p]===MAPPING_STR_FLAGS[isString]&&temp[p-1]!=='\\'){
                                    isString=0;
                                }
                                if(temp[p]==='\n'&&isString===3){
                                    isString=0;
                                    console.error("异常的引号");
                                    // throw new Error("异常的引号");
                                }
                            }else{
                                switch (isNotes) {
                                    case 1:
                                        if(temp[p]===MAPPING_NOTES_END[j][0]){
                                            isNotes=0;
                                        }
                                        break;
                                    case 2:
                                        if((temp[p]===MAPPING_NOTES_END[j][0])&&(temp[p+1]===MAPPING_NOTES_END[j][1])){
                                            isNotes=0;
                                            ++p;
                                        }
                                        break;
                                }
                            }
                        }
                    }while((temp[p]!=='\n')&&temp[p]);
                    // console.log(temp.slice(q,p));
                    rtn.push(process_Line(temp.slice(q,p),l,close_flag));
                    temp=temp.slice(p);
                    ++l;
                    q=p=0;
                }while(!close_flag&&temp[p]);
            }else{
                rtn.push(temp);
                break;
            }
        }while(1);
        return rtn.join('');
    }

    /**
     * @callback Function__Process_String 字符串处理函数
     * @param {String} str 原字符串
     * @return {String} 返回处理后的字符串
     */

    /** 使用正则表达式生成字符串处理函数
     * @param {RegExp} searchValue  
     * @param {String} replaceValue 
     * @return {Function__Process_String}
     */
    function create_ProcessString__RegExp(searchValue,replaceValue){
        /** @type {Function__Process_String} */
        return function(str){
            return str.replace(searchValue,replaceValue);
        }
    }

    /** 使用正则表达式生成字符串处理函数 处理多次，直到无法找到匹配项
     * @param {RegExp} searchValue  
     * @param {String} replaceValue 
     * @return {Function__Process_String}
     */
    function create_ProcessString__RegExp__More(searchValue,replaceValue){
        /** @type {Function__Process_String} */
        return function(_str){
                var str=_str;
                while(searchValue.test(str)){
                    str=str.replace(searchValue,replaceValue);
                }
                return str;
        }
    }


    /** @type {Function__Process_String[]} */
    var process_programs=[
        create_ProcessString__RegExp(/\r/g,''),
        function(str){
            // 删除函数代码块
            return process_Block(str,/(?<!class).*\(.*\) *\{/,function(str,l,cf){
                if(!l){
                    return str.slice(0,str.lastIndexOf('{'));
                }else{
                    return '';
                }
            });
        },
        create_ProcessString__RegExp(/\/\/#/g,"#"),
        create_ProcessString__RegExp(
            // 函数 to md
            /( *)\/\*\*(.*)\n+((?:(?:(?: *\*).*\n+))+) *\*\/\n+ *(.*\(.*)/g,
            "$1# $4 $2\n$3"
        ),
        create_ProcessString__RegExp__More(
            // 处理 // open * {title} * open 
            /\/\/ open \* (.*) \* open([\s\S\n]*) *\/\/ end  \* \1 \* end *\n?/g,
            "# $1$2"
        ),
        create_ProcessString__RegExp__More(
            /(    )(#)/g,
            "$2$2"
        ),
        create_ProcessString__RegExp__More(
            /\n(    )+/g,
            '\n'
        ),
        create_ProcessString__RegExp(
            /\n/g,
            '   \n'
        ),
        create_ProcessString__RegExp(
            /\* *```/g,
            '```'
        ),
        create_ProcessString__RegExp(
            /\/\/ *```/g,
            '```'
        ),
        create_ProcessString__RegExp(
            /\/\*\*\//g,
            ''
        ),
        create_ProcessString__RegExp(
            /\n/g,
            '\r\n'
        ),
    ]

    function js_to_md(code_str){
        var str=code_str;
        var i;
        for(i=0;i<process_programs.length;++i){
            str=process_programs[i](str);
        }
        return str;
    }

// end  * 字符串处理 * end 

// open * dom 操作 * open

    // open * 来自 dom_tool 的函数 *open
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
    // end  * 来自 dom_tool 的函数 *end 

    var render_target=document.getElementById("rtn");
    
    var reader= new FileReader();
    reader.onload=function (e){
        console.log(e)
        render_target.value=js_to_md(e.target.result)
        console.log(render_target.value);
    }

    document.body.ondragover=function(ev){
        stopPE(ev);
    }

    document.body.ondrop=function (ev){
        // console.log(ev.dataTransfer.files);
        /**@type {File} */
        var d=ev.dataTransfer.files[0];
        reader.readAsText(d);
        stopPE(ev);
    }

// end  * dom 操作 * end 