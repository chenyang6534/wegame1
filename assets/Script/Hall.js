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
var UiTool = require("UiTool")
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
    quickGameClick(event, customEventData){
        console.log("quickGameClick")
        console.log("event=",event.type," data=",customEventData);

        NetMananger.getInstance().SendMsg(Msg.CS_QuickGame())
    },
    lookGameClick(event, customEventData){
        console.log("lookGameClick")
        console.log("event=",event.type," data=",customEventData);

        // var t1 = Tool.GetTimeMillon()
        // console.log("time:"+t1)

        // console.log(Tool.TimeMillonToHHMMSS(t1/1000))

        NetMananger.getInstance().SendMsg(Msg.CS_GetGamingInfo())
        
    },
    roomGameClick(event, customEventData){
        console.log("roomGameClick")
        console.log("event=",event.type," data=",customEventData);
    },

    SerchingPlayer:function(data){
        console.log("SerchingPlayer")
        cc.loader.loadRes("serchplayer", function (err, prefab) {
            var newNode = cc.instantiate(prefab);
            this.node.addChild(newNode);
            var quitbtn = newNode.getChildByName("quit")
            quitbtn.on(cc.Node.EventType.TOUCH_END, function (event) {
                console.log("TOUCH_END")
                NetMananger.getInstance().SendMsg(Msg.CS_QuickGameExit())
                newNode.destroy()
            });
        }.bind(this));

    },
    GetGamingInfo:function(data){
        var jsdata = JSON.parse(data.JsonData)
        console.log("GetGamingInfo! uid:"+jsdata.Uid )
        this.newGameInfo(jsdata)
    },
    
    
    newGameInfo:function(data){

        var parentscene = this.node
        if(parentscene == null){
            console.log("parentscene == null")
        }

        cc.loader.loadRes("gameinfo", function (err, prefab) {
            var newNode = cc.instantiate(prefab);
            console.log("111")
            newNode.parent = parentscene
            console.log("222")
            //parentscene.addChild(newNode);

            var cancelbtn = newNode.getChildByName("close")
            cancelbtn.on(cc.Node.EventType.TOUCH_END, function (event) {
                console.log("TOUCH_END")
                //newNode.destory()
                newNode.removeFromParent()
                
            });

            var scrollview = newNode.getChildByName("scrollview").getChildByName("view").getChildByName("content")
            //玩家信息
            for (var k in data.GameInfo){
                var p = data.GameInfo[k]

                var oneGameInfo = cc.instantiate(newNode.getChildByName("oneGameInfo"));
                oneGameInfo.parent = scrollview
                oneGameInfo.getChildByName("name").getComponent(cc.Label).string = p.GameName
                oneGameInfo.getChildByName("player").getComponent(cc.Label).string = p.PlayerOneName+","+p.PlayerTwoName
                oneGameInfo.getChildByName("score").getComponent(cc.Label).string = p.Score

                var lookbtn = oneGameInfo.getChildByName("look")
                lookbtn.on(cc.Node.EventType.TOUCH_END, function (event) {
                    console.log("lookbtn:"+p.GameId)
                    //newNode.destory()
                    //newNode.removeFromParent()
                    GameDataManager.getInstance().SetGameData("GameId",p.GameId)
                    
                });
                

            }
            

        });

    
    },
    
    // LIFE-CYCLE CALLBACKS:

    Disconnect:function(){
        console.log("Disconnect")
        cc.director.loadScene("Login", null);
    },
    


    onLoad () {
        console.log("onload hall")
        MsgManager.getInstance().AddListener("SC_SerchPlayer",this.SerchingPlayer.bind(this))
        MsgManager.getInstance().AddListener("SC_GetGamingInfo",this.GetGamingInfo.bind(this))

        MsgManager.getInstance().AddListener("WS_Close",this.Disconnect.bind(this))
        // NetMananger.getInstance().Login(this.LoginSucc.bind(this),this.LoginFail.bind(this))

        this.node.getChildByName("userInfo").getChildByName("name").getComponent(cc.Label).string = GameDataManager.getInstance().GetHallInfoData().Name
        this.node.getChildByName("userInfo").getChildByName("win").getComponent(cc.Label).string = GameDataManager.getInstance().GetHallInfoData().WinCount
        var allcount = GameDataManager.getInstance().GetHallInfoData().WinCount+GameDataManager.getInstance().GetHallInfoData().LoseCount
        this.node.getChildByName("userInfo").getChildByName("all").getComponent(cc.Label).string = allcount
    
    },
    onDestroy(){
        console.log("hall destory")
        MsgManager.getInstance().RemoveListener("SC_SerchPlayer")
        //MsgManager.getInstance().RemoveListener("SC_NewGame")
        MsgManager.getInstance().RemoveListener("WS_Close")
        MsgManager.getInstance().RemoveListener("SC_GetGamingInfo")
    },

    start () {

    },

    update (dt) {
        if(GameDataManager.getInstance().GetGameData("GameId") > 0){
            cc.director.loadScene("Game5G", null);
        }
    },
});
