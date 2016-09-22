/**
 * Created by cx on 2015/7/7.
 */
var GameConfig = {};
GameConfig.HOST = "127.0.0.1";//外部访问host

GameConfig.SERVER_ID = 1;//serverid 该服务器标识
GameConfig.APP_NAME = "game_app";//app name
GameConfig.DEBUG = true;//debug调试模式
GameConfig.DB_TABLE_MOD = 30;//分表数量


//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 非常用配置 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//db
GameConfig.DB_GENERIC_POOL = true;//连接池方式(第三方库)
GameConfig.DB_LOG = true;//DB日志
GameConfig.DB_DEFAULT_SOURCE_MASTER = true;//default read master是否默认读主库


//socket
GameConfig.SOCKET_TYPE_SOCKETIO = "SOCKET_TYPE_SOCKETIO";//socket io
GameConfig.SOCKET_TYPE_WEBSOCKET = "SOCKET_TYPE_WEBSOCKET";//web socket
GameConfig.SOCKET_TYPE = GameConfig.SOCKET_TYPE_WEBSOCKET;//socket type


module.exports = GameConfig;