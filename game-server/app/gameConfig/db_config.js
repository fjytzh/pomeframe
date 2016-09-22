/**
 * Created by cx on 2015/7/7.
 */
var DBCONFIG_LODALHOST = {};

DBCONFIG_LODALHOST.DB_CONFIG = {

    charset:"utf8",
    //min:2,
    max:20,
    idleTimeoutMillis:30000,//

    server:{//服务器db配置
        "s_9001":{
            "master":{host:"localhost",port:3306,user:"root",password:"q1w2e3",database:"slamdunk_stride"},
            "slave":[
                {host:"localhost",port:3306,user:"root",password:"q1w2e3",database:"slamdunk_stride"}
            ]
        },
        "s_9002":{
            "master":{host:"localhost",port:3306,user:"root",password:"q1w2e3",database:"slamdunk_stride"},
            "slave":[
                {host:"localhost",port:3306,user:"root",password:"q1w2e3",database:"slamdunk_stride"}
            ]
        },
        "s_9003":{
            "master":{host:"localhost",port:3306,user:"root",password:"q1w2e3",database:"slamdunk_stride"},
            "slave":[
                {host:"localhost",port:3306,user:"root",password:"q1w2e3",database:"slamdunk_stride"}
            ]
        },
        "s_9004":{
            "master":{host:"localhost",port:3306,user:"root",password:"q1w2e3",database:"slamdunk_stride"},
            "slave":[
                {host:"localhost",port:3306,user:"root",password:"q1w2e3",database:"slamdunk_stride"}
            ]
        },
        "s_9005":{
            "master":{host:"localhost",port:3306,user:"root",password:"q1w2e3",database:"slamdunk_stride"},
            "slave":[
                {host:"localhost",port:3306,user:"root",password:"q1w2e3",database:"slamdunk_stride"}
            ]
        },
        "s_9006":{
            "master":{host:"localhost",port:3306,user:"root",password:"q1w2e3",database:"slamdunk_stride"},
            "slave":[
                {host:"localhost",port:3306,user:"root",password:"q1w2e3",database:"slamdunk_stride"}
            ]
        }
    },



};
/**
 * 获取配置
 */
DBCONFIG_LODALHOST.getConfig = function(server_id){
    var allDbConfig = DBCONFIG_LODALHOST.DB_CONFIG;
    if(!allDbConfig.server.hasOwnProperty(server_id)){
        throw new Error("config is no exists:server_id="+server_id);
    }
    var dbConf = allDbConfig.server[server_id];
    dbConf["charset"] = allDbConfig["charset"];
    dbConf["min"] = allDbConfig["min"];
    dbConf["max"] = allDbConfig["max"];
    dbConf["server_id"] = server_id;
    dbConf["idleTimeoutMillis"] = allDbConfig["idleTimeoutMillis"];
    return dbConf;
}



module.exports = DBCONFIG_LODALHOST;





