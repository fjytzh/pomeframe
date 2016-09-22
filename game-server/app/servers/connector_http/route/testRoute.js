var ActionManager = require('../../../ActionManager');
var util = require("util");
var fs = require("fs");
var assert = require('assert');
var zlib = require('zlib');
module.exports = function(app, http) {
  return HttpManager(app,http);
};



/**
 * http请求类
 * @param app
 * @param http
 * @constructor
 */
function HttpManager(app,http){

  this.app = app;
  this.http = http;
  this.ROUTE_KEY = "__route__";//
  this.CONNECTOR_BASEPATH = "../../";//
  this.actionManager = null;
  this.connectorModules = [];
  this.routeFileGroup = [];

  /**
   * initAction
   */
  this.initAction = function(){
    var self = this;
    this.actionManager = new ActionManager();
    this.http.get('/',function(req,res){
      req.query.__route__ = "connector.user.test";
      self.execute(req,res);
    });

    this.http.post('/',function(req,res){

      self.execute(req,res,true);
    });
  }

  /**
   * 获取模块控制器
   * @param handleName
   * @param moduleName
   * @param callback(module)
   */
  this.getModuleController = function(handleName,moduleName,callback){
    var modulePath = this.CONNECTOR_BASEPATH+handleName+"/handler/"+moduleName;
    if(this.connectorModules.hasOwnProperty(modulePath)){
      callback(this.connectorModules[modulePath]);
    }else{
      this.checkRouteFileExists(modulePath,function(isExists){
        if(isExists){
          var Module = require(modulePath);
          var model = new Module(this.app,true);
          this.connectorModules[modulePath] = model;
        }else{
          this.connectorModules[modulePath] = false;
        }
        callback(this.connectorModules[modulePath]);
      });
    }


  }

  /**
   * 解析route
   * @param route
   * @param data
   * @param callback
   */
  this.decodeRoute = function(route,data,callback){
    var routeAry = route.split(".");
    var handler = routeAry[0];
    var module = routeAry[1];
    var action = routeAry[2];
    this.getModuleController(handler,module,function(moduleController){
      if(typeof moduleController[action]=="function"){
        moduleController[action](data,null,function(error,result){
          callback(result);
        });
      }else{
        callback(this.makeErrorData("route error:"+route));
      }
    });
  }


  /**
   * 错误信息
   * @param msg
   * @returns {{code: number, data: *}}
   */
  this.makeErrorData = function(msg){
    return {code:0,data:msg};
  }



  /**
   * 初始化模块x
   */
  //this.getModuleFunction = function(route){
  //  if(!this.connectorModules.hasOwnProperty(route)){
  //    var Module = require(this.getActionPath(route));
  //    var module = new Module(this.app,true);
  //    this.connectorModules[route] = module;
  //  }
  //  return this.connectorModules[route];
  //}

  /**
   * 获取action路径
   * @param route
   */
  this.getActionPath = function(route){
    routeAry = route.split(".");
    return this.CONNECTOR_BASEPATH+routeAry[0]+"/handler/"+routeAry[1];
  }


  this.checkRouteFileExists = function(modulePath,callback){
    modulePath = __dirname+"/"+modulePath+".js";
    if(this.routeFileGroup.hasOwnProperty(modulePath)){
      callback(this.routeFileGroup[modulePath]);
    }else{
      fs.exists(modulePath,function(isExists){
        this.routeFileGroup[modulePath] = isExists;
        callback(this.routeFileGroup[modulePath]);
      })
    }
  }



  /**
   * execute
   * @param req
   * @param res
   * @param cb
   */
  this.execute = function(req,res,isPost){
    var self = this;
    isPost = typeof isPost=="undefined" ? false : isPost;
    var data = isPost ? req.body : req.query;
    this.before(data,function(isSucc){
      if(isSucc){
        this.decodeRoute(data[this.ROUTE_KEY],data,function(result){
          result = typeof result != "undefined" ? result : "";
          res.send(result);
        });
      }else{
        res.send({code:0,data:"route error"});
      }

    });
  }



  /**
   * 前置操作
   * ActionManager.prototype.before = function(msg,session,next)
   */
  this.before = function(requestData,cb){
    try{
      this.actionManager.before(requestData,null,function(isSucc){
        cb(isSucc);
      });
    }catch(e){
      cb(false);
    }

  };

  /**
   * 后置操作
   * after  = function(err, msg, session, resp, next)
   */
  this.after = function(req,res,cb){
    //
  };



  this.initAction();

}


