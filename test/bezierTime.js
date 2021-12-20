/*!
 * 性能测试
 */

var t=0;
//此处修改曲线精度
var tspLength=0.001;
//此处修改数据长度
var d_length=100000;



var d=new Array(d_length);
for(var i =d.length-1;i>=0;--i){
    d[i]=[
        {x:Math.random()*100,y:Math.random()*100},
        {x:Math.random()*100,y:Math.random()*100},
        {x:Math.random()*100,y:Math.random()*100},
        {x:Math.random()*100,y:Math.random()*100}
    ];
}
var kpt2=[];
var nt=performance.now();
for(var i =d.length-1;i>=0;--i){
    for(t=0;t<=1;t+=tspLength){
        // kpt2.push
        (
        getBezierCurvePoint(d[i],t)
    )
    }
}
console.log(kpt2);
console.log("使用时间",performance.now()-nt);



var d=new Array(d_length);
for(var i =d.length-1;i>=0;--i){
    d[i]={
        p1:{x:Math.random()*100,y:Math.random()*100},
        p2:{x:Math.random()*100,y:Math.random()*100},
        p3:{x:Math.random()*100,y:Math.random()*100},
        p4:{x:Math.random()*100,y:Math.random()*100}
    }
}
var nt=performance.now();
var ktp1=[];
var sx,sy;
for(var i =d.length-1;i>=0;--i){
    sx=d[i].p4.x-d[i].p1.x;
    sy=d[i].p4.y-d[i].p1.y;
    var p2x,p2y,p3x,p3y;
    p2x=d[i].p2.x*sx;
    p2y=d[i].p2.y*sy;
    p3y=d[i].p3.y*sy;
    p3x=d[i].p3.x*sx;
    var bezierObj=new UnitBezier(p2x,p2y,p3x,p3y);
    for(t=0;t<=1;t+=tspLength){
        // ktp1.push
        ({
            x:bezierObj.sampleCurveX(t),
            y:bezierObj.sampleCurveY(t)
        });
    }
}
console.log(ktp1);
console.log("使用时间",performance.now()-nt);