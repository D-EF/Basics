/*!
 * 用于读取 cue 格式和存储到 js 的
 */

/*
 * @Date        : 2022-01-11 14: 27: 30
 * @LastEditors: Darth_Eternalfaith
 * @LastEditTime: 2022-01-11 18:35:34
 * @FilePath: \def-web\js\basics\cue_media_obj.js
 */

import {inheritClass,OlFunction} from "./Basics.js"
/**
 * 存储 cue 格式为js的obj格式
 * 参考资料来自: https: //tieba.baidu.com/p/6160083867
 */
 function DEF_CUEOBJ(){
    this.performer  = "";
    this.songwriter = "";
    this.title      = "";
    this.file       = "";
    this.fileType   = "";
    this.rem        = [];
    this.track      = [];
}
DEF_CUEOBJ.prototype={
    /**
     * 查找rem指令
     * @param {String} rem1 rem 的 第一个指令
     * @returns {String[][]}
     */
    selectRem:function(rem1){
        var rtn = [];
        for(var i=this.rem.length-1;i>=0;--i){
            if(this.rem[i][1]&& this.rem[i][1]===rem1){
                rtn.push(this.rem[i]);
            }
        }
        return rtn;
    },
    /** 处理 rem 命令的集合 */
    setCommand:{
        // 在此处添加对cue格式的指令的处理
        // 由于我只需要处理音乐文件的 所以省略了很多指令
        /**
         * @param {String[]} _cl 指令的字符串数组
         */
        rem:function(_cl){
            this.rem.push(_cl);
        },
        file:function(_cl){
            this.file     = _cl[1];
            this.fileType = _cl[2];
        },
        title:function(_cl){
            this.title = _cl[1];
        },
        performer:function(_cl){
            this.performer = _cl[1];
        },
        songwriter:function(_cl){
            this.songwriter = _cl[1];
        },

        // track
        // 因为js的继承反射内容是复制这个对象的引用，所以即使是在子类追加也会追加到基类上，非常拉跨。   所以我把子类的反射的内容写在基类上了.
        
        index:function(_cl){
            var indexNub = parseInt(_cl[1]);
            var time     = cue_timeToSecond(_cl[2]);
            var lastTrack;
            if(this.root.track.length-2>=0){
                lastTrack = this.root.track[this.root.track.length-2];
            }
            switch(indexNub){
                case 1: 
                    this.op = time;
                    if(lastTrack&&(lastTrack.ed===undefined)){
                        lastTrack.ed = time;
                    }
                break;
                case 0: 
                    lastTrack.ed = time;
                break;
                default: 
                    this.indexList.push(time);
                break;
            }
        }
    }
}
/**
 * cue 的一截轨道内容
 * @param {String}      file        文件路径
 * @param {DEF_CUEOBJ}  root        根 对象
 * @param {Number}      trackIndex  轨道序号
 */
function DEF_CUEOBJTrack(file,root,trackIndex){
    this.performer  = "";
    this.songwriter = "";
    this.title      = "";
    this.ListIndex;
    this.rem        = [];
    this.trackIndex = trackIndex;
    this.root       = root;
    this.file       = file;
    this.op;    //秒
    this.ed;
    this.indexList = [];
}
inheritClass(DEF_CUEOBJ,DEF_CUEOBJTrack);

DEF_CUEOBJTrack.prototype.getDuration=function(){
    return this.ed-this.op;
}

/**
 * 把cue的表示时间的格式转换成秒
 * @param {String} timeStr mm: ss: ff
 * @returns {Number}
 */
function cue_timeToSecond(timeStr){
    var temp = timeStr.split(':');
    
    return parseInt(temp[0])*60+parseInt(temp[1])+parseInt(temp[2])/75;
}
/**
 * 解析 cue 格式 的字符串
 * @param {String} str 
 */
function loadCue(str){
    var p = 0, q = 0, isQuotes = false;
    var tempStr;
    var rtn         = new DEF_CUEOBJ();
    var that        = rtn;
    var CommandList = [];
    for(;p<str.length;++p){
        if(str[p]!=' '){
            for(q=p;(p<=str.length);++p){
                if(str[p]==='\"'){
                    isQuotes = !isQuotes;
                    if(isQuotes){
                        q = p+1;
                    }
                }
                if((str[p]===' ')&&(!isQuotes)){
                    // 记录指令
                    if(str[p-1]==='\"'){
                        tempStr = str.slice(q,p-1);
                    }else{
                        tempStr = str.slice(q,p);
                    }
                    CommandList.push(tempStr);
                    q = p+1;
                }
                else if((str[p]==="\n")||(str[p]==="\r")||(str.length===p)){
                    // 换行 进入下一条指令
                    if(str[p-1]==='\"'){
                        tempStr = str.slice(q,p-1);
                    }else{
                        tempStr = str.slice(q,p);
                    }
                    CommandList.push(tempStr);

                    if(CommandList[0].toLowerCase()==="track"){
                        that = new DEF_CUEOBJTrack(rtn.file, rtn, rtn.track.length);
                        rtn.track.push(that);
                    }
                    else{
                        if(that.setCommand[CommandList[0].toLowerCase()]){
                            that.setCommand[CommandList[0].toLowerCase()].call(that,CommandList);
                        }
                        else{
                            // 不支持这个指令
                        }
                    }

                    do{ ++p; } while((str[p+1]==="\n")||(str[p+1]==="\r"));
                    CommandList = [];
                    break;
                }
            }
        }
    }
    return rtn;
}

/** 
 * 查找图片文件
 * @param {String} _rootUrl 根目录
 * @param {String[]} _nameList 文件名列表
 * @param {String[]} _afertList 后缀名列表
 * @param {Function} callBack 搜索完成的回调函数 callBack({String[]}); 参数是搜索到的所有文件路径的列表
 */
function selectImg(_rootUrl,_nameList,_afertList,callBack){
    var temp = new Array(_afertList.length);
    var c    = 0, ctgt = _afertList.length*_nameList.length;
    var rtn  = [];
    for(var i=temp.length-1;i>=0;--i){
        temp[i]        = new Image();
        temp[i].onload = function(){
            rtn.push(this.src);
            c++;
            if(c>=ctgt){
                callBack(rtn);
            }
            else{
                this.n_index += 1;
                if(this.n_index>=_nameList.length)return;
                this.src = _rootUrl+_nameList[this.n_index]+this.n_afert;
            }
        }
        temp[i].onerror=function(e){
            c++;
            if(c>=ctgt){
                callBack(rtn);
            }
            else{
                this.n_index += 1;
                if(this.n_index>=_nameList.length)return;
                this.src = _rootUrl+_nameList[this.n_index]+this.n_afert;
            }
        }
        temp[i].n_index = 0;
        temp[i].n_afert = _afertList[i];
        temp[i].src     = _rootUrl+_nameList[temp[i].n_index]+temp[i].n_afert;
    }
    // callBack(rtn);
}

/** 
 * 给我的 audio 控制器 用的数据对象
 */
class DEF_MediaObj{
    /**
     * @param {String}  scr     媒体文件的 url
     * @param {String}  title   标题
     */
    constructor(src,title){
        this.title      = "";
        this.cover      = [];
        this.artist     = "";
        this.songwriter = "";
        this.performer  = "";
        this.album      = "";

        this.op       = 0;
        this.ed       = 0;
        this.duration = 0;
        this.mark     = new DEF_MediaObjMarkList();

        this.urlList = [];
        if(src){
            this.title = src;
            this.urlList.push(src);
        }
        if(title){
            this.title = title;
        }
    }
    /**
     * 通过路径创建mediaObj, 并尝试读取 ID3
     * @param {String} src  媒体的链接
     * @param {Function} callback 读取 id3 之后的回调 callback(rtn{DEF_MediaObj})
     */
    static f(src,callback){
        var rtn   = new DEF_MediaObj(src);
        var after = src.slice(src.lastIndexOf('.'));
        if(after===".mp3"){
            ID3.loadTags(src,function(){
                var tags  = ID3.getAllTags(src);
                var image = tags.picture;
                if (image) {
                    var base64String = "";
                    for (var i = 0; i < image.data.length; i++) {
                        base64String += String.fromCharCode(image.data[i]);
                    }
                    var base64 = "data:" + image.format + ";base64," +
                            window.btoa(base64String);
                    rtn.cover.push(base64);
                }
                if(tags.title) rtn.title   = tags.title;
                if(tags.artist) rtn.artist = tags.artist;
                if(tags.album) rtn.album   = tags.album;
                callback(rtn);
            },
            {tags: ["title","artist","album","picture"]});
        }
        return rtn;
    }
    /**
     * 拷贝以创建一个 DEF_MediaObj
     * @param {Object} baseObj
     * @returns {DEF_MediaObj}
     */
    static copy(baseObj){
        var rtn = new DEF_MediaObj();
        Object.assign(rtn,baseObj);

        rtn.urlList = new Array(i);
        if(baseObj.urlList){
            var i           = baseObj.urlList.length;
                rtn.urlList = new Array(i);
            for(--i;i>=0;--i){
                rtn.urlList[i] = this.urlList[i];
            }
        }
        rtn.mark = new DEF_MediaObjMarkList();
        if(baseObj.mark){
            for(i=0;i<this.mark.list;++i){
                rtn.mark.list[i] = this.mark.list[i].copy();
            }
        }
        return rtn;
    }
    /**
     * 克隆以创建一个 DEF_MediaObj
     * @param {Object} baseObj
     * @returns {DEF_MediaObj}
     */
    static clone(baseObj){
        var rtn = new DEF_MediaObj();
        Object.assign(rtn,baseObj);
        return rtn;
    }
    /**
     * 获取 "Artist" 编曲者 and 演唱者
     */
    getArtist(){
        return this.performer + "/" + this.songwriter;
    }
    /**
     * 克隆当前对象
     * @returns {DEF_MediaObj}
     */
    clone(){
        return DEF_MediaObj.clone(this);;
    }
    /**
     * 拷贝当前对象
     * @returns {DEF_MediaObj}
     */
    copy(){
        return DEF_MediaObj.copy(this);
    }
}

/**
 * 获取当前轨道的长度
 * @param {Audio} audio 当前正在播放这个文件的 Audio 元素
 * @param {Function} _callback _callback({Number}Duration) 某些情况无法直接获取当前的长度，所以需要传入回调函数接收值
 * 3个重载 fnc(audio) 和 fnc(callback); 用 audio 的重载可以返回长度, 可以不用 callback
 */
DEF_MediaObj.prototype.getDuration = OlFunction.create();
DEF_MediaObj.prototype.getDuration.addOverload([Function],
    function(_callback){
        var that = this;
        if(!this.ed){
            var tempAudio = new Audio(), tempHTML = [];
            for(var i=this.urlList.length;i>=0;--i){
                tempHTML.push("<source src=\""+this.urlList[i]+"\"/>");
            }
            tempAudio.innerHTML = tempHTML;
            if(!this.op){
                tempAudio.abort=function(e){
                    var d = this.duration;
                    _callBack(d);
                }
            }else{
                tempAudio.abort=function(e){
                    var d = this.duration-that.op;
                    _callBack(d);
                }
            }
            tempAudio.load();
        }else{
            var d = this.ed-this.op;
            _callback(d);
            console.log(d);
            return d;
        }
    }
);
DEF_MediaObj.prototype.getDuration.addOverload([Audio],
    function(audio){
        if(!this.ed){
            var d;
            if(!this.op){
                d = audio.duration;
            }else{
                d = audio.duration-this.op;
            }
        }else{
            var d = this.ed-this.op;
        }
        return d;
    }
);
DEF_MediaObj.prototype.getDuration.addOverload([Audio,Function],
    function(audio,_callback){
        var d = this.getDuration(audio);
        _callback(d);
        return d;
    }
);

/**
 * 给媒体做标记的列表 因为浏览器的 updata 事件触发 大概每秒触发四次，所以会有误差
 */
class DEF_MediaObjMarkList{
    /**
     * DEF_MediaObjMark 的列表
     * @param {DEF_MediaObjMark[]} DEF_MediaObjMarkArray DEF_MediaObjMark 的数组
     */
    constructor(DEF_MediaObjMarkArray){
        this.list = DEF_MediaObjMarkArray||[];
    }
    /**
     * 重置所有计数器
     */
    reCount(){
        for(var i=this.list.length-1;i>=0;--i){
            this.list[i].reCount();
        }
    }
    /**
     * 根据时刻触发标记, 如果有两个会被触发 将会仅触发在 list 中靠后的
     * @param {Exctrl} mediaCtrl 媒体控件
     * @param {Number} time 时刻
     * @param {Number} afterTolerance 向后容差 在容差内的时刻也会触发
     */
    touchMarkByTime(mediaCtrl,time,afterTolerance){
        for(var i=this.list.length-1;i>=0;--i){
            if((this.list[i].time<=time)&&(this.list[i].time+afterTolerance>=time)){
                if(this.list[i].touch(mediaCtrl))return;
            }
        }
    }
}
/**
 * 给 DEF_MediaObj 的时间轴 做标记
 */
class DEF_MediaObjMark{
    /**
     * @param {String} command 遭遇标记 的 指令
     * @param {Number} time 时刻
     * @param {Number} maxTouch 最大触发次数
     */
    constructor(command,time,maxTouch){
        this.command  = command;
        this.time     = time||0;
        this.maxTouch = maxTouch||1;
        this.count    = this.maxTouch;
    }
    copy(){
        var rtn = new DEF_MediaObjMark();
        Object.assign(rtn,this);
        return rtn;
    }
    /**
     * 重置计数器
     */
    reCount(){
        this.count = this.maxTouch;
    }
    /**
     * 触发标记
     * @param {ExCtrl} audioCtrl
     */
    touch(mediaCtrl){
        if(!this.count)return false;
        var action = this.commandList[this.command.split(' ')[0]];
        if(action instanceof Function)action.call(this,mediaCtrl);
        --this.count;
    }
}
DEF_MediaObjMark.prototype.commandList={
    go(mediaCtrl){
        var tgtTime = parseFloat(this.command.split(' ')[1]);
        mediaCtrl.setCurrentTime(tgtTime);
    }
}

/**
 * 将cue格式的转换成 DEF_MediaObj
 * @param {DEF_CUEOBJ} _cueobj 读取cue后生成的对象
 * @param {String} _url 为了找到轨道文件, 需要提供 cue 的路径
 * @return {DEF_MediaObj[]} 返回 DEF_MediaObj 数组
 */
function cueObjToMediaObj(_cueobj,_url){
    var rtn = [], urlList = [rltToAbs(_cueobj.file,_url)];
    var tempObj;
    var cover = [];
    selectImg(_url.slice(0,_url.lastIndexOf('/')+1),["cover","front"],[".jpg",".jpeg",".png",".gif",".svg"],
    function(imgList){
        if(imgList.length>0){
            cover.push(...imgList);
        }else{
            var afterL = urlList[0].length,
                after = urlList[0][afterL-3]+urlList[0][afterL-2]+urlList[0][afterL-1];
            if(after==="mp3"){
                ID3.loadTags(urlList[0],function(){
                    var tags  = ID3.getAllTags(urlList[0]);
                    var image = tags.picture;
                    if (image) {
                        var base64String = "";
                        for (var i = 0; i < image.data.length; i++) {
                            base64String += String.fromCharCode(image.data[i]);
                        }
                        var base64 = "data:" + image.format + ";base64," +
                                window.btoa(base64String);
                        cover.push(base64);
                    }
                },
                {tags: ["title","artist","album","picture"]});
            }
        }
    });
    for(var i=0;i<_cueobj.track.length;++i){
        tempObj            = new DEF_MediaObj();
        tempObj.urlList    = urlList;
        tempObj.title      = _cueobj.track[i].title;
        tempObj.album      = _cueobj.title;
        tempObj.songwriter = _cueobj.track[i].songwriter||_cueobj.songwriter;
        tempObj.performer  = _cueobj.track[i].performer||_cueobj.performer;
        tempObj.cover      = cover;
        tempObj.op         = _cueobj.track[i].op;
        tempObj.ed         = _cueobj.track[i].ed;

        rtn.push(tempObj);
    }
    return rtn;
}


export default{
    cueObjToMediaObj,
    DEF_MediaObjMarkList,
    DEF_MediaObjMark,
    DEF_MediaObj,
    DEF_CUEOBJTrack,
    DEF_CUEOBJTrack,
    cue_timeToSecond,
    loadCue,
}