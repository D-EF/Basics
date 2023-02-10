/*
 * @Author: Darth_Eternalfaith darth_ef@hotmail.com
 * @Date: 2022-11-03 01:04:40
 * @LastEditors: Darth_Eternalfaith darth_ef@hotmail.com
 * @LastEditTime: 2022-12-18 23:11:07
 * @FilePath: \site\js\import\Basics\Lib\Expand_OO.js
 * @Description: 面向对象拓展
 * 
 * Copyright (c) 2022 by Darth_Eternalfaith darth_ef@hotmail.com, All Rights Reserved. 
 */


number.copy=Boolean.copy=String.copy=function(tgt){return tgt;}
Object.copy=function(tgt){return Object.assign({},tgt);}
Array.copy=function(tgt){return Array.from(tgt);}
Map.copy=function(tgt){return new Map(tgt);}

/** 迭代器抽象类 */
class  Iterator__MyVirtual{
    constructor(data){
        this.data=data;
    }
    /** 初始化
     * @virtual
     */
    init(){}
    
    /** 是否遍历完
     * @virtual
     */
    is_NotEnd(){}

    /** 下一个
     * @virtual
     */
    next(){}
    
    /** 当前数据
     * @virtual
     * @return {*} 返回当前
     */
    get_Now(){}
}

/** 树结构迭代器 */
class Iterator__Tree extends Iterator__MyVirtual{
    
    /** 缺血模型的树节点
     * @typedef TreeNode
     * @property {*} data 
     * @property {*[]} children 
     */
    
    /** 
     * @param {TreeNode} data 
     * @param {string} childrenKey 
     */
    constructor(data,childrenKey="children"){
        super(data);
        this.childrenKey=childrenKey;
        this._gi=[];
        this._gg=[];
        this._path=[];
        this._now_path=[];
        this._now_node_path=[];
    }
    /** 获取子节点列表
     * @param {TreeNode} item 
     * @return {Array}
     */
    _get_Itemchildren(item){
        if(this.childrenKey){
            return item[this.childrenKey];
        }else{
            return item;
        }
    }
    /** 获取目标深度的父节点
     * @param {number} depth 
     * @return {TreeNode}
     */
    _get_Parent(depth){
        return (depth?this._gg[depth-1]:this.data);
    }
    init(){
        this._depth=0;
        this._t_depth=0;
        this._gi.length=1;
        this._gi[0]=0;
        this._path.length=1
        this._path[0]=0;
        this._gg.length=1;
        this._gg[0]=this.data;
        this._di=0;
        this._now_path.length=0;
        this._now_node_path.length=0;
        this.next();
        if(!this._get_Itemchildren(this.data).length){
            this._depth=-1;
        }
    }
    is_NotEnd(){
        return this._depth>=0;
    }
    next(){
        this._di++;
        var gg=this._gg,
        path=this._path,
        gi=this._gi,
        d=this._t_depth,
        od=this._depth,
        temp;
        
        if(d<0){
            this._depth=d;
            return;
        }
        gg[d]=this._get_Itemchildren(this._get_Parent(d))[gi[d]];
        path.length=d+1;
        path[d]=gi[d];
        this._now_path.splice(0,Infinity,...path);
        this._now_node_path.splice(0,Infinity,...gg);
        do{
            if(gg[d]!=undefined){
                od=d;
                this._depth=od;
                temp=this._get_Itemchildren(gg[d]);
                if(temp&&temp.length){
                    // 下潜
                    ++d;
                    gi[d]=0;
                    gg[d]=this._get_Itemchildren(this._get_Parent(d))[gi[d]];
                }
                else{
                    // 上潜
                    gi[d]++;
                    if(this._get_Itemchildren(this._get_Parent(d))[gi[d]]===undefined){
                        break;
                    }
                }
                this._t_depth=d;
                return;
            }
        }while(0);
        do{
            --d;
            ++gi[d];
        }while(d>=0&&((gg[d]=this._get_Itemchildren(this._get_Parent(d))[gi[d]])===undefined));
        // this._depth=od;
        this._t_depth=d;
    }
    /** 获取当前节点 */
    get_Now(){
        return this._gg[this._depth];
    }
    /**获取当前路径 (node形式) */
    get_Now__NodePath(){
        return Array.from(this._now_node_path);
    }
    /** 获取当前路径
     * @return {number[]} 返回下标形式的路径
     */
    get_Now__Path(){
        return Array.from(this._now_path);
    }
    /** 获取当前迭代的次数
     * @return {number} 当前是第几次迭代
     */
    get_Now__Di(){
        return this._di;
    }
    /** 获取当前迭代的次数
     * @return {number} 当前是第几次迭代
     */
    get_Now__Depth(){
        return this._depth;
    }
}


// open * 依赖注入 * open
    /** 使用依赖的对象
     * @typedef HadDependencyObject
     * @property {Map<string,Delegate>} _dependency_mapping_delegates   set时的委托集合
     * @property {Map<string,DependencyMapping_Notbook>} _dependency_mapping_notbook 记录依赖的对象的集合
     */
    /** 记录依赖的item
     * @typedef DependencyMapping_Notbook
     * @property {HadDependencyObject} rely_on_TGT 依赖的对象
     * @property {string} rely_on_key 依赖的key
     */
    /** 依赖的数据修改时的回调函数
     * @callback DependencyListener_Callback
     * @param {*} new_val             新值
     * @param {*} old_value           旧值
     * @param {Object} root_data      数据来源 (root)
     * @param {Object} head_dependenc 第一个依赖者, 依赖注入 头部 
     */
    
    /** 映射依赖 (读取 tgt[key] 会得到 rely_on_TGT[key])
     * @param {HadDependencyObject} tgt 要操作的对象
     * @param {*} rely_on_TGT     数据来源
     * @param {string[]} keys   tgt上的key
     * @param {string[]} [_rely_on_keys] 可选参数 relyOnTGT上的key, 下标和keys要对应
     * @return {HadDependencyObject} 返回 tgt 
     */
    function dependencyMapping(tgt,rely_on_TGT,keys,_rely_on_keys){
        var rely_on_keys=_rely_on_keys||keys;
        var map=tgt._dependency_mapping_notbook;
        if(!map){
            map=tgt._dependency_mapping_notbook=new Map();
        }
        for(let i=keys.length-1;i>=0;--i){
            Object.defineProperty(tgt,keys[i],{
                get() { return rely_on_TGT[rely_on_keys[i]]; },
                /** @this {HadDependencyObject} */
                set(val){
                    var old=rely_on_TGT[rely_on_keys[i]];
                    rely_on_TGT[rely_on_keys[i]]=val;
                    this._dependency_mapping_delegates&&
                    this._dependency_mapping_delegates.has(keys[i])&&
                    this._dependency_mapping_delegates.get(keys[i])(val,old,rely_on_TGT,this);
                }
            });
            map.set(keys[i],{rely_on_TGT:rely_on_TGT,rely_on_key:rely_on_keys[i]});
        }
        return tgt;
    }
    /** 寻找依赖的根部
     * @param {*} tgt 使用了依赖的对象
     * @param {string} key key
     * @return {{root:DependencyMapping_Notbook,head:DependencyMapping_Notbook}} 返回根部对象(数据来源) 和 第一次派生依赖的对象 和 key
     */
    function get_Root__DependencyMapping(tgt,_key){
        var root={rely_on_TGT:tgt ,rely_on_key:_key},
            head={rely_on_TGT:root,rely_on_key:_key},
            map=tgt._dependency_mapping_notbook,
            key=_key;
        while(map&&map.has(key)){
            head=root;
            root=map.get(key);
            map=root.rely_on_TGT._dependency_mapping_notbook;
            key=root.rely_on_key;
        }
        return {root:root,head:head};
    }

    /** 添加依赖的数据修改时的委托; 注意: 当直接使用root对象进行修改时 委托不会被执行
     * @param {HadDependencyObject} tgt 使用了依赖的对象
     * @param {string} key 成员变量名
     * @param {DependencyListener_Callback} callback 回调函数  this 指向 tgt, 不能在这里再给属性赋值; 如果必要,直接修改root的内容
     */
    function add_DependencyListener(tgt,key,callback){
        var temp=get_Root__DependencyMapping(tgt,key);
        var handMain=temp.head;
        if(!handMain.rely_on_TGT._dependency_mapping_delegates){
            handMain.rely_on_TGT._dependency_mapping_delegates=new Map();
        }
        if(!handMain.rely_on_TGT._dependency_mapping_delegates.has(handMain.rely_on_key)){
            handMain.rely_on_TGT._dependency_mapping_delegates.set(handMain.rely_on_key,Delegate._create());
        }
        handMain.rely_on_TGT._dependency_mapping_delegates.get(handMain.rely_on_key).addAct(tgt,callback);
    }

    /** 移除某个依赖下的某个成员的某个回调函数
     * @param {HadDependencyObject} tgt 使用了依赖的对象
     * @param {string} key 成员变量名
     * @param {DependencyListener_Callback} callback 调用 add_DependencyListener 时使用的函数
     */
    function remove_DependencyListener(tgt,key,callback){
        var temp=get_Root__DependencyMapping(tgt,key);
        var handMain=temp.head;
        if(handMain.rely_on_TGT._dependency_mapping_delegates.has(handMain.rely_on_key)){
            handMain.rely_on_TGT._dependency_mapping_delegates.get(handMain.rely_on_key).removeAct(tgt,callback);
        }
    }

    /** 移除某个依赖来源下的某个成员的所有回调函数
     * @param {HadDependencyObject} tgt 使用了依赖的对象
     * @param {string} key 成员变量名
     */
    function remove_DependencyListener_all(tgt,key){
        var temp=get_Root__DependencyMapping(tgt,key);
        var handMain=temp.head;
        if(handMain.rely_on_TGT._dependency_mapping_delegates.has(handMain.rely_on_key)){
            handMain.rely_on_TGT._dependency_mapping_delegates.delete(handMain.rely_on_key);
        }
    }
// end  * 依赖注入 * end 




export{
    Iterator__MyVirtual,
    Iterator__Tree,

    dependencyMapping,
    get_Root__DependencyMapping,
    add_DependencyListener,
    remove_DependencyListener,
    remove_DependencyListener_all,
}