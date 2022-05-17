/*
 * @Date: 2022-01-11 15:07:26
 * @LastEditors: Darth_Eternalfaith
 * @LastEditTime: 2022-05-17 14:27:04
 * @FilePath: \PrimitivesTGT-2D_Editor\js\import\basics\math_ex.js
 */

window.deg=Math.PI/180;

function get_NumberLength(val){
    var rtn=0;
    while(val>=1){
        val*=0.1;
        rtn++;
    }
    return rtn;
}

class Number_Long{
    /**
     * @param {Number|Number[]|Number_Long} val 
     */
    constructor(val){
        /** @type {Number[]} */
        this.data;
        this.f=true;
        if(val instanceof Number_Long){
            this.data=Array.from(val.data);
            this.f=val.f;
        }else if(Array.isArray(val)){
            this.data=val.map(i=>{
                if(i<0){
                    this.f=!f;
                }
                return Math.abs(i);
            });
        }
        else if(val!==undefined){
            if(val<0){
                this.f=!f;
            }
            this.data=[Math.abs(Number(val))];
        }else{
            this.data=[];
        }
        this.sp();
    }
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
    }
    /** 进位 */
    sp(){
        var temp1=0,temp_f,
            l=this.data.length-1;

        for(var i=l;i>=0;--i){
            temp_f=this.data[i]%1;
            if(temp_f!==0){
                this.data[i]=parseInt(this.data[i]);
                if(i+1<=l){
                    ++i;
                    this.data[i]=(this.data[i]*Number_Long.SP+temp_f)*Number_Long.MAX;
                }
            }
            while(this.data[i]>=Number_Long.MAX){
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
    }
    /** 加法运算
     * @param {Number|Number[]|Number_Long} val 增加的值
     * @return {Number_Long} 返回一个新的 Number_Long
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
    }
    /** 乘法运算
     * @param {Number|Number[]|Number_Long} val 
     * @return {Number_Long} 返回一个新的 Number_Long
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
    static MAX=1e+8;
    static SP=1e-8;
    static MAX_LENGTH=8;
}

console.log(new Number_Long(899999999).add(899999999).toString());      //1799999998
console.log(new Number_Long(899999999).add(1).multiply().toString());

var temp=new Number_Long(1);
for(var i=1;i<=100;++i){
    temp=temp.multiply(i);
}
console.log(temp.toString());




/**
 * 步进器
 * @param {Number} max 步进器的最大值
 * @param {Number} min 步进器的最小值
 * @param {Number} now 步进器的当前值
 */
function Stepper(max,min,now){
    this.max=max===undefined?Infinity:max;
    this.min=(min===undefined)?(0>this.max?this.max-1:0):(min);
    if(this.max<this.min){
        var temp=this.min;
        this.min=this.max;
        this.max=temp;
    }
    /**
     * 用来添加监听的 当发生返回时调用 this.regression_listener[i].call(this,this.i,val,this);
     * val是表示往前走了还是往后走了 用不同正负的数字表示
     * @type {function(this:Stepper,Number,Number,Stepper))[]}
     */
    this.regression_listener=[];
    this.i=now||0;
    this.overflowHanding();
}

Stepper.prototype={
    valueOf:function(){
        return this.i;
    },
    toString:function(){
        return this.i.toString();
    },
    /**
     * 设置当前值
     * @param {Number} _i 目标
     * @returns {Number} 返回修改后的值
     */
    set:function(_i){
        this.i=_i;
        this.overflowHanding();
        return this.i;
    },
    /**
     * 让步进器步进
     * @param {Number} _l 步长
     * @returns {Number} 返回步进后的位置
     */
    next:function(_l){
        var l=_l===undefined?1:_l;
        this.i+=l;
        
        this.overflowHanding();

        return this.i;
    },
    /**
     * 让步进器的溢出值回到范围内
     */
    overflowHanding:function(){
        if(this.max===this.min) return this.i=this.min;
        var l=this.max-this.min+1;
        if(this.i<this.min){
            this.i=this.max-(this.min-this.i)%(l+1)+1;
            this._regressionlin_Call(-1);
        }
        else if(this.i>this.max){
            this.i=this.min+(this.i-this.max)%(l+1)-1;
            this._regressionlin_Call(+1);
        }
        return this.i;
    },
    /**
     * 触发溢出后的回调
     * @param {Number} val 表示正向溢出了还是逆向溢出了 +1 -1
     */
    _regressionlin_Call(val){
        for(var i=this.regression_listener.length-1;i>=0;--i){
            this.regression_listener[i].call(this,this.i,val,this);
        }
    }
}

/**
 * 贝塞尔曲线求pt点 算法来自 https://pomax.github.io/bezierinfo/zh-CN/index.html
 * @param {{x:Number,y:Number}[]} points 控制点集合
 * @param {Number} t t参数
 * @returns {{x:Number,y:Number}} 返回对应点
 */
 function get_BezierCurvePoint__DeCasteljau(points,t){
    if(points.length>1){
        var newPoints=new Array(points.length-1);
        var x,y;
        var td=1-t;
        for(var i=newPoints.length-1;i>=0;--i){
            x=td*points[i].x+t*points[i+1].x;
            y=td*points[i].y+t*points[i+1].y;
            newPoints[i]={x:x,y:y};
        }
        return get_BezierCurvePoint__DeCasteljau(newPoints,t);
    }else{
        return points[0];
    }
}

/**
 * 矩阵乘法
 * @param {Number[][]} m1 左侧矩阵
 * @param {Number[][]} m2 右侧矩阵
 */
function matrixMULT(m1,m2){
    if(m1[0].length!=m2.length) throw new Error("矩阵乘法格式错误");

    var rtn=new Array(m1.length);
    for(var i=rtn.length-1;i>=0;--i){
        rtn[i]=new Array(m2[0].length);
    }

    var i=0,j=0,k=0;
    do{
        j=0
        do{
            k=0;
            var temp=0;
            do{
                temp+=m1[i][k]*m2[k][j];
                ++k;
            }while(k<m1[0].length);
            rtn[i][j]=temp;
            ++j;
        }while(j<m2[0].length);
        ++i;
    }while(i<m1.length);
    return rtn;
}

/**
 * @type {Number[][]} 帕斯卡三角
 */
const g_Pascals_Triangle=[[1]];
calcPascalsTriangle(3);
/**
 * 演算帕斯卡三角
 * @param {Number} n 到多少阶停止
 * @returns 返回帕斯卡三角 的 不规则二维数组, 别修改内容返回值的内容!
 */
function calcPascalsTriangle(n){
    var i,j;
    var rtn=g_Pascals_Triangle;
    for(i=rtn.length;i<=n;++i){
        rtn.push([]);
        for(j=0;j<i+1;++j){
            rtn[i].push((rtn[i-1][j]||0)+(rtn[i-1][j-1]||0));
        }
    }
    return rtn;
}
/** 获取帕斯卡三角的某一层
 * @param {Number} n 第n层 从 0 开始数数
 */
function getPascalsTriangle(n){
    if(g_Pascals_Triangle.length<=n)calcPascalsTriangle(n);
    return g_Pascals_Triangle[n];
}

const Bezier_Matrixs=[[1]];
/**
 * 贝塞尔曲线的矩阵 
 * @param {Number} n n阶贝塞尔曲线
 */
function getBezierMatrix(n){
    if(Bezier_Matrixs[n])return Bezier_Matrixs[n];

    if(g_Pascals_Triangle.length<=n)calcPascalsTriangle(n);
    var i,j,f;
    var m=new Array(n+1);
    for(i=n;i>=0;--i){
        m[i]=new Array(i+1);
        for(j=i,f=1;j>=0;--j){
            m[i][j]=g_Pascals_Triangle[i][j]*g_Pascals_Triangle[n][i]*f;
            f*=-1;
        }
    }
    Bezier_Matrixs.length=n+1;
    Bezier_Matrixs[n]=m;
    return m;
}

/**
 * 用控制点得到各次幂的系数
 * @param {Number[]} points 控制点集合
 */
function getBezierCoefficient(points){
    var n=points.length-1;
    var m=getBezierMatrix(n);
    var rtn=new Array(points.length);
    var i,j,temp;
    for(i=n;i>=0;--i){
        temp=0;
        for(j=i;j>=0;--j){
            temp+=m[i][j]*points[j];
        }
        rtn[i]=temp;
    }
    return rtn;
}

/**
 * 求贝塞尔曲线的导函数的控制点 (一维)
 * @param {Number[]} points 原曲线的控制点集合 
 * @returns {Number[]} 导函数的控制点
 */
function get_BezierDerivativesPoints(points){
    var n=points.length-2;
    var rtn=new Array(n+1);
    if(n<0)return {x:0,y:0}
    for(var i=n;i>=0;--i){
        rtn[i]=n*(points[i+1]-points[i])
    }
    return rtn;
}

/**
 * 计算贝塞尔曲线分割时使用的 Q 矩阵 (不补零)
 * @param {Number} n  n阶贝塞尔曲线
 * @param {Number} t  t参数 0~1
 */
function createCutBezierMatrixQ(n,t){
    if(g_Pascals_Triangle.length<=n){
        calcPascalsTriangle(n);
    }
    var i,j,k;
    var rtn=new Array(n+1);
    for(i=n;i>=0;--i){
        rtn[i]=g_Pascals_Triangle[i].concat();
    }
    var temp=t,
        td=t-1;
    // i 是行下标, j 是列下标
    for(i=1;i<=n;++i,temp*=t){
        for(j=i;j<=n;++j){
            rtn[j][i]*=temp;
        }
    }
    temp=-td;
    for(i=n-1;i>=0;--i,temp*=-td){
        for(j=i,k=n;j>=0;--j,--k){
            rtn[k][j]*=temp;
        }
    }
    return rtn;
}

/**
 * 用矩阵分割贝塞尔曲线
 * @param {Number[]} points        控制点集合
 * @param {Number[][]} matrix 分割时使用的矩阵, 用 createCutBezierMatrixQ 函数生成
 * @param {Boolean} flag 前后两边 false(0)为p1起点, true(!0)为p4终点
 */
function cutBezierByMatrix(points,matrix,flag){
    var n=points.length-1,
        i,j,
        rtn=new Array(points.length),
        temp;

    //j是行下标 i是列下标
    if(flag){
        // pt起点, p4终点
        for(i=n;i>=0;--i){
            temp=0;
            for(j=i;j>=0;--j){
                temp+=points[n-j]*matrix[i][i-j];
            }
            rtn[n-i]=temp;
        }
    }else{
        // p1起点, pt终点
        for(i=n;i>=0;--i){
            temp=0;
            for(j=i;j>=0;--j){
                temp+=points[j]*matrix[i][j];
            }
            rtn[i]=temp;
        }
    }
    return rtn;
}

/**
 * 解二元一次方程
 * z1 + o1 \* x = z2 + o2 \* y;
 * z3 + o3 \* x = z4 + o4 \* y;
 * @returns {{x:Number,y:Number}} 
 */
function binaryLinearEquation(z1,o1,z2,o2,z3,o3,z4,o4){
    var x=(z2*o4+o2*z3-z4*o2-z1*o4)/(o1*o4-o2*o3),
        y=(z3+o3*x-z4)/o4;
    return {x:x,y:y};
}

/**
 * 近似相等, 用于浮点误差计算后判断结果是否相近; 
 * @param {Number} num1 数字
 * @param {Number} num2 数字
 * @param {Number} tolerance 容差， 默认为 1e-12
 */
function approximately(num1,num2,tolerance){
    return Math.abs(num1-num2)<(tolerance||1e-12);
}

/**
 * 多次函数的导数
 * @param {Number[]} coefficients 各次幂的系数 [1, t^1, t^2, t^3, ...]
 * @returns {Number[]}  导数的各次幂的系数 [1, t^1, t^2, t^3, ...] 长度会比形参少 1
 */
function derivative(coefficients){
    var i=coefficients.length-1,
        rtn=new Array(i);
    for(;i>0;--i){
        rtn[i-1]=coefficients[i]*i;
    }
    return rtn;
}

/**
 * 解一元三次方程, ax^3+bx^2+cx+d=0
 * @param {Number[]} coefficient 系数集合从低次幂到高次幂 [ 1, x, x^2, x^3 ]
 * @returns {Number[]} 返回根的集合
 */
function rootsOfCubic(coefficient){
    var a=coefficient[2]||0,
        b=coefficient[1]||0,
        c=coefficient[0]||0,
        d=coefficient[3]||0;

    //一元一至三次函数求根公式编程表示 来自 https://pomax.github.io/bezierinfo/zh-CN/index.html#extremities
    
    // Quartic curves: Cardano's algorithm.

    // do a check to see whether we even need cubic solving:
    if (approximately(d, 0)) {
        // this is not a cubic curve.
        if (approximately(a, 0)) {
            // in fact, this is not a quadratic curve either.
            if (approximately(b, 0)) {
                // in fact in fact, there are no solutions.
                return [];
            }
            // linear solution
            return [-c / b];
        }
        // quadratic solution
        var k=b * b - 4 * a * c;
        if(k<0)return [];
        var q = Math.sqrt(k), a2 = 2 * a;
        return [(q - b) / a2, (-b - q) / a2];
    }
    
    a /= d;
    b /= d;
    c /= d;

    var p = (3 * b - a * a) / 3,
        p3 = p / 3,
        q = (2 * a * a * a - 9 * a * b + 27 * c) / 27,
        q2 = q / 2,
        discriminant = q2 * q2 + p3 * p3 * p3;

    // and some variables we're going to use later on:
    var u1, v1, root1, root2, root3;

    // three possible real roots:
    if (discriminant < 0) {
        var mp3 = -p / 3,
            mp33 = mp3 * mp3 * mp3,
            r = Math.sqrt(mp33),
            t = -q / (2 * r),
            cosphi = t < -1 ? -1 : t > 1 ? 1 : t,
            phi = Math.acos(cosphi),
            crtr = rootsOfCubic.cuberoot(r),
            t1 = 2 * crtr;
        root1 = t1 * Math.cos(phi / 3) - a / 3;
        root2 = t1 * Math.cos((phi + 2 * Math.PI) / 3) - a / 3;
        root3 = t1 * Math.cos((phi + 4 * Math.PI) / 3) - a / 3;
        return [root1, root2, root3];
    }

    // three real roots, but two of them are equal:
    if (discriminant === 0) {
        u1 = q2 < 0 ? rootsOfCubic.cuberoot(-q2) : -rootsOfCubic.cuberoot(q2);
        root1 = 2 * u1 - a / 3;
        root2 = -u1 - a / 3;
        return [root1, root2];
    }

    // one real root, two complex roots
    var sd = Math.sqrt(discriminant);
    u1 = rootsOfCubic.cuberoot(sd - q2);
    v1 = rootsOfCubic.cuberoot(sd + q2);
    root1 = u1 - v1 - a / 3;
    return [root1];
}
rootsOfCubic.cuberoot=function(v){
    return v < 0?-Math.pow(-v, 1 / 3) : Math.pow(v, 1 / 3);
}

/**
 * 通过系数创建贝塞尔曲线控制点
 * @param {Number[]}    coefficient 
 * @returns {Number[]}  
 */
function coefficientToPoints(coefficient){
    var n=coefficient.length,
        rtn=new Array(n),
        m=getBezierMatrix(--n),
        temp;
    
    for(var i=0;i<=n;++i){
        temp=coefficient[i];
        for(var j=0;j<i;++j){
            temp-=rtn[j]*m[i][j]
        }
        rtn[i]=temp/m[i][j];
    }
    return rtn;
}

const deg=Math.DEG;
const deg_90=90*deg;
const deg_180=180*deg;
window.cycles=Math.PI*2;
const cycles=window.cycles;


// 二维平面贝塞尔曲线拟合圆弧公式
// 单位圆且起点角度为0   示例
// p1=(1,0)
// p2=(1,k)     //p1 + (k*导向量)
// p3=p4 + (-k*导向量)
// p4=采样点


const DIVISION_4_3=4/3;
/** 计算 贝塞尔曲线拟合圆弧 的 k 值
 * @param   {Number} angle 夹角
 * @returns {Number} 返回 k 值
 */
function calc_k__BezierToCyles(angle){
    return DIVISION_4_3*Math.tan(angle*0.25);
}
/**@type {Number} 贝塞尔曲线拟合四分之一圆 的 k 值 */
const BEZIER_TO_CYCLES_K__1D4=0.551784777779014;

export {
    getBezierMatrix,
    get_BezierCurvePoint__DeCasteljau,
    matrixMULT,
    calcPascalsTriangle,
    getPascalsTriangle,
    getBezierCoefficient,
    get_BezierDerivativesPoints,
    createCutBezierMatrixQ,
    cutBezierByMatrix,
    binaryLinearEquation,
    approximately,
    derivative,
    rootsOfCubic,
    coefficientToPoints,
    Stepper,
    deg,
    deg_90,
    deg_180,
    cycles,
    calc_k__BezierToCyles,
    BEZIER_TO_CYCLES_K__1D4
}