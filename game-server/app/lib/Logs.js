/**
 * 记录错误日志，文件类型
 * Created by cx on 2015/7/23.
 */
var Logs = {};

Logs.ERROR_TYPE_DB = "ERROR_TYPE_DB";//DB类型错误
Logs.ERROR_TYPE_GAME = "ERROR_TYPE_GAME";//游戏类型错误
Logs.ERROR_TYPE_SYSTEM = "ERROR_TYPE_SYSTEM";//系统类型错误


/**
 * 文件记录
 * @param error
 * @param type
 */
Logs.File = function(error,type){
    //

}

/**
 * Db记录
 * @constructor
 */
Logs.Db = function(){

}



module.exports = ErrorFileLog;