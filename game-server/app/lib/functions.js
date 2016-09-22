/**
 * Created by Administrator on 2015/6/23.
 */
/**
 * Created by cx on 2014/6/1.
 */

var crypto = require('crypto');
var Functions = module.exports;

/**
 * 测试
 * */
Functions.test = function(){
    console.log("test func");
}


/**
 * mysql过滤
 * */
Functions.saveString = function(str){
    str = str.replace('%20','');
    str = str.replace('%27','');
    str = str.replace('%2527','');
    str = str.replace('*','');
    str = str.replace('"','&quot;');
    str = str.replace("'",'');
    str = str.replace('"','');
    str = str.replace(';','');
    str = str.replace('<','&lt;');
    str = str.replace('>','&gt;');
    str = str.replace("{",'');
    str = str.replace('}','');
    str =  str.replace('\\','');
    return str;
}

/**
 * 转换字符串为json数据
 * @param data
 */
Functions.convertStrToJson = function(data){
    if(typeof data == "string"){
        data = data=="" ? {} : JSON.parse(data);
    }
    return data;
}

/**
 * 取日期函数
 */
Functions.dataFormat = function(datestr){
    //
    var date = new Date();
    datestr = datestr.toUpperCase();
    datestr = datestr.replace("Y",date.getFullYear());
    datestr = datestr.replace("M",Functions.padZero(date.getMonth()));
    datestr = datestr.replace("D",Functions.padZero(date.getDate(),2));
    datestr = datestr.replace("H",Functions.padZero(date.getHours(),2));
    datestr = datestr.replace("I",Functions.padZero(date.getMinutes(),2));
    datestr = datestr.replace("S",Functions.padZero(date.getSeconds(),2));
    return datestr;
}

/**
 * 求当前时间毫秒
 */
Functions.microtime = function(){
    return (new Date()).getTime();
}

/**
 * 获取当前系统时间时间错 秒数
 */
Functions.dateSysTime = function(){
    var date = new Date();
    return parseInt(date.valueOf()/1000);
}


/**
 * 数字前位补零
 * @param val
 * @param maxlength
 * @returns {string}
 */
Functions.padZero = function(val,maxlength){
    val = val+"";
    var zerostr = "000000000000000000000";
    if(val.length<maxlength){
        var count = maxlength-val.length;
        val = zerostr.substr(0,count)+""+val;
    }
    return val;

}

/**
 * 返回范围内的数
 * @param min
 * @param max
 */
Functions.random = function(min,max){
    //
    min = typeof min =="undefined" ? 0 : min;
    min = parseInt(min);
    max = typeof max=="undefined" ? 99999999999 : max;
    max = max+1;
    max = parseInt(max);
    return parseInt(max*Math.random()+min);
}



/**
 * Md5加密
 * */
Functions.Md5 = function(str){
    return crypto.createHash('md5').update(str).digest('hex').toUpperCase();
}

/**
 * 递归执行,类似foreach
 * @param count:执行次数
 * @param dataAry:数据Ary
 * @param callback:回调函数
 */
Functions.foreachFunc = function(count,dataAry,callback){
    if(count>0){
        trace(count);
        Functions.foreachFunc(--count,dataAry,callback);
    }else{
        callback(count);
    }
}

/**
 * 属性继承
 * @param thisObj
 * @param pro
 */
Functions.extends = function(thisObj,prop){
    for(var name in prop){
        thisObj[name] = prop[name];
    }
}

/**
 * 克隆对象1
 */
Functions.clone = function(obj){
    function Clone(){}
    Clone.prototype = obj;
    var o = new Clone();
    for(var a in o){
        if(typeof o[a] == "object") {
            o[a] = clone3(o[a]);
        }
    }
    return o;
}

/**
 * 克隆对象2
 * @param obj
 * @returns {*}
 */
Functions.clone2 = function(obj){
    var o, obj;
    if (obj.constructor == Object){
        o = new obj.constructor();
    }else{
        o = new obj.constructor(obj.valueOf());
    }
    for(var key in obj){
        if ( o[key] != obj[key] ){
            if ( typeof(obj[key]) == 'object' ){
                o[key] = clone2(obj[key]);
            }else{
                o[key] = obj[key];
            }
        }
    }
    o.toString = obj.toString;
    o.valueOf = obj.valueOf;
    return o;
}