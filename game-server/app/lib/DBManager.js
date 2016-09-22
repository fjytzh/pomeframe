/**
 * DB�м��
 * Created by cx on 2015/7/9.
 */

var mysql = require("mysql");
var DBManager = function(){

    this.connectAry = [];

    /**
     *
     * @param config
     * @returns {*}
     */
    this.getLink = function(config,sqlid){
        var ckey = this.getConnectCkey(config,sqlid);
        if(!this.connectAry.hasOwnProperty(ckey)){
            this.connectAry[ckey] = mysql.createConnection(config);
        }
        return this.connectAry[ckey];
    }

    /**
     * 获取connect key
     */
    this.getConnectCkey = function(config,sqlid){
        return Functions.Md5(JSON.stringify(config)+"_"+sqlid);
    }

    this.removeLink = function(config,sqlid){
        var ckey = this.getConnectCkey(config,sqlid);
        if(this.connectAry.hasOwnProperty(ckey)){
            delete this.connectAry[ckey];
        }
    }

    this.connect = function(config,_sqlid){
        this._connect(config,_sqlid);
    }

    /**
     * @param config:������Ϣ
     */
    this._connect = function(config,_sqlid){
        return this.getLink(config,_sqlid);
    }



    /**
     * �Ͽ�����
     */
    this._disconnect = function(config,_sqlid){
        var connect = this.getLink(config,_sqlid);
        if(connect){
            connect.disconnect();
            this.removeLink(config,_sqlid);
        }
    }





}

DBManager.instance = null;
DBManager.getInstance = function(){
    if(DBManager.instance==null){
        DBManager.instance = new DBManager();
    }
    return DBManager.instance;
}

module.exports = DBManager;