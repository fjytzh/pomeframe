/**
 * GameSystem:������Ϣ�빫��method
 * Created by cx on 2015/7/7.
 */
var GameSystem = function(){

};
module.exports = GameSystem;


GameSystem.moduleWhiteList = {};//白名单
GameSystem.moduleBlacklist = {};//黑名单


/**
 * ���
 * @param arg
 */
GameSystem.trace = function(arg){
    console.log(arg);
}

/**
 * �������
 * @param msg
 */
GameSystem.error = function(msg){
    console.error(msg);
}

/**
 * debug���
 * @param msg
 */
GameSystem.debug = function(msg){
    console.debug(msg);
}

/**
 * ���infomation
 * @param msg
 */
GameSystem.info = function(msg){
    console.info(msg);
}

GameSystem.warn = function(msg){
    console.warn(msg);
}

sendMsg = function(){

}

warn = function(msg){
    GameSystem.warn(msg);
}

trace = function(msg){
    GameSystem.trace(msg);
}

showError = function(msg){
    GameSystem.error(msg);
}