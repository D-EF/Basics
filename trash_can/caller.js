/** def牌 广播员 */
class DEF_Caller{
    constructor(){
        this._listeners=[];
        /** @type {Object<Delegate>} */
        this._callbacks={};
    }
    /** 创建监听者
     * @param {{key:Function}} callbacks 回调函数集合 属性全为 Function 的对象
     * @return {Array} 返回一个数组
     */
    create_Listener(callbacks){
        var rtn=[];
        this.add_Listener(rtn,callbacks)
        return rtn;
    }
    /** 增加 监听者(订阅者) 
     * @param {*} tgt 监听者 给回调函数当this指向用的
     * @param {{key:Function}} callbacks 回调函数集合 属性全为 Function 的对象
     * @return {DEF_Caller} 返回当前的对象
     */
    add_Listener(tgt,callbacks){
        var keys=Object.keys(callbacks),
            i=keys.length-1,
            key="";
        
        this._listeners.push(tgt);

        for(;i>=0;--i){
            key=keys[i];
            if(!this._callbacks[key]){
                this._callbacks[key]=Delegate._create();
            }
            this._callbacks[key].addAct(tgt,callbacks[key]);
        }
        return this;
    }
    /** 移除监听者
     * @param {*} tgt 
     * @return {DEF_Caller}
     */
    remove_Listener(tgt){
        var keys=Object.keys(callbacks),
            i=keys.length-1,
            key="";
        for(;i>=0;--i){
            key=keys[i];
            this._callbacks[key].removeActs_ByTGT(tgt);
        }
        this._listeners.lastIndexOf(tgt);
    }
    call(key){
        var _key=key;
        var args=Array.from(arguments);
        args.shift();
        this._callbacks[_key].apply(this,args);
    }

    /** 预设的 移除 回调, 将对应的项移除
     * @this  {Array}  this指向当前的监听者数据
     * @param {number} op 被修改的项的下标(起点)
     * @param {number} length 被修改的长度
     */
    static _remove_Def(op,length){
        this.splice(op,length);
    }
    /** 预设的 插入 回调, 在监听者中插入null
     * @this  {Array}  this指向当前的监听者数据
     * @param {number} op 被修改的项的下标(起点)
     * @param {Array} values 插入的内容集合
     */
    static _insert_Def(op,values){
        var l=values.length,
            insp=new Array(l);
        for(--l;l>=0;--l){
            insp[l]=null;
        }
        insp.unshift(0);
        insp.unshift(op);
        Array.prototype.splice.apply(this,insp);
    }
    /** 预设的 修改 回调, 将监听者中的与修改的内容相同下标的item设为null
     * @this  {Array}  this指向当前的监听者数据
     * @param {number} op 被修改的项的下标(起点)
     * @param {number} ed 被修改的项的下标(终点)
     */
    static _update_Def(op,ed){
        var i=op;
        do{
            this[i]=null;
        }while(i<ed);
    }
}