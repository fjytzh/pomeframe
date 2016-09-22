/**
 * Created by cx on 2015/7/31.
 */
var LogsModel = BaseModel.extends({

    ctor:function(con){
        this.table_name = "error_log";
        this._super(con);
    }
});




module.exports = LogsModel;