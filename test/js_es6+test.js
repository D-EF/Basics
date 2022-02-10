
/** 自己实现的 reduce
 * @param {Function} callback 
 * @param {any} initialValue 
 */
Array.prototype.myreduce=function(callback,initialValue){
    var arr=this;
    var i=initialValue===undefined?1:0;
    var temp;
    if(i){
        temp=arr[0];
    }else{
        temp=initialValue;
    }
    while(i<arr.length){
        temp=callback(temp,arr[i],i+1,arr);
        ++i;
    }
    return temp;
}