/**
 * MemcacheManager
 * Created by cx on 2015/7/9.
 */

var nMemcached = require("memcached");

var MemCacheManager = {

    memcached:new nMemcached(CACHE_CONFIG["host"],{poolSize:CACHE_CONFIG["poolSize"]}),
    expire:300,//超时设置

    /**
     * 获取
     * @param key
     * @param callback(result)
     */
    get:function(key,callback){
        this.memcached.get(key,function(error,result){
            if(error){
                throw new Error(error);
            }
            callback(result);
        });
    },

    /**
     * 设置cache
     * @param key
     * @param val
     * @param callback(result)
     * @param expire
     */
    set:function(key,val,callback,expire){
        expire = typeof expire=="undefined" ? this.expire : expire;
        this.memcached.set(key,val,expire,function(error,result){
            if(error){
                throw new Error(error);
            }
            if(typeof callback=="function"){
                callback(result);
            }
        })
    }
}


module.exports = MemCacheManager;

