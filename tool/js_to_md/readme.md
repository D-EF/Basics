<!--
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2022-10-20 21:19:37
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2022-10-20 23:52:50
 * @FilePath: \site\js\import\Basics\tool\js_to_md\readme.md
 * @Description: 
 * 
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
-->
# 使用js代码文件生成文档
*该文档最后编辑于 2022-10-20*

## 示例 
* [demo.js](./demo.js)
* [demo.md](./demo.md)

## 代码规范与md生成规则
### 代码规范命名 (比较疏松的规范, 并不影响生成文档)
* 类名使用大驼峰命名
    ```
        如 class HashListener
    ```
* 变量, 属性(成员变量) 使用 下划线命名 
    ``` 
        this.now_cache 
    ```
* 函数(方法) 使用 动词+下划线+大驼峰命名, 如果有同名函数/类的不同算法实现或是同操作的不同情况的处理, 使用一个或两个下划线分隔再加上后缀
    ```
        class Matrix_3
        static create_Projection__Orthographic(normal)
    ```
* 静态变量使用大写字母和下划线
    ```
        const DEG_180
    ```
* 私有成员 / module中不导出的变量 / 可选的函数形参 使用下划线作为首字符
    ```
        static _MAPPING_SHEAR_AXIS_TO_INDEX
        var _BEZIER_MATRIXS
        static inverse__Transform(m,_n)
    ```
    

### 编码规范(这将影响md文档生成)
* 所有类/函数前必须有块注释, 并且使用 jsDoc 格式编辑, 函数主要说明要放在'/**'的同一行, 下面的每一行都要以星号开始, 使用```插入代码注释时各行前也需要加上星号
* 所有成员变量必须在构造函数中声明完, 并且要在成员变量前一行加上 **@type** 注释
* 所有需要文档的静态成员变量要在 构造函数后 其他成员函数前 定义完, 并且每个变量都要在前一行加入 **@type** 注释
* 工具会使用缩进控制几级标题生成,每缩进四个空格或一个制表位就会加一级 编码时建议使用缩进作为折叠策略 
    ```json
    //在工作区设置或在全局设置
    //vscode's settings.json  or  {project}.code-workspace
    {
        //...
        "settings":{
            //...
            "editor.foldingStrategy": "indentation"
        }
    }
    ```
### 特殊注释格式 
* 使用 **//# {title}** 可以添加标题
* 使用 "**// open * {title} * open\n**" 和 "**// end  * {title} * end \n**" 来分隔代码, 工具会使用它们生成标题。
* 使用 **/\*h\*/** 作为前缀 可以令某行不加入到md中
* 在代码行前加入 **/\*\*/** 以保持缩进 和 使用 **// ```** 囊括代码, 令代码直接放置在md中
    ```
    //```
    /**/    /** 配置 */
    /**/    var config={
    /**/        /** @type {Number} 1角度的弧度表示 */
    /**/        DEG:Math.PI/180,
    /**/    }
    //```
    ```