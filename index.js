/*
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2022-10-07 16:55:37
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2022-11-03 01:45:27
 * @FilePath: \site\js\import\Basics\index.js
 * @Description: index
 * 
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */
import * as m1 from "./LIB/Expand_Basics.js";
import * as m2 from "./LIB/Expand_Bom.js";
import * as m3 from "./LIB/Expand_Dom.js";
import * as m4 from "./LIB/Expand_File__CueMediaObj.js";
import * as m5 from "./LIB/Expand_File.js";
import * as m6 from "./LIB/Expand_List.js";
import * as m7 from "./LIB/Expand_OO.js";

const Basics ={
    ...m1,
    ...m2,
    ...m3,
    ...m4,
    ...m5,
    ...m6,
    ...m7,
}
export default Basics;
export {
    Basics
}