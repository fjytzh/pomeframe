/**
 * BaseModel
 * Created by cx on 2015/7/7.
 */

var DBManager = require("../DBManager");
var MemcacheManager = require("../MemCacheManager");
var MysqlClient = require("../mysqlClient");


var BaseModel = BaseClass.extends({
    _con:null,
    table_name:null,
    _isSpliteTable:false,
    dbconfig:null,
    currDbConfig:null,//��ǰdb����
    db_pre:null,//DBǰ׺
    _sqlid:null,//config��ʶid
    _tableIndex:null,
    _cache_expire:300,//缓存有效期

    option:null,

    ctor:function(_con){
        this._con = _con;
    },

    setConnect:function(con){
        this._con = con;
    },

    /**
     * 获取缓存
     * @param key
     * @param callback(result)
     */
    getCache:function(key,callback){
        //MemcacheManager
        MemcacheManager.get(key,callback);
    },



    /**
     * 设置缓存
     * callback(result)
     */
    setCache:function(key,val,callback,expire){
        //MemcacheManager
        expire = typeof expire=="undefined" ? this._cache_expire:expire;
        MemcacheManager.set(key,val,callback,expire);
    },

    /**
     * 设置分表索引
     * @param index
     */
    setTableIndex:function(index){
        this._tableIndex = index;
        this._isSpliteTable = true;
    },

    query:function(sql,callback){
        MysqlClient.query(sql,"",callback,this._con);
    },

    /**
     *
     * @param whereParams
     * @param cb
     * @param table
     */
    delete:function(whereParams,cb,table){
        table = typeof table=="undefined" ? this.table_name : table;
        MysqlClient.delete(whereParams,cb,table,this._con);
    },

    /**
     * function:select
     * ok
     */
    select:function(whereParams,cb,table,fields){
        table = typeof table=="undefined" ? this.table_name : table;
        MysqlClient.select(whereParams,cb,table,this._con,fields);
    },

    /**
     * 插入操作
     * @param params
     * @param cb(false/result)
     * @param table
     */
    insert:function(params,cb,table){
        table = typeof table=="undefined" ? this.table_name : table;
        MysqlClient.insert(params,table,cb,this._con);
    },

    /**
     * function:update
     * ok
     */
    update:function(upParams,whereParams,cb,table){
        //params,whereParams,table,callback,connect
        table = typeof table=="undefined" ? this.table_name : table;
        MysqlClient.update(upParams,whereParams,table,cb,this._con);
    },


    /**
     * 表取模
     */
    modTableIndex:function(index){
        return (index%GameConfig.DB_TABLE_MOD);
    },

    /**
     * 获取表名
     */
    getTableName:function(index){
        var tablename = this.table_name;
        if(index!="undefined"){
            tablename = this.table_name+"_"+this.modTableIndex(index);
        }
        return tablename;
    },



    /**
     * 开始
     * @param callback(error,result)
     */
    begin:function(callback){
        MysqlClient.beginTransaction(callback,this._con);
    },

    /**
     * 回滚
     * @param callback(error,result)
     */
    rollback:function(callback){
        MysqlClient.rollback(callback,this._con);
    },

    /**
     * 提交
     * @param callback(error,result)
     */
    commit:function(callback){
        MysqlClient.commit(callback,this._con);
    }

});



/**
 * 执行函数操作
 * @param funcsX() return [sqlFunc=>array(func,func),finishFunc=>func]
 * @param errorFunc
 * @param isMaster
 */
BaseModel.executeFuncs = function(funcsX,errorFunc,isMaster){
    MysqlClient.executeFuncs(funcsX,errorFunc,isMaster);
};

/**
 * 遍历执行sql
 * @param dataAry: [data1,data2,data3,data4,data5] / int
 * @param execFunc(current_data/current_count,cbx)
 * @param callbackFunc:完成回调
 */
BaseModel.foreachFunc = function(dataAry,execFunc,callbackFunc,errorBack){
    var data = "";
    var isContinue = false;
    if(typeof dataAry != "number"){
        isContinue = data = dataAry.shift();
    }else{
        isContinue = data = dataAry--;
    }
    if(isContinue){
        execFunc(data,function(){
            BaseModel.foreachFunc(dataAry,execFunc,callbackFunc);
        });
    }else{
        callbackFunc();
    }
}


BaseModel.extends = BaseClass.extends;
module.exports = BaseModel;