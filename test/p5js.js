/*
 * @Date: 2022-05-19 18:31:06
 * @LastEditors: Darth_Eternalfaith
 * @LastEditTime: 2022-05-19 19:06:50
 * @FilePath: \PrimitivesTGT-2D_Editor\js\import\basics\test\p5js.js
 */
var canvas =document.getElementById('canvas');
/** @type {CanvasRenderingContext2D} */
var ctx =canvas.getContext("2d"),
    w=canvas.width,
    h=canvas.height;

class P5JS{
    constructor(n){
        this.x=[];
        this.y=[];
        this.s=[];
        this.color=[];
        this.o=[];
        this.init(n);
    }
    init(n){
        var mk,x,y;
        this.x.length=0;
        this.y.length=0;
        this.s.length=0;
        this.color.length=0;
        this.o.length=0;
        for(var i=n;i>0;--i){
            this.x.unshift(parseInt(1+Math.random()*(w-1)));
            this.y.unshift(parseInt(1+Math.random()*(h-1)));
            this.s.unshift(parseInt(1+Math.random()*((w>h?h:w)-1)*0.5));
            this.color.unshift("#"+
                parseInt(Math.random()*255).toString(16)+
                parseInt(Math.random()*255).toString(16)+
                parseInt(Math.random()*255).toString(16)
            );
            
            x=parseInt((1+Math.random())*(Math.random()>0.5?1:-1));
            y=parseInt((1+Math.random())*(Math.random()>0.5?1:-1));
            mk=1/Math.sqrt(x*x+y*y);
            x*=mk;
            y*=mk;
            this.o.unshift({x:x,y:y});
        }
    }
    step(){
        for(var i=this.x.length-1;i>=0;--i){
            this.x[i]+=this.o[i].x,
            this.y[i]+=this.o[i].y;
            if(this.x[i]>w){
                this.x[i]=0;
            }else if(this.x[i]<0){
                this.x[i]=w;
            }
            if(this.y[i]>h){
                this.y[i]=0;
            }else if(this.y[i]<0){
                this.y[i]=h;
            }
        }
        this.render();
    }
    render(){
        ctx.clearRect(0,0,w,h);
        for(var i=this.x.length-1;i>=0;--i){
            ctx.beginPath();
            ctx.fillStyle=this.color[i]
            ctx.rect(this.x[i],this.y[i],this.s[i],this.s[i]);
            ctx.fill();
        }
    }
}

function run(){
    requestAnimationFrame(function(){
        d.step();
        if(f){
            run();
        }
    })
}
var d=new P5JS(15);
var f=true;
run();