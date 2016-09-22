/**
 * Created by cx on 2015/6/23.
 *  Db基类
 *  支持事务操作
 *  todo:(兼容node史上最难用的回调方式)
 */
var mysql = require('mysql');//mysql
var async = require("async");//async
var MysqlPool = require("./MysqlPool");//连接池

var MysqlClient = {
    conAry:[],
    dbConfig:DB_CONFIG,//db配置
    db_debug:true,
};

/**
 * 查询
 * @param whereParams
 * @param callback(err, res)
 * @param table
 * @param connect
 * @param field
 */
MysqlClient.select = function(whereParams,callback,table,connect,field){
    field = typeof field=="undefined" ? "*" : field;
    field = typeof field=="Array" ? field.split(",") : field;
    MysqlClient.query('select '+field+" from "+ table + " where ?",whereParams,callback,connect);
};

/**
 * 更新
 * @param params
 * @param whereParams
 * @param table
 * @param callback
 * @param connect
 */
MysqlClient.update = function(params,whereParams,table,callback,connect){
    MysqlClient.query("update "+table+" set ? where ?",[params,whereParams],callback,connect);
};


/**
 * 插入操作
 * @param params
 * @param table
 * @param callback
 * @param connect
 */
MysqlClient.insert = function(params,table,callback,connect){
    var fields = [];
    var values = [];
    var fval = [];
    for(var key in params){
        fields.push(key);
        fval.push("?");
        values.push(params[key]);
    }
    fields = fields.join(",");
    fval = fval.join(",");
    MysqlClient.query("insert into "+table+ " ( " +fields+ ") VALUES("+fval+")",values,function(result){
        callback(result.insertId);
    },connect);
}




/**
 * 删除
 * @param whereParams
 * @param callback
 * @param table
 * @param connect
 */
MysqlClient.delete = function(whereParams,callback,table,connect){
    MysqlClient.query("delete from "+table+" where ?",whereParams,callback,connect);
};

/**
 * 获取当前最后执行的语句
 * @param callback
 * @param connect
 */
MysqlClient.getLastSql = function(callback,connect){
    if(connect.hasOwnProperty("lastSql")){
        return connect.lastSql;
    }
};

///**
// * 获取当前最后插入的id
// * @param callback
// * @param connect
// */
//MysqlClient.getLastId = function(callback,connect){
//
//};

/**
 * 执行x
 * @param sql
 * @param callback
 * @param connect
 */
MysqlClient.query = function(sql,params,callback,connectObj){
    if(!connectObj["isMaster"] && sql.indexOf("select")==-1){
        throw new Error("write db!!!,must use master connect=>sql:"+sql);
    }
    if(typeof connectObj=="undefined"){
        throw new Error("db connectObj is null");
    }
    MysqlClient.getOrginConnect(connectObj,function(connect){
        var connect = connectObj.con;
        MysqlClient._conQuery(sql,params,callback,connect);
    });

};

MysqlClient._conQuery = function(sql,params,callback,connect){
    sql = connect.format(sql,params);
    //MysqlPool.query@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    sql = mysql.format(sql,params);//重组sql
    connect.lastSql = sql;
    if(MysqlClient.db_debug){
        var start_time = Functions.microtime();
    }
    connect.query(sql,"",function(error,result){
        if(MysqlClient.db_debug){
            var t = ((Functions.microtime()-start_time))/1000;
            trace("execute "+sql+" time:"+t);
        }
        if(error){
            connect.destroy();
            warn(sql);//sql错误输出
            if(typeof connect.sqlErrorFunc=="function"){
                var errfunc = connect.sqlErrorFunc;
                delete connect.sqlErrorFunc;
                errfunc(error);
                return;
            }else{
                throw new Error(error);
                return;
            }
        }
        delete connect.sqlErrorFunc;
        if(typeof callback=="function"){
            //匹配select,delete,insert,不同匹配不同返回值
            callback(result);
        }
    });
}


/**
 * 销毁db
 * @param connect
 */
MysqlClient.release = function(connect){
    //到时候改用连接池,兼容其他方式
    connect.end();
}

/**
 * 获取相关标识
 * @param sql:执行的语句
 * @param resultInfo:返回的结果
 *
 */
MysqlClient.fetchOptionFlag = function(sql,resultInfo){
    $type = array("select","insert","delete");
}

/**
 * 开始事务
 * @param callback
 * @param connect
 */
MysqlClient.beginTransaction = function(callback,connectObj){
    MysqlClient.getOrginConnect(connectObj,function(connect){
        connect.beginTransaction(function(error,result){
            callback(error,result);
        });
    });

};

/**
 * 返回connect
 * @param connectObj
 * @param callback
 */
MysqlClient.getOrginConnect = function(connectObj,callback){
    if(connectObj.hasOwnProperty("isNull") && connectObj.isNull==true){
        var pool = connectObj.pool;
        connectObj.isNull = false;
        pool.acquire(function(err,client){
            if(err){
                throw new Error(err);
            }
            connectObj.con = client;
            callback(client)
        });
    }else{
        callback(connectObj.con);
    }
}


/**
 * 事务提交
 * @param callback
 * @param connect
 */
MysqlClient.commit = function(callback,connectObj){
    connectObj.con.commit(false,callback);//
};

/**
 * 事务回滚
 * @param callback
 * @param connect
 */
MysqlClient.rollback = function(callback,connectObj){
    connectObj.con.rollback(false,callback);//
};


/**
 * 建立连接
 */
MysqlClient.getConnection = function(isMaster){
    isMaster = typeof isMaster=="undefined" ? GameConfig.DB_DEFAULT_SOURCE_MASTER : isMaster;
    var config = MysqlClient._getMasterSlaveDbC(isMaster);
    var connect = mysql.createConnection(config);
    connect["isMaster"] = isMaster;

    return connect;
};

/**
 * 执行函数操作
 * @param funcsX() return [sqlFunc=>array(func,func),finishFunc=>func]
 * @param errorFunc
 * @param isMaster
 */
MysqlClient.executeFuncs = function(funcsX,errorFunc,isMaster){

    if(arguments.length == 2){
        isMaster = errorFunc;
        errorFunc = undefined;
    }
    MysqlClient._executeFuncs(function(con){
        var funcAry = funcsX(con);
        if(funcAry.length!=2){
            throw new Error("funcAry return type error");
        }
        this.ps = funcAry[0];
        this.fs = funcAry[1];
    },isMaster);

}

/**
 * sql function s
 * @param sqlFunc(con){this.ps//过程回调,this.fs//完成回调,this.es//错误处理}
 * @param isMaster:主从方式
 */
MysqlClient._executeFuncs = function(sqlFunc,isMaster){
    if(typeof sqlFunc!="function"){
        new Error("sqlFunc is not function");
    }
    MysqlPool.getDbConnect(isMaster,function(connect,pool){
        var dbcon = connect;
        dbcon["isMaster"] = isMaster;
        try{
            var func = new sqlFunc(dbcon);
            if(typeof func.es=="function"){
                connect.sqlErrorFunc = func.es;
            }
            if(!func.hasOwnProperty("ps")){
                throw new Error("ps is null");
            }
            if(!func.hasOwnProperty("fs") || typeof func.fs!="function"){
                throw new Error("finishFunc is null");
            }
            func.ps[func.ps.length] = function(cb){
                if(!dbcon.isNull){
                    pool.release(dbcon.con);
                }
                delete dbcon;
                cb();
            };
            func.ps[func.ps.length] = func.fs;
            async.series(func.ps);
            delete func;
        }catch(e){//
            pool.release(dbcon.con);
            delete dbcon;
            delete func;
            trace(e);
            throw new Error(e);
        }
    });

}

/**
 * 连接池模式
 */
MysqlClient.queryFuncsForPool = function(sqlFunc){
    if(typeof sqlFunc!="function"){
        new Error("sqlFunc is not function");
    }
    var dbcon = this.getConnection();
    var func = new sqlFunc(dbcon);
    try{
        if(!func.hasOwnProperty("sqlFuncions") || typeof func.sqlFuncions!="function"){
            new Error("sqlFunctions is null");
        }
        if(!func.hasOwnProperty("finishFunc") || typeof func.finishFunc!="Array"){
            new Error("finishFunc is null");
        }
        func.sqlFuncions[func.sqlFuncions.length] = function(cb){
            dbcon.destroy();
            cb();
        }
        func.sqlFuncions[func.sqlFuncions.length] = func.finishFunc;
        async.series(func.sqlFuncions);
        delete func;
    }catch(e){
        dbcon.destroy();
        delete dbcon;
        delete func;
        throw new Error(e);
    }
}


/**
 * 读取相关db配置
 */
MysqlClient._getMasterSlaveDbC = function(isMaster){
    var config = "";
    if(isMaster){
        config = this.dbConfig["master"];
    }else{
        var a = {};
        if(!this.dbConfig.hasOwnProperty("slave")){
            throw new Error("dbConfig => slave config error");
        }
        var slave_count = this.dbConfig["slave"].length;
        if(slave_count<=0){
            config = this.dbConfig["master"];
        }else{
            var slave_index = Functions.random(0,slave_count-1);
            config = this.dbConfig["slave"][slave_index];
        }
    }
    return config;
};




MysqlClient.init = function(dbConfig){
    MysqlPool.initDbPool(dbConfig);//初始化连接池
}


module.exports = MysqlClient;
