/*   
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com   
 * @Date: 2022-10-20 21:19:37   
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com   
 * @LastEditTime: 2022-10-20 23:34:49   
 * @FilePath: \site\js\import\Basics\tool\js_to_md\demo.js   
 * @Description:    
 *    
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved.    
 */   
   
# 第一级标题1   
```   
    /** 配置 */   
    var config={   
        /** @type {Number} 1角度的弧度表示 */   
        DEG:Math.PI/180,   
    }   
```   
   
# 第一级标题2   
   
## class Demo  示例的类    
   
### 构造函数 new Demo(param1)  constructor   
 * @param {Number} param1 参数1   
   
#### 属性(成员变量)   
* Demo.prototype.data   
* Demo.prototype.index   
   
### 静态属性 成员变量    
#### static _c  @type {Number} 实例化次数   
#### static obj  @type {object} demo静态成员变量(对象)   
```   
static obj={   
asd:123   
};   
   
```           
### 方法 成员函数   
   
#### calc_DemoFunction(x)  这是将放入标题的一行说明   
 * demo二次函数   
 ```   
 * f(x)=x^2+x+1   
 ```   
 * @param {Number} x 参数x   
 * @return {Number} 返回y   
   
   
#### get_Index()  获取索引   
 * @returns {Number}   
   
   

   
## function clac_DemoFunction__Outsize(x)    
 * 全局demo函数   
 ```   
 * f(x)= |x|^3   
 ```   
 * @param {Number} 传入参数x   
 * @return {Number} 返回y   
   
   
