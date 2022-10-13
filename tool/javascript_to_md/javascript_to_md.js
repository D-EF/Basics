

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
                                isNotes=j;
                                break;
                            }else 
                            //括号
                            if(temp[p]===MAPPING_BRACKETS_OPEN[j]){
                                brackets_stack.push(j);
                                console.log(brackets_stack);
                                close_flag=false;
                            }else if(temp[p]===MAPPING_BRACKETS_END[j]){
                                if(brackets_stack[brackets_stack.length-1]===j){
                                    brackets_stack.pop();
                                    console.log(brackets_stack);

                                    if(!brackets_stack.length){
                                        close_flag=true;
                                        break;
                                    }
                                }else{
                                    console.log("括号未闭合");
                                    // throw new Error("括号未闭合");
                                }
                            }
                            --j;
                        }while(j>0);
                    }else{
                        if(isString){
                            if(temp[p]===MAPPING_STR_FLAGS[isString]){
                                isString=0;
                            }
                            if(temp[p]==='\n'&&isString===3){
                                isString=0;
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
                                    if((temp[p]===MAPPING_NOTES_END[j][0])&&(temp[p]===MAPPING_NOTES_END[j][1])){
                                        isNotes=0;
                                    }
                                    break;
                            }
                        }
                    }
                }while((temp[p]!=='\n')&&temp[p]);
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

var process_programs=[
    function(str){
        // 删除函数代码块
        process_Block(str,/(?<!class).*\(.*\) *\{/,function(str,l,cf){
            if(l&&!cf){
                return ''
            }
        });
    },
    create_ProcessString__RegExp(
        /(?<!\/\n)^ *([\w\+\-\]]|(\}while\()|(\}else)|(\()).*\n/,
        '\n'
    ),
    create_ProcessString__RegExp(
        /\{[\s\n](([\s\n]*\/\/.*)*[\s\n]*\})+/,
        '\n'
    ),
    create_ProcessString__RegExp(
        /(class.*)\{/,
        '$1'
    ),
    create_ProcessString__RegExp(
        /\/\/ open \* (.*) \* open/,
        '# $1'
    ),
]


var str=`
/** 矩阵数据转移
 * @param {Matrix} rtn  要写入的矩阵
 * @param {Matrix} m    数据来源矩阵
 * @param {int} low_w           原矩阵宽度
 * @param {int} new_w           新矩阵宽度
 * @param {int} [_low_h]        原矩阵高度 无输入时将使用 low_w
 * @param {int} [_new_h]        新矩阵高度 无输入时将使用 new_w
 * @param {int} [_shift_left]   旧矩阵拷贝到新矩阵时的左侧偏移 默认为 0
 * @param {int} [_shift_top]    旧矩阵拷贝到新矩阵时的上方偏移 默认为 _shift_left
 * @return {Matrix} 修改 rtn 并返回
 */
static setup(rtn,m,low_w,new_w,_low_h,_new_h,_shift_left,_shift_top){
    var low_h=_low_h||low_w,new_h=_new_h||new_w,
        shift_top  = (_shift_top&&((new_w+_shift_top)%new_w))||0,
        shift_left = _shift_left===undefined?shift_top:((new_h+_shift_left)%new_h),
        l=new_w*new_h,
        temp_u,temp_v,
        i,u,v;
    u=new_w-1;
    v=new_h-1;
    temp_u=u-shift_left;
    temp_v=v-shift_top;
    for(i=l-1;i>=0;--i){
        if(!(temp_u>=low_w||temp_v>=low_h)){
            rtn[i]=m[temp_v*low_w+temp_u];
        }
        --u;
        --temp_u;
        if(temp_u<0)temp_u=new_w-1;
        if(u<0){
            u=new_w-1;
            --v;
            --temp_v;
            if(temp_v<0)temp_v=new_h-1;
        }
    }
    return rtn;
}

/** 计算张量积
 * @param {List_Value} m1 矩阵1
 * @param {List_Value} m2 矩阵2
 * @param {int} [_w1] 矩阵1的宽度 默认认为 m1 是列向量(w1=1)
 * @param {int} [_h1] 矩阵1的高度 默认认为 m1 是列向量(h1=m1.length)
 * @param {int} [_w2] 矩阵2的宽度 默认认为 m2 是行向量(w2=m2.length)
 * @param {int} [_h2] 矩阵2的高度 默认认为 m2 是行向量(h2=1)
 * @return {Matrix} 返回一个新的矩阵
 */
static create_TensorProduct(m1,m2,_w1,_h1,_w2,_h2){
    var w1=_w1||1,
        h1=_h1||m1.length,
        w2=_w2||m2.length,
        h2=_h2||1,
        i=w1*h1;
    var rtn=new Array(i);
    for(--i;i>=0;--i){
        rtn[i]=Matrix.np(m2,m1[i]||0);
    }
    return Matrix.concat(rtn,w1,w2,h1,h2);
}

/** 合并矩阵
 * @param  {List_Value[]} m_list 传入多个矩阵,矩阵应该拥有相同大小
 * @param  {int} w_l      m_list中一行放几个矩阵
 * @param  {int} w_m      m_list[i]的宽度
 * @param  {int} [_h_l]   m_list中一列放几个矩阵
 * @param  {int} [_h_m]   m_list[i]的高度
 * @return {Matrix} 返回一个新的矩阵
*/
static concat(m_list,w_l,w_m,_h_l,_h_m){
    var h_l=_h_l||Math.ceil(m_list.length/w_l),
        h_m=_h_m||Math.ceil(m_list[0].length/w_m),
        l_l=w_l*h_l,
        l_m=w_m*h_m,
        l=l_l*l_m,
        w=w_l*w_m,
        u_l,v_l,u,v,i,j,k;
    var rtn=new Matrix(l);
    k=l_l;
    for(v_l=h_l-1;v_l>=0;--v_l){
        for(u_l=w_l-1;u_l>=0;--u_l){
            --k;
            j=l_m;
            for(v=h_m-1;v>=0;--v){
                i=(v_l*h_m+v)*w+w_m*(u_l+1);
                if(m_list[k])
                for(u=w_m-1;u>=0;--u){
                    --i;
                    --j;
                    rtn[i]=m_list[k][j];
                }
            }        
        }
    }
    return rtn;
}

/** 矩阵乘标量
 * @param {List_Value}     m   矩阵
 * @param {Number}  k   标量
 * @return {Matrix} 返回一个新的矩阵
 */
static np(m,k){
    return Matrix.np_b(new Matrix(m),k);
}

/** 矩阵乘标量
 * @param {List_Value}     m   矩阵
 * @param {Number}  k   标量
 * @return {List_Value} 修改m并返回
 */
static np_b(m,k){
    var i;
    for(i=m.length-1;i>=0;--i){
        m[i]*=k;
    }
    return m;
}

/** 使用 uv 获取 index 
 * @param {int} n 矩阵宽度 (列数)
 * @param {int} u 元素的 u 坐标 (第u列)
 * @param {int} v 元素的 v 坐标 (第v行)
 */
static get_Index(n,u,v){
    return v*n+u;
}

/** 创建单位矩阵
 * @param {int}  w   矩阵宽度
 * @param {int} [h]  矩阵高度 默认和 w 相等
 * @return {Matrix} 
 */
static create_Identity(w,_h){
    var h=_h||w;
    var l=w*h, sp=w+1, i=0,j=w>h?h:w;
    var rtn=new Matrix(l);
    do{
        rtn[i]=1.0;
        i+=sp;
        --j
    }while(j>0);
    return rtn;
}

/** 初等变换 换行操作
 * @param {List_Value|List_Value[]} m 一个或多个矩阵
 * @param {int} n       n阶矩阵 用来表示一行的长度
 * @param {int} v1      矩阵v坐标1 (要对调的行下标1)
 * @param {int} v2      矩阵v坐标2 (要对调的行下标2)
 * @return {m} 修改并返回m
 */
static transform_Exchange(m,n,v1,v2){
    var i,j,k,l,t;
    var f=ArrayBuffer.isView(m[0])||Array.isArray(m[0]);
    // 换行
    for(i=v1*n,j=v2*n,k=n; k>0; --k,++i,++j){
        if(f){
            for(l=m.length-1;l>=0;--l){
                t=m[l][i];
                m[l][i]=m[l][j];
                m[l][j]=t;  
            }
        }else{
            t=m[i];
            m[i]=m[j];
            m[j]=t;
        }
    }
    return m;
}
`;

console.log(
    process_Block(str,/(?<!class).*\(.*\) *\{/,function(str,l,cf){
        if(l&&!cf){
            return ''
        }else{
            return str
        }
    })
);
