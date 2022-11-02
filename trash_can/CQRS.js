
// open * cqrs 读写分离 * open

    /** 动作记录器的缓存
     * @typedef Act_History_Cache
     * @property {Number} index 当前缓存对应动作记录器中的指令的下标
     * @property {Object} data 数据
     */
    /** 动作命令
     * @typedef Act_Command
     * @property {String}   message 命令的信息
     * @property {*[]}      path 路径
     * @property {*[]}      args 执行参数
     * @property {Function[]}[f_copy_args] 执行参数的copy函数,与执行参数下标对应
     * @property {*[][]}    [args_path] 进入路径时的参数, 有效长度为path的长度-1; temp= !args_path[i]? temp[path[i]] : temp[path[i]].apply(temp,args_path[i]);
     * @property {Boolean}  [isfnc] 该操作是否为函数, 默认否( 默认为赋值操作: obj[path[0]]...[path[l]]=atgs[0] );
     * @property {Boolean}  [can_overwrite] 是否允许覆盖操作 默认否
     */
    /** 动作记录器 */
    class Act_History{
        /** 
         * @param {Object} data 数据
         * @param {Function} [f_copy] 拷贝函数, 如果没有拷贝函数, 则只会进行浅拷贝
         */
        constructor(data,f_copy){
            /** @type {Act_History_Cache} 头部缓存 */
            this.head_cache;
            /** @type {Act_History_Cache} 当前缓存 */
            this.now_cache;
            /** @type {Act_History_Cache} 尾部缓存 */
            this.tail_cache;
            /** @type {function(data)} 数据的拷贝函数 */
            this.f_copy=f_copy?f_copy:Array.isArray(data)?Array.from:Object.copy;
            /**@type {Act_History_Cache[]} 快照缓存 由步长控制的缓存 */
            this.snapshot_cache=[];
            /**@type {Number} 派生快照缓存的步长, 为0时不会派生快照 */
            this.snapshot_step=0;
            /** @type {Act_Command[]} 命令记录 */
            this.act_command_history=[];

            this.head_cache={
                index:-1,
                data:this.f_copy(data)
            };
            this.now_cache={
                index:-1,
                data:this.f_copy(data)
            };
            this.tail_cache=this.now_cache;
            this.snapshot_cache.push(this.head_cache);
        }
        get now_data(){
            return this.now_cache.data;
        }
        /** 返回某个操作
         * @param {Number} index 对应命令的下标
         */
        back(index){
            this.now_cache=this.create_Cache(index);
        }
        /** 找到最近的缓存
         * @param {Number} index 对应指令的下标
         * @return {Act_History_Cache} 返回缓存
         */
        find_Cache(index){
            return this.snapshot_cache[select_Lut__Binary(this.snapshot_cache,index,"index")-1];
        }
        /** 使用历史记录创建缓存
         * @param {Number} index 对应指令的下标
         * @param {Act_History_Cache} [cache] 使用某条缓存
         * @returns 
         */
        create_Cache(index,cache){
            var temp=cache;
            if(temp&&(temp.index>index)){
                temp=this.find_Cache(index);
            }
            var i=temp.index;
            var rtn={
                index:index,
                data:this.f_copy(temp.data)
            }
            while(i<index){
                ++i;
                Act_History.run_Cmd(rtn.data,this.act_command_history[i]);
            }
            return rtn;
        }
        /** 加入指令
         * @param {Act_Command} cmd 新指令
         * @param {Boolean} [want_overwrite] 是否要覆盖操作 默认否
         * @return {*} 指令对应函数的返回
         */
        set_ActCommand(cmd,want_overwrite){
            var i=this.now_cache.index,j;
            var temp_cmd=this.act_command_history[i],
                args=Act_History.copy_CmdArgs(cmd);
            var temp1,temp2;

            temp1=Act_History.into_CmdPointer(this.now_cache.data,cmd);
            if(want_overwrite&&temp_cmd&&temp_cmd.can_overwrite){
                temp2=Act_History.into_CmdPointer(this.now_cache.data,temp_cmd);
            }
            if(this.act_command_history[i+1]){
                // 丢弃后面的指令
                this.act_command_history.splice(i,Infinity);
                // 丢弃快照
                for(j=this.snapshot_cache.length-1;j>=0;--j){
                    if(this.snapshot_cache[j].index<i){
                        break;
                    }
                }
                this.snapshot_cache.splice(j+1,Infinity);
            }

            if(this.snapshot_step){
                if((i-(j=this.snapshot_cache[this.snapshot_cache.length-1].index))>this.snapshot_step){
                    // 生成快照
                    this.snapshot_cache.push({
                        index:i,
                        data:this.f_copy(this.now_cache.data)
                    });
                }
            }
            if(temp1!==temp2){
                ++i; //不覆盖
            }
            this.act_command_history[i]=cmd;

            this.tail_cache=this.now_cache;
            var path=cmd.path;
            // 执行
            this.now_cache.index=i;
            if(cmd.isfnc){
                return temp1[path[path.length-1]].apply(temp1,args);
            }else{
                return temp1[path[path.length-1]]=args[0];
            }
        }
        /** 执行命令
         * @param {Object} tgt 数据
         * @param {Act_Command} cmd 命令
         * @return {*} 
         */
        static run_Cmd(tgt,cmd){
            var rtn=Act_History.into_CmdPointer(tgt,cmd);
            var path=cmd.path,
                args=Act_History.copy_CmdArgs(cmd);
            if(cmd.isfnc){
                return rtn[path[path.length-1]].apply(rtn,args);
            }else{
                return rtn[path[path.length-1]]=args[0];
            }
        }
        /** 进入 cmd 的指向位置
         * @param {Object} tgt 数据
         * @param {Act_Command} cmd 命令
         * @return {*}  返回倒数第二个, 最后操作 rtn[path[path.length-1]]=val; 或者rtn[path[path.length-1]].apply(rtn,args);
         */
        static into_CmdPointer(tgt,cmd){
            var temp=tgt,
                i=0,
                path=cmd.path||[],
                args_path=cmd.args_path||[],
                l=path.length;
            while(i<l-1){
                temp= !args_path[i]? temp[path[i]] : temp[path[i]].apply(temp,args_path[i]);
                ++i;
            }
            return temp;
        }
        /** 复制运行时使用的参数
         * @param {Act_Command} cmd 
         * @returns 
         */
        static copy_CmdArgs(cmd){
            if(cmd.f_copy_args){
                var rtn=new Array(cmd.args.length)
                for(var i=cmd.args.length-1;i>=0;--i){
                    if(cmd.f_copy_args[i]){
                        rtn[i]=cmd.f_copy_args[i](cmd.args[i]);
                    }else{
                        rtn[i]=cmd.args[i];
                    }
                }
                return rtn;
            }else{
                return cmd.args;
            }
        }
    }

    /**
     * @callback callback_GetData__ByPath
     * @param {*} tgt 源数据
     * @param {*} temp 上一次进入位置的数据
     * @param {Array<String|Number|callback_GetData__ByPath>} path 使用中的路径
     * @param {Number} index 路径下标
     * @return {*} 返回当前位置数据
     */
    /** 使用路径获取数据
     * @param {*} tgt 
     * @param {Array<String|Number|callback_GetData__ByPath>} path 进入数据位置的路径
     * @return {{data:*,data_parent:*}} 返回数据和它的父级
     */
    function get_Data__ByPath(tgt,path){
        var data=tgt,data_parent=null;
        for(var i in path){
            data_parent=data;
            if(typeof path[i] === "function"){
                data=path[i](tgt,data,path,i);
            }else{
                data=data[path[i]];
                console.log(data);
            }
        }
        return {data:data,data_parent:data_parent};
    }
    
// end  * cqrs 读写分离 * end 