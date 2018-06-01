



//var wx = require("Wx")



//var serverSrc = "ws://127.0.0.1:1117/connect"
//var serverSrc = "ws://www.game5868.top:443/connect1""ws://192.168.6.143:1117/connect"
var serverSrc = "ws://192.168.6.143:1117/connect"
var wxServerSrc = "wss://www.game5868.top/connect"
var Msg = require("Msg")
var MsgManager = require("MsgManager")
var GameDataManager = require("GameDataManager")
var Tool = require("Tool")

var NetManager = cc.Class({
    name: "NetManager",
    loginSucc:null,
    loginFail:null,
    m_webSocket : null,
    isWX:null,
    extends: cc.Component,
    ctor: function () {
        GameDataManager.getInstance()
        MsgManager.getInstance().AddListener("SC_LoginResponse",this.LoginSucc.bind(this))

        MsgManager.getInstance().AddListener("SC_Result",this.Result.bind(this))

        //
        console.log("component.schedule")
        this.schedule(this.SendHeart.bind(this), 5);
    },
    Result:function(data){
        var jsdata = JSON.parse(data.JsonData)
        console.log("Result!:"+jsdata.Result )
    },
    SendHeart:function(){
        
        //console.log("SendHeart")

        this.SendMsg(Msg.CS_Heart())
    },

    SendMsg:function(msg){
        if (this.m_webSocket == null){
            console.log("this.m_webSocket == null")
            return false
        }
        if(this.isWX == true){
            this.m_webSocket.send({data:msg})
        }else{
            this.m_webSocket.send(msg)
        }
        return true
        
    },

    LoginSucc:function(){
        if( this.loginSucc != null){
            this.loginSucc()
        }
    },

    Login:function(name,avatar,succCallBack,failCallBack){
        this.loginSucc = succCallBack
        this.loginFail = failCallBack

        if (cc.sys.platform === cc.sys.WECHAT_GAME){
            this.WXLogin(name,avatar)
        }else{
            this.QuickLogin("ios","1234567912112314116")
        }

        
        //
    },

    WXLogin:function(name,avatar){
        this.isWX = true
        //调用微信登录接口 
        wx.login({//login流程
            success: function (res) {//登录成功
              if (res.code) {
                var code = res.code;
                console.log(code);

                
                    
                this.m_webSocket = wx.connectSocket({
                    url: wxServerSrc
                })
                console.log(this.m_webSocket)
                wx.onSocketOpen(function (res) {
                    console.log("onSocketOpen12")
                    //console.log(Msg.CS_MsgWeiXingLogin(code,res2.userInfo.nickName))

                    // wx.sendSocketMessage({
                    //     data:Msg.CS_MsgWeiXingLogin(code,res2.userInfo.nickName)
                    // })

                    this.m_webSocket.send({
                            data:Msg.CS_MsgWeiXingLogin(code,name,avatar)
                        })
                }.bind(this))
                wx.onSocketError(function (res) {
                    console.log('WebSocket 连接打开失败，请检查！')
                        if( this.loginFail != null){
                            this.loginFail()
                        }
                }.bind(this))
                wx.onSocketClose(function (res) {
                    console.log('WebSocket 连接关闭！')

                        this.m_webSocket = null
                        //
                        MsgManager.getInstance().ParseLocalMsg("WS_Close",null)
                }.bind(this))
                wx.onSocketMessage(function (res) {
                    console.log('WebSocket 收到消息')
                    console.log(res)
                    MsgManager.getInstance().ParseMsg(res.data)
                }.bind(this))
                    

          
              } else {
                console.log('获取用户登录态失败1！' + res.errMsg)
                if( this.loginFail != null){
                    this.loginFail()
                }
              }
            }.bind(this),
            fail: function (res) {//登录成功
                console.log('获取用户登录态失败2！' + res.errMsg)
                if( this.loginFail != null){
                    this.loginFail()
                }
            }.bind(this)

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
            if( this.loginFail != null){
                this.loginFail()
            }
        }.bind(this);
        this.m_webSocket.onclose = function (event) {
            console.log("WebSocket instance closed.");
            this.m_webSocket = null
            //
            MsgManager.getInstance().ParseLocalMsg("WS_Close",null)

        }.bind(this);
    }


});
    





NetManager._instance = null;
NetManager.getInstance = function () {
    if(!NetManager._instance){
        NetManager._instance = new NetManager();
        //启动初始化
        Tool.checkShare()
        
        
    }
    return NetManager._instance;
}

module.exports = NetManager;