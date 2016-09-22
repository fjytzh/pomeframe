/**
 * Created by cx on 2015/8/3.
 */
/**
 * Created by lebo on 14-6-13.
 */
module.exports = function(app){
    return new UserRemote(app);
}

var UserRemote = function(app){
    this.app = app;
}

/**
 * 踢下线
 * @param frontendId
 * @param uid
 * @param cb
 */
UserRemote.prototype.testRemote = function(frontendId, uid, cb){
    cb("UserRemote.prototype.kick");
}

