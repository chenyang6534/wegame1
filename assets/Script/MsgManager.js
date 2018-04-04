







var Msg = require("Msg")

var MsgManager = cc.Class({
    name: "MsgManager",
    listener: null,

    ctor: function () {
        this.listener = new Map()
    },

    AddListener:function(key,callback){
        if (this.listener.get(key) != null) {
            console.log("AddListener error:1")
        }
        this.listener[key] = callback
    },

    RemoveListener:function(key){
        delete this.listener[key]
    },

    ParseMsg:function(data){
        var jdata = JSON.parse(data)
        if (jdata.MsgType != null){
            var callback = this.listener[jdata.MsgType]
            if ( callback != null ){
                callback(jdata)
            }
        }
    },


});
    





MsgManager._instance = null;
MsgManager.getInstance = function () {
    if(!MsgManager._instance){
        MsgManager._instance = new MsgManager();
    }
    return MsgManager._instance;
}

module.exports = MsgManager;