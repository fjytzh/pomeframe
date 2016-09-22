/**
 * Created by cx on 2015/7/31.
 * Http请求类
 */

var Http = require('http');
var QueryString = require('querystring');

var HttpClient = {

    defaultEncoding:'utf8',//默认字符串格式

    /**
     * * escape可设置中文
     * get请求
     * @param url
     * @param callback
     * @param port
     * @param encoding
     */
    quickGet:function(url,callback,port,encoding){
        this.defaultEncoding = typeof encoding=="undefined" ? this.defaultEncoding : encoding;
        var options = this._createOptions(url,"",port,'get');
        this._request(options,"",callback);
    },

    /**
     * post请求
     * @param url:地址
     * @param params:参数
     * @param callback(false/result):回调
     * @param port:端口
     * @param encoding:编码格式默认utf8
     */
    quickPost:function(url,params,callback,port,encoding){
        this.defaultEncoding = typeof encoding=="undefined" ? this.defaultEncoding : encoding;
        var options = this._createOptions(url,params,port,'post');
        this._request(options,params,callback);
    },

    /**
     * 请求
     * @param option:
     * @param params:
     * @param callback:
     * @private
     */
    _request:function(option,params,callback){
        var queryParams = QueryString.stringify(params);
        var isGet=option["method"]=="get";
        var req = Http.request(option,function(res){
            res.setEncoding(this.defaultEncoding);
            res.on('data',function(data){//正常信息
                callback(data);
            });
            res.on('error',function(error){//错误信息
                trace(error);
                callback(false);
            });
        });
        if(!isGet){
            req.write(queryParams);
        }
        req.on('error',function(error){
            trace(error);
            callback(false);
        });
        req.end();
    },


    /**
     *  创建连接参数
     * @param url
     * @param params
     * @param port
     * @param method
     * @returns {{method: *, host: *, port: *, path: (string|*), headers: {Content-Type: string}}}
     * @private
     */
    _createOptions:function(url,params,port,method){
        port = typeof port == "undefined" ? 80 : port;
        method = method.toLocaleLowerCase ();
        method = typeof method == "undefined" ? 'get' : method;
        var isget = method=='get';
        isget ? params = "" : params = QueryString.stringify(params);
        var host = this._getHost(url);
        path = url.indexOf("http://")<0 ? url.substring(host.length,url.length) : url.substring(("http://"+host).length,url.length);
        path += method=='get' && path.indexOf("?")<0 ? "?" : "";
        var option = {
            method:method,
            host:host,
            port:port,
            path:path,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf8',
                }
        };
        return option;
    },

    /**
     * 获取pure host
     * @param url
     * @returns {*}
     * @private
     */
    _getHost:function(url){
        var pos = url.indexOf("http://");
        if(pos<0){
            url = "http://"+url;
        }
        var durl=/http:\/\/([^\/]+)\//i;
        var domain = url.match(durl);
        return domain[1];
    },


}


module.exports = HttpClient;