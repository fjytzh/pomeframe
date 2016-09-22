/**
 * Created by chengxu on 2015/7/7.
 */
var mysql = require("mysql");

/**
 * 玩家信息模块
 */
var UserModel = BaseModel.extends({

    /**
     * @param con
     */
    ctor:function(con){
        this.table_name = "stride_a_war";
        this._super(con);
    },

    /**
     * 获取玩家信息
     */
    getUserInfo:function(){
        //
    },

    /**
     * 添加玩家
     */
    addUser:function(uid,callback){
        var userinfo = {
            //account_id:uid,
            //user_id:uid,
            //server_serial:1
        }
        this.insert(userinfo,callback);
    },


    /**
     *
     * @param callback:callback(result)
     */
    test1:function(uid,callback){
        this.delete({stride_war_id:4},callback,"stride_a_war",this._con);
    },

    /**
     * 获取用户信息
     * @param uid
     * @param cb
     */
    getUserInfo:function(uid,cb){
        var tablename = this.getTableName(uid);
        this.select({"user_id":uid},function(result){
            cb(result);
        },tablename);
    },

    register:function(){

    }

});


module.exports = UserModel;