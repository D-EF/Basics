import { callback_CalcErr__ErrLog } from "./base__test.js";
import { 
    canBeNumberChar, 
    create_TemplateStringRenderer, 
    Date_Callback, 
    Delegate, 
    inherit_Class, 
    Overload_Function, 
    select_Lut__Binary, 
    Stepper, 
    strToVar,
    write_TemplateDate
} from "../Lib/Expand_Basics.js";

/** */
var delegate__test=new Delegate();

/**
 * @call ol
 * @param {String|Number|Array|Map} target
 * @param {Array} key
 * @return {string}
 */
var ol=new Overload_Function(    function()      {return "def";});
ol.addOverload([String],         function(str)   {return "params:[String]"});
ol.addOverload([Number],         function(n)     {return "params:[number]"});
ol.addOverload([Array],          function(n)     {return "params:[Array]"});
ol.addOverload([Object,Array],   function(n)     {return "params:[Object,Array]"});


delegate__test.addAct(globalThis,function(){
    console.log("\n\n testing overload! \n");
    console.log(`ol("asd")       -`,   ol("asd"),       callback_CalcErr__ErrLog(ol("asd")       ==="params:[String]"));
    console.log(`ol(123)         -`,   ol(123),         callback_CalcErr__ErrLog(ol(123)         ==="params:[number]"));
    console.log(`ol([123])       -`,   ol([123]),       callback_CalcErr__ErrLog(ol([123])       ==="params:[Array]"));
    console.log(`ol({a:1},[1])   -`,   ol({a:1},[1]),   callback_CalcErr__ErrLog(ol({a:1},[1])   ==="params:[Object,Array]"));
});

var d=new Date_Callback();
d.add_Callback("ever minute",60000,60000-Date.now()%60000,function(now){
    console.log("\ncallback ever minute 1",now,new Date(now).toString("%Y4-%M2-%D2 %h2:%m2:%s2"))
    console.log('');
})


delegate__test.addAct(globalThis,function(){
    console.log("\n\n testing write_TemplateDate! \n");
    var date=new Date();
    console.log("write_TemplateDate.call   >> ",write_TemplateDate.call(date,"%Y4-%M2-%D2 %h2:%m2:%s2"));
    console.log("date.toString             >> ",date.toString("%Y4-%M2-%D2 %h2:%m2:%s2"));
});

delegate__test.addAct(globalThis,function(){
    console.log("\n\n testing Stepper! \n");
    var step=new Stepper(0,6,0);
    step.set(123);
    console.log("step[0,6] set 123 >> ", step.valueOf());
    for(var i=10;i>0;--i){
        step.next(1);
        console.log("step[0,6] next(1) >> ", step.valueOf());
    }
});

delegate__test.addAct(globalThis,function(){
    function ASD(){
        this.a=1;
    }
    ASD.prototype.fnc_a=function(){
        return 'fnc_a__'+this.a;
    }
    function QWE(){
        ASD.apply(this,arguments);
        this.b=2;
    }
    inherit_Class(ASD,QWE);
    QWE.prototype.fnc_b=function(){
        this.fnc_a
        return "fnc_b__"+this.b;
    }
    var asd=new ASD();
    var qwe=new QWE();
    console.log("\n\n testing inherit_Class! \n");
    console.log('asd >> ',asd);
    console.log('qwe >> ',qwe);
    console.log("qwe.fnc_a >> ",qwe.fnc_a());
    console.log("qwe.fnc_b >> ",qwe.fnc_b());
})

// select_Lut__Binary()

// create_TemplateStringRenderer()

// strToVar()

// canBeNumberChar()

export {
    delegate__test as test
}