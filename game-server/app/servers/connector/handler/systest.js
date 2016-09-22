/**
 * Created by cx on 2015/7/31.
 */

var Memcached = require('memcached');

module.exports = function(app,isHttp) {
    return new Handler(app,isHttp);
};

var Handler = BaseHandler.extends();

/**
 *
 */
Handler.prototype.environment = function(msg, session, next){
    var self = this;
    var mcache = new Memcached("127.0.0.1:11211");
    var funcAry = [
        function(cb){
            trace("connect memcache...");
            mcache.connect("127.0.0.1:11211",function(result){
                cb();
            })
        },
        function(cb){
            trace("connect master db...");
            var mysql      = require('mysql');
            var connection = mysql.createConnection(DB_CONFIG["master"]);
            connection.connect(function(error){
                if(error){
                    throw new Error(error);
                }
                connection.end();
                cb();
            });
        },
        function(cb){
            trace("connect slave db...");
            var sdbC = DB_CONFIG["slave"].length;
            var connect_i = 0;
            for(var key in DB_CONFIG["slave"]){
                (function(){
                    var mysql      = require('mysql');
                    var dbconfig = DB_CONFIG["slave"][key];

                    var connection = mysql.createConnection(dbconfig);
                    connection.connect(function(error){
                        connect_i++;
                        if(error){
                            throw new Error(error);
                        }
                        connection.end();
                        if(sdbC==connect_i+1){
                            cb();
                        }

                    });
                })();
            }
        },
        function(cb){
            //预留其他检测
            cb();
        },
        function(cb){
            trace("finish");
            next();
        }
    ];
    async.series(funcAry);

}