/*
 * @Author: Darth_Eternalfaith
 * @Date: 2022-05-15 14:02:04
 * @LastEditors: Darth_Eternalfaith
 * @LastEditTime: 2022-05-15 14:55:11
 * @FilePath: \PrimitivesTGT-2D_Editor\js\test\c.js
 * 
 */

const deg=Math.PI/180,
      arc_c1s4=90*deg;

function get_CanvasData(){
    /** @type {HTMLCanvasElement} */
    var canvas=document.getElementById("cnm");
    var ctx=canvas.getContext("2d");
    var w=canvas.width,h=canvas.height;
    return {
        canvas,
        ctx,
        w,
        h
    };
}

// 1 角落画形状 圆角矩形 open
    /**
     * @param {CanvasRenderingContext2D} ctx
     * @param {Number} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     * @param {Number} r
    */
    function render_ArcRect(ctx,x,y,w,h,r){
        var c=[
            [x+r,y+r],
            [x+w-r,y+r],
            [x+w-r,y+h-r],
            [x+r,y+h-r]
        ];
        var temp=arc_c1s4*2;
        for(var i=0;i<4;++i){
            ctx.arc(c[i][0],c[i][1],r,temp,temp+arc_c1s4);
            temp+=arc_c1s4;
        }
        ctx.closePath();
        ctx.stroke();
    }
    
    function main1(){
        var {ctx,w,h}=get_CanvasData();
        render_ArcRect(ctx,0,0,w,h,20);
    }
    // main1();
// 1 角落画形状 圆角矩形 end


// 4 三分法 构图网格 open
    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Number} w 
     * @param {Number} h 
     * @param {Number} sp_i 
     */
    function render_SPGrid(ctx,w,h,sp_i){
        var sp=1/sp_i,
            dx,dy;
        var w1s3=dx=w*sp,
            h1s3=dy=h*sp;
        ctx.beginPath();
        ctx.strokeStyle="#0f0";
        for(var i=sp_i-1;i>=0;--i){
            ctx.moveTo(dx,0);
            ctx.lineTo(dx,h);
            ctx.moveTo(0,dy);
            ctx.lineTo(w,dy);
            dx+=w1s3;
            dy+=h1s3;
        }
        ctx.stroke();
    }
    function main4(){
        var {canvas,ctx}=get_CanvasData();
        var img=new Image();
        img.src="https://img1.baidu.com/it/u=2128945846,74379505&fm=253&fmt=auto&app=138&f=JPEG?w=450&h=300"
        img.onload=function(){
            var w=canvas.width=img.width;
            var h=canvas.height=img.height;
            ctx.drawImage(img,0,0,w,h);
            render_SPGrid(ctx,w,h,3);
        }
    }
    main4();

// 4 三分法 构图网格 end