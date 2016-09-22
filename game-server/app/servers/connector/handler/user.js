/**
 *
 */
var UserModel = require("../../../model/UserModel");
module.exports = function(app,isHttp) {
  return new Handler(app,isHttp);
};

var Handler = BaseHandler.extends();


/**
 * 注册接口
 */
Handler.prototype.register = function(){
	//
};

/**
 * 登录接口
 */
Handler.prototype.login = function(){

};


Handler.prototype.test = function(msg, session, next){
	this.testSend(msg, session, next);
}


/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.testSend = function(msg, session, next) {
	var self = this;
	//主从错误提示x
	BaseModel.executeFuncs(function(con){
		var userModel = new UserModel(con);
		var listdata = "";
		var i=0;
		var dt = [];
		var funcAry = [
			function(cb){
				userModel.select(1,function(result){
					listdata = result;
					cb();
				});
			},
			function(cb){
				var dataAry = [10041,10042,10043];
				//遍历处理sqlX
				BaseModel.foreachFunc(dataAry,function(data,cb){
					userModel.select({"stride_war_id":data},function(result){
						dt.push(result[0]["stride_war_id"]);
						cb();
					});

				},function(){
					cb();
				});
			}
		];
		var finishFunc = function(){
			trace(dt);
			self.sendMsg(dt,next);
		};
		return [funcAry,finishFunc];
	},true);

};





/**
 * Publish route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.publish = function(msg, session, next) {
	var result = {
		topic: 'publish',
		payload: JSON.stringify({code: 200, msg: 'publish message is ok.'})
	};
  next(null, result);
};

/**
 * Subscribe route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.subscribe = function(msg, session, next) {
	var result = {
		topic: 'subscribe',
		payload: JSON.stringify({code: 200, msg: 'subscribe message is ok.'})
	};
  next(null, result);
};
