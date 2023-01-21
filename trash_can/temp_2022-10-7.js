
function get_NumberLength(val){
    var rtn=0;
    while(val>=1){
        val*=0.1;
        rtn++;
    }
    return rtn;
}
/** 大数运算使用的类
 * @param {Number|Number[]|Number_Long} val 
 */
function Number_Long(val){
    /** @type {Number[]} 数字集合 */
    this.data;
    /** @type {Boolean} 符号+- */
    if(val instanceof Number_Long){
        this.data=Array.from(val.data);
    }else if(Array.isArray(val)){
        this.data=val.map(i=>{
            return Math.abs(i);
        });
    }
    else if(val!==undefined){
        this.data=[Math.abs(Number(val))];
    }else{
        this.data=[];
    }
    this.sp();
}
Number_Long.prototype={
    toString(){
        var rtn="",
            temp,temp_l;
        rtn+=this.data[0];
        for(var i=1;i<this.data.length;++i){
            temp=this.data[i].toString();
            temp_l=Number_Long.MAX_LENGTH-temp.length;
            while(temp_l--){
                temp="0"+temp;
            }
            rtn+=temp;
        }
        return rtn;
    },
    /** 进位 */
    sp(){
        var temp1=0,temp_f,
            l=this.data.length-1,
            f=true,f1,k;

        for(var i=l;i>=0;--i){
            if(this.data[i-1]){
                // 符号变更
                f=(f1=this.data[i-1]<0)===(this.data[i]<0);
                if(!f){
                    this.data[i-1]+=(f1?1:-1);
                    this.data[i]+=(f1?-1:1)*Number_Long.MAX;
                }
            }
            temp_f=String(this.data[i]);
            if((k=temp_f.indexOf('.'))!==-1){
                // 浮点退位
                temp_f=parseFloat('0.'+temp_f.slice(k));
                this.data[i]=parseInt(this.data[i]);
                if(i+1<=l){
                    ++i;
                    if(this.data[i]!==undefined){
                        this.data[i]=(this.data[i]*Number_Long.SP+temp_f)*Number_Long.MAX;
                    }
                }
            }
            // 进位
            while(Math.abs(this.data[i])>=Number_Long.MAX){
                temp1=parseInt(this.data[i]*Number_Long.SP);
                if(this.data[i-1]!==undefined){
                    this.data[i-1]+=temp1;
                    this.data[i]=parseInt(this.data[i]%Number_Long.MAX);
                }else{
                    this.data.unshift(temp1);
                    this.data[i+1]=parseInt(this.data[i+1]%Number_Long.MAX);
                }
            }
        }
    },
    /** 加法运算
     * @param {Number|Number[]|Number_Long} val 增加的值
     * @returns {Number_Long} 返回一个新的 Number_Long
     */
    add(val){
        var rtn;
        var _val=val,l1=this.data.length-1;
        if(_val.constructor===Number){
            if(_val<Number_Long.MAX){
                rtn=new Number_Long(this);
                rtn.data[l1]+=_val;
                rtn.sp();
                return rtn;
            }
            _val=new Number_Long(_val);
        }else if(Array.isArray(_val)){
            _val=new Number_Long(_val);
        }

        var l2=_val.data.length-1;
        rtn=new Number_Long();
        for(var i=l1,j=l2;(i>=0)||(j>=0);--i,--j){
            rtn.data.unshift((this.data[i]||0)+(_val.data[j]||0));
        }
        rtn.sp();
        return rtn;
    },
    /** 乘法运算, 忌用浮点数数参与大数值运算 因为js对浮点运算支持很垃圾
     * @param {Number|Number[]|Number_Long} val 
     * @returns {Number_Long} 返回一个新的 Number_Long
     */
    multiply(val){
        var _val=new Number_Long(val),
            org,temp,rtn;
        var l1=this.data.length-1;
        var l2=_val.data.length-1;
        var i,j,k=0;
        rtn=new Number_Long(0);
        org=new Number_Long(this);
        for(i=l2;i>=0;--i){
            temp=new Number_Long(org);
            for(j=l1;j>=0;--j){
                temp.data[j]*=_val.data[i];
            }
            rtn=rtn.add(temp);
            org.data.push(0);
            ++k;
        }
        return rtn;
    }
}
Number_Long.MAX=1e+8;
Number_Long.SP=1e-8;
Number_Long.MAX_LENGTH=8;
