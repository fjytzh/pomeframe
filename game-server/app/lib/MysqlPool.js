/**
 * Created by cx on 2015/7/22.
 */

var mysql = require("mysql");
var PoolModule = require("generic-pool");
var Functions = require("./functions");
var MysqlPool = {

    masterPool:null,//主连接池
    slavePool:null,//从连接池
};




/**
 * 从库连接池
 */
MysqlPool.createPoolForSlave = function(config){
    var pool = PoolModule.Pool({
        name:"mysql",
        create:function(callback){
            var client = mysql.createConnection(config);
            callback(null,client);
        },
        destroy:function(client){
            client.end();
        },
        max:this.dbconfig.max,
        min:this.dbconfig.min,
        idleTimeoutMillis:this.dbconfig.idleTimeoutMillis
    });
    return pool;
}

/**
 * 获取从库配置
 * @returns {Array}
 * @private
 */
MysqlPool._getSlaveDbConfig = function(){
    return this.dbconfig.slave;
}



/**
 * 执行sql
 * @param sql
 * @param callback(result,client)
 * @param pool
 */
MysqlPool.query = function(sql,params,callback,pool){
    params = typeof params=="undefined" ? [] : params;
    pool.acquire(function(err,client){
        if(err){
            trace("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            throw new Error(err);
        }
        sql = client.format(sql,params);
        client.query(sql,params,function(error,result){
            callback(result,client);
        });
    });
}

/**
 * 获取connect
 * @param isMaster
 * @param callback(connect,pool)
 */
MysqlPool.getDbConnect = function(isMaster,callback){
    isMaster = typeof isMaster!="undefined" ? isMaster : GameConfig.DB_DEFAULT_SOURCE_MASTER;
    var pool = isMaster ? this._getMasterDbPool() : this.chooseSlaveDbPool();
    var client = {};
    client.pool = pool;
    client.isNull = true;
    callback(client,pool);
    delete client.pool;
    delete client;
    //pool.acquire(function(error,client){
    //    if(error){
    //        throw new Error(error);
    //    }
    //    callback(client,pool);
    //});
}


/**
 * 执行sql操作
 * @param sqlFuncions(dbcon)
 * @param finishCallback = functio
 * n(cb)
 */
MysqlPool.execute = function(sqlFuncions,finishCallback){
    var con = null;
    var pool = null;
    sqlFuncions[sqlFuncions.length] = function(cb){
        pool.release(con);
        cb();
    };
    sqlFuncions[sqlFuncions.length] = finishCallback;
}



/**
 * 主库连接池
 */
MysqlPool.createPoolForMaster = function(){
    if(this.masterPool){
        return this.masterPool;
    }
    var thisObj = this;
    var pool = PoolModule.Pool({
        name:"mysql",
        create:function(callback){
            var client = mysql.createConnection(thisObj.dbconfig.master);
            callback(null,client);
        },
        destroy:function(client){
            client.end();
        },
        max:this.dbconfig.max,
        min:this.dbconfig.min,
        idleTimeoutMillis:this.dbconfig.idleTimeoutMillis
    });
    return pool;
}

/**
 * 设置从库
 * @param index
 * @private
 */
MysqlPool._setSlaveDbPool = function(index){
    var slaveConfs = this._getSlaveDbConfig();
    MysqlPool[this.getSlaveindexFlag(index)] = MysqlPool.createPoolForSlave(slaveConfs[index]);
}

/**
 * 获取从库
 * @param index
 * @returns {*}
 * @private
 */
MysqlPool._getSlaveDbPool = function(index){
    return MysqlPool[this.getSlaveindexFlag(index)];
}

MysqlPool._getMasterDbPool = function(){
    return MysqlPool.masterPool;
}

/**
 * 从库标识
 * @param index
 * @returns {string}
 */
MysqlPool.getSlaveindexFlag = function(index){
    return "slavePool_"+index;
}

/**
 * 获取从库连接池(随机方式)
 */
MysqlPool.chooseSlaveDbPool = function(){
    var index = Functions.random(0,this._getSlaveDbConfig().length-1);
    return this._getSlaveDbPool(index);
}

/**
 * 初始化db连接池
 */
MysqlPool.initDbPool = function(dbConfig){
    if(typeof dbConfig=="undefined"){
        throw new Error("dbConfig is no found");
    }
    MysqlPool.dbconfig = dbConfig;
    MysqlPool.masterPool = MysqlPool.createPoolForMaster();
    var slaveDbCon = this._getSlaveDbConfig();
    for(var i=0;i<slaveDbCon.length;++i){
        this._setSlaveDbPool(i);
    }
}




module.exports = MysqlPool;