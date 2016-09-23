/**
 * bootstrap
 * Created by chengxu on 2015/7/7.
 * supervisor app.js
 */
var pomelo = require("pomelo");
path = require('path');
async = require("async");
GameConfig = require(__dirname+"/gameConfig/game_config");
//特殊配置方式
DB_CONFIG = require("./gameConfig/db_config");
CACHE_CONFIG = require("./gameConfig/cache_config");
MysqlClient = require("./lib/mysqlClient");
GameSystem = require("./lib/GameSystem");
BaseClass = require("./lib/core/BaseClass");
BaseModel = require("./lib/core/BaseModel");
BaseHandler = require("./lib/core/BaseHandler");
Functions = require("./lib/functions");
MemCacheManager = require("./lib/MemCacheManager");
HttpClient = require("./lib/HttpClient");


var ActionManager = require("./ActionManager");


var Bootstrap = function(){
    this.app = null;
    this.appname = GameConfig.APP_NAME;//app name

    /**
     * 鍒濆鍖�
     */
    this.init = function(){
        if(Bootstrap.instance!=null){
            throw new Error("Bootstrap is single instance.");
        }
    }

    /**
     * 鍚姩
     */
    this.run = function(){

        this._startPomelo();
    }

    /**
     *
     */
    this.runTest = function(){

    }

    /**
     * socketio妯″紡
     * @private
     */
    this._startPomeloForSocketIo = function(){
        throw new Error("no config this type");
    }

    /**
     * websocket妯″紡
     * @private
     */
    this._startPomeloForWebSocket = function(){
        var app = pomelo.createApp();
        this.app = app;
        app.set('name', 'nodegame');
        // app configuration
        app.filter(ActionManager());
        app.configure('production|development', 'connector', function(){

            app.set('connectorConfig',
                {
                    connector : pomelo.connectors.hybridconnector,
                    heartbeat : 3,
                });
        });

        /*
        app.configure('production|development','connector_http',function(){
            var httpPlugin = require('pomelo-http-plugin');
            var http_server_conf = app.curServer;
            app.use(httpPlugin,{http:{host:GameConfig.HOST,port:http_server_conf.http_port}});
            var actionManager = ActionManager(app);
            app.before(actionManager);
            app.after(actionManager);
            var dbConfig = DB_CONFIG.getConfig(http_server_conf.id);
            MysqlClient.init(dbConfig);
        });
        */
        // start app
        app.start();
        process.on('uncaughtException', function (err) {
            console.error(' Caught exception: ' + err.stack);
        });



    }


    /**
     * 鍚姩pomelo
     * @private
     */
    this._startPomelo = function(){
        if(this.app!=null){
            throw new Error("this.app is not null.");
        }
        ++this.i;
        switch(GameConfig.SOCKET_TYPE){
            case GameConfig.SOCKET_TYPE_WEBSOCKET://web socket方式
                this._startPomeloForWebSocket();
                break;
            case GameConfig.SOCKET_TYPE_SOCKETIO://socket io方式
                this._startPomeloForSocketIo();
                break;
            default :
                throw new Error("undefined SOCKET_TYPE");
                break;
        }
    }

    this.init();
}

//鍗曚緥绫�
Bootstrap.instance = null;

/**
 * 鍗曚緥妯″紡
 * @returns {null|Bootstrap|*}
 */
Bootstrap.getInstance = function(){
    if(Bootstrap.instance==null){
        Bootstrap.instance = new Bootstrap();
    }
    return Bootstrap.instance;
}


module.exports = Bootstrap;