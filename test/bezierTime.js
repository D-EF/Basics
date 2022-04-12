/*!
 * 性能测试
 */

var t=0;
//此处修改曲线精度
var tspLength=0.001;
//此处修改数据长度
var d_length=1000;

var dde=new Array(d_length);
for(var i =dde.length-1;i>=0;--i){
    dde[i]=[
        {x:Math.random()*100,y:Math.random()*100},
        {x:Math.random()*100,y:Math.random()*100},
        {x:Math.random()*100,y:Math.random()*100},
        {x:Math.random()*100,y:Math.random()*100}
    ];
}

var d3=new Array(d_length);
for(var i =d3.length-1;i>=0;--i){
    d3[i]={
        p1:{x:dde[i][0].x,y:dde[i][0].y},
        p2:{x:dde[i][1].x,y:dde[i][1].y},
        p3:{x:dde[i][2].x,y:dde[i][2].y},
        p4:{x:dde[i][3].x,y:dde[i][3].y}
    }
}

var ktp2=[];
var nt=performance.now();
for(var i =dde.length-1;i>=0;--i){
    for(t=0;t<=1;t+=tspLength){
        // ktp2.push
        (
            get_BezierCurvePoint__DeCasteljau(dde[i],t)
        )
    }
}
console.log(ktp2);
console.log("de Casteljau's algorithm 使用时间",performance.now()-nt);



var nt=performance.now();
var ktp1=[];
var sx,sy;
for(var i =d3.length-1;i>=0;--i){
    sx=d3[i].p4.x-d3[i].p1.x;
    sy=d3[i].p4.y-d3[i].p1.y;
    var sx_i=1/sx,
        sy_i=1/sy;
    var p2x,p2y,p3x,p3y;
    p2x=(d3[i].p2.x-d3[i].p1.x)*sx_i;
    p2y=(d3[i].p2.y-d3[i].p1.y)*sy_i;
    p3y=(d3[i].p3.y-d3[i].p1.y)*sy_i;
    p3x=(d3[i].p3.x-d3[i].p1.x)*sx_i;
    var bezierObj=new UnitBezier(p2x,p2y,p3x,p3y);
    for(t=0;t<=1;t+=tspLength){
        // ktp1.push
        ({
            x:bezierObj.sampleCurveX(t)*sx+d3[i].p1.x,
            y:bezierObj.sampleCurveY(t)*sy+d3[i].p1.y
        });
    }
}
console.log(ktp1);
console.log("三次函数 使用时间",performance.now()-nt);
var i=1;
console.log(ktp1[i],ktp2[i])