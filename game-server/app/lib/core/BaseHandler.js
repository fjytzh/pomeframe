/**
 * Created by cx on 2015/7/14.
 */

var BaseHandler = BaseClass.extends({
    app:null,
    http:false,
    /**
     * construct
     * @param app
     */
    ctor:function(app,isHttp){
        isHttp = typeof isHttp=="undefined" ? isHttp : false;
        this.app = app;
        this.http = isHttp;
    },

    /**
     * 是否http方式
     * @returns {boolean}
     */
    isHttp:function(){
        return this.http;
    },

    /**
     * sendMsg To Client
     */
    sendMsg:function(msg,next,code){
        if(typeof next!="function"){
            throw new Error("params error");
        }
        code = typeof code == "undefined" ? 200 : code;
        next(null,{code:code,data:msg});
    },

    /**
     * trigger msg to client
     */
    triggerMessage:function(msg,id){

    }


});
BaseHandler.extends = BaseClass.extends;

module.exports = BaseHandler;
