/**
 *
 * Created by chengxu on 2015/7/8.
 */

module.exports = function(app){
    return new ActionManager(app);
}



var ActionManager = function(app){
    this.app = app;
    this.testid = null;
}

/**
 * request before
 * @param msg
 * @param session
 * @param next
 */
ActionManager.prototype.before = function(msg,session,next){
    // console.log(typeof msg);
    // console.log(typeof session);
    next();
}

/**
 * request after
 * @param err
 * @param msg
 * @param session
 * @param resp
 * @param next
 */
ActionManager.prototype.after  = function(err, msg, session, resp, next){
    //清理connect
    next();
}

/**
 * 检测调用
 */
ActionManager.prototype.checkRoute = function(route){
    if(typeof route!="string" || route==""){
        throw new Error("route type error");
    }
    if(route.split(".").length!=3){
        throw new Error("route error:"+route);
    }
    return true;
}

/**
 * 执行前初始化
 */
ActionManager.prototype.beforeInit = function(){
    //设置连接标识

}






