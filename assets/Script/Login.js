// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html







var NetMananger = require("NetManager")
var Msg = require("Msg")
var MsgManager = require("MsgManager")
var GameDataManager = require("GameDataManager")
var Tool = require("Tool")

var ResData = require("ResData")

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var bao = this.node.getChildByName("test1")
        var shi = this.node.getChildByName("test2")
        var wu = this.node.getChildByName("test3")
        var zi = this.node.getChildByName("test4")
        var qi = this.node.getChildByName("test5")

        
        var baoEndPos = bao.position
        var shiEndPos = shi.position
        var wuEndPos = wu.position
        var ziEndPos = zi.position
        var qiEndPos = qi.position

        bao.position = cc.p(bao.position.x,bao.position.y+500)
        shi.position = cc.p(shi.position.x,shi.position.y+500)
        wu.position = cc.p(wu.position.x,wu.position.y+500)
        zi.position = cc.p(zi.position.x,zi.position.y+500)
        qi.position = cc.p(qi.position.x,qi.position.y+500)

        this.AnimOver = false
        this.ToHall = false


        var baoaction = cc.sequence( 
                                    cc.delayTime(0.01),
                                    cc.callFunc(function(target, score) {
                                        Tool.playSound("resources/sound/fall.mp3",false,0.51)
                                    }),
                                    cc.moveTo(0.35,baoEndPos).easing(cc.easeElasticOut(0.5))
                                    );
        var shiaction = cc.sequence( 
                                    cc.delayTime(0.21),
                                    cc.callFunc(function(target, score) {
                                        Tool.playSound("resources/sound/fall.mp3",false,0.51)
                                    }),
                                    cc.moveTo(0.35,shiEndPos).easing(cc.easeElasticOut(0.5))
                                    );
        var wuaction = cc.sequence( 
                                    cc.delayTime(0.41),
                                    cc.callFunc(function(target, score) {
                                        Tool.playSound("resources/sound/fall.mp3",false,0.51)
                                    }),
                                    cc.moveTo(0.35,wuEndPos).easing(cc.easeElasticOut(0.5))
                                    );
        var ziaction = cc.sequence( 
                                    cc.delayTime(0.61),
                                    cc.callFunc(function(target, score) {
                                        Tool.playSound("resources/sound/fall.mp3",false,0.51)
                                    }),
                                    cc.moveTo(0.35,ziEndPos).easing(cc.easeElasticOut(0.5))
                                    );
        var qiaction = cc.sequence( 
                                    cc.delayTime(0.81),
                                    cc.callFunc(function(target, score) {
                                        Tool.playSound("resources/sound/fall.mp3",false,0.51)
                                    }),
                                    cc.moveTo(0.35,qiEndPos).easing(cc.easeElasticOut(0.5)),
                                    cc.callFunc(function(target, score) {
                                        this.AnimOver = true
                                    }.bind(this)));
        bao.runAction(baoaction)
        shi.runAction(shiaction)
        wu.runAction(wuaction)
        zi.runAction(ziaction)
        qi.runAction(qiaction)

    },

    LoginSucc:function(){
        console.log("LoginSucc")
        //cc.director.loadScene("Hall", null);
        this.ToHall = true
        this.islogining = false

    },
    LoginFail:function(){
        console.log("LoginFail")
        this.islogining = false

        this.node.getChildByName("loginnotice").active = false
        this.node.getChildByName("loginword").getComponent(cc.Label).string = "登录失败"
        if (cc.sys.platform === cc.sys.WECHAT_GAME){

        }else{
            this.node.getChildByName("reLogin").active = true
        }
        
    },

    onDestroy(){
        console.log("login destory")
        MsgManager.getInstance().RemoveListener("WS_Close")
        Tool.destroyLoginBtn()
    },

    loginGameClick(event, customEventData){
        console.log("lookGameClick")
        
        // this.node.getChildByName("loginword").getComponent(cc.Label).string = "登录中..."
        // NetMananger.getInstance().Login(this.LoginSucc.bind(this),this.LoginFail.bind(this))
        // this.node.getChildByName("reLogin").active = false
        NetMananger.getInstance().Login("","",this.LoginSucc.bind(this),this.LoginFail.bind(this))
    },

    wxlogin(name,avatar){
        //this.node.getChildByName("loginword").getComponent(cc.Label).string = "登录中..."

        if(this.islogining == true){
            return
        }

        this.islogining = true


        this.node.getChildByName("loginnotice").active = true
        //var name = this.node.getChildByName("loginname").getComponent(cc.EditBox).string
        console.log("----edit1:"+name)

        name = Tool.filteremoji(name)
        console.log("----edit2:"+name)
        NetMananger.getInstance().Login(name,avatar,this.LoginSucc.bind(this),this.LoginFail.bind(this))

        
    },

    startWXLogin(){
        //this.node.getChildByName("loginword").getComponent(cc.Label).string = "登录中..."
    },



    showLoginNotice:function(isshow){



        
    },


    start () {
        Tool.showBanner(false)

        this.islogining = false
        MsgManager.getInstance().AddListener("WS_Close",this.LoginFail.bind(this))

        if (cc.sys.platform === cc.sys.WECHAT_GAME){

            this.node.getChildByName("loginnotice").active = false
            this.node.getChildByName("reLogin").active = false

            wx.getUserInfo({
                success: function (res) {
                    console.log("getUserInfo succ");
                    console.log(res);

                    this.wxlogin(res.userInfo.nickName,res.userInfo.avatarUrl)
                    

                }.bind(this),
                fail: function (res) {
                    console.log("getUserInfo fail");
                    
                    Tool.createLoginBtn(this.wxlogin.bind(this),this.startWXLogin.bind(this))
                    

                  
                }.bind(this)
              })



            
            
        }else{
            //console.log("----edit:"+this.node.getChildByName("loginname").getComponent(cc.EditBox).string)
            //this.node.getChildByName("loginname").getComponent(cc.EditBox).string = 

            // console.log("width1:"+this.node.getChildByName("loginword").width)
            // this.node.getChildByName("loginword").getComponent(cc.Label).string = "范德萨发"
            // console.log("width2:"+this.node.getChildByName("loginword").width)

            NetMananger.getInstance().Login("name111","avatar222",this.LoginSucc.bind(this),this.LoginFail.bind(this))
        }

        // this.node.getChildByName("loginword").getComponent(cc.Label).string = "登录中..."
        // NetMananger.getInstance().Login(this.LoginSucc.bind(this),this.LoginFail.bind(this))
        // this.node.getChildByName("reLogin").active = false

    },


    update (dt) {
        if(this.AnimOver == true && this.ToHall == true){
            this.ToHall = false
            cc.director.loadScene("Hall", null);
        }
    },
});
