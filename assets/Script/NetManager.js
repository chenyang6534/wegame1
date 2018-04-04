







//var serverSrc = "ws://127.0.0.1:1117/connect"
//var serverSrc = "ws://www.game5868.top/connect1"
var serverSrc = "wss://www.game5868.top/connect"
var wxServerSrc = "wss://www.game5868.top/connect"
var Msg = require("Msg")
var MsgManager = require("MsgManager")

var NetManager = cc.Class({
    name: "NetManager",
    loginSucc:null,
    loginFail:null,
    m_webSocket : null,
    ctor: function () {
        MsgManager.getInstance().AddListener("SC_LoginResponse",this.LoginSucc.bind(this))
    },

    LoginSucc:function(){
        if( this.loginSucc != null){
            this.loginSucc()
        }
    },

    Login:function(succCallBack,failCallBack){
        this.loginSucc = succCallBack
        this.loginFail = failCallBack


        //this.QuickLogin("ios","123456789")
        this.WXLogin()
    },

    WXLogin:function(){
        //调用微信登录接口  
        wx.login({//login流程
            success: function (res) {//登录成功
              if (res.code) {
                var code = res.code;
                console.log(code);

                wx.getUserInfo({//getUserInfo流程
                    success: function (res2) {//获取userinfo成功
                    console.log(res2);
                    var encryptedData = encodeURIComponent(res2.encryptedData);//一定要把加密串转成URI编码
                    var iv = res2.iv;
                    console.log(res2.userInfo.nickName);
                    console.log(res2.userInfo.avatarUrl);
                    //请求自己的服务器
                    //Login(code,encryptedData,iv);
                    
                    this.m_webSocket = wx.connectSocket({
                        url: wxServerSrc
                    })
                    wx.onSocketOpen(function (res) {
                        console.log("onSocketOpen")
                        console.log(Msg.CS_MsgWeiXingLogin(code,res2.userInfo.nickName))

                        // wx.sendSocketMessage({
                        //     data:Msg.CS_MsgWeiXingLogin(code,res2.userInfo.nickName)
                        // })

                        this.m_webSocket.send({
                                data:Msg.CS_MsgWeiXingLogin(code,res2.userInfo.nickName)
                            })
                    }.bind(this))
                    wx.onSocketError(function (res) {
                        console.log('WebSocket 连接打开失败，请检查！')
                    }.bind(this))
                    wx.onSocketClose(function (res) {
                        console.log('WebSocket 连接关闭！')
                    }.bind(this))
                    wx.onSocketMessage(function (res) {
                        console.log('WebSocket 收到消息')
                        console.log(res)
                        MsgManager.getInstance().ParseMsg(res.data)
                    }.bind(this))
                    

                  }
                })
          
              } else {
                console.log('获取用户登录态失败！' + res.errMsg)
              }
            }
        })
    },

    QuickLogin:function(Platform,MachineId){
        this.m_webSocket = new WebSocket(serverSrc);
        console.log(this.m_webSocket)
        console.log("1245")
        this.m_webSocket.onopen = function (event) {
            console.log("onopen")
            this.m_webSocket.send(Msg.CS_MsgQuickLogin(Platform,MachineId))
        }.bind(this);
        this.m_webSocket.onmessage = function (event) {
            console.log("response text msg: " + event.data);
            MsgManager.getInstance().ParseMsg(event.data)
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