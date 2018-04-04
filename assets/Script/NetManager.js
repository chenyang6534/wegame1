







var serverSrc = "ws://127.0.0.1:1117/connect"

var Msg = require("Msg")

var NetManager = cc.Class({
    name: "NetManager",

    m_webSocket : null,


    Login:function(succCallBack,failCallBack){
        console.log("Login")
        if(succCallBack != null){
            succCallBack()
        }
        this.QuickLogin("ios","123456789")
    },

    QuickLogin:function(Platform,MachineId){
        this.m_webSocket = new WebSocket(serverSrc);
        this.m_webSocket.onopen = function (event) {
            this.m_webSocket.send(Msg.CS_MsgQuickLogin(Platform,MachineId))
        }.bind(this);
        this.m_webSocket.onmessage = function (event) {
            console.log("response text msg: " + event.data);
        }.bind(this);
        this.m_webSocket.onerror = function (event) {
            console.log("Send Text fired an error");
        }.bind(this);
        this.m_webSocket.onclose = function (event) {
            console.log("WebSocket instance closed.");
        }.bind(this);
    }


});
    





NetManager._instance = null;
NetManager.getInstance = function () {
    if(!NetManager._instance){
        NetManager._instance = new NetManager();
    }
    return NetManager._instance;
}

module.exports = NetManager;