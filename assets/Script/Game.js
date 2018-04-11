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
    gameInfoData:null,
    playerInfoData:null,
    allQiZi:null,
    startZouQiTime:null,
    properties: {
        qizi: {
            default: null,
            type: cc.Prefab
        },
        mySeatIndex:-1,
        playerSeatIndex:-1,
    },

    ctor: function () {
        this.playerInfoData = new Array()
        this.allQiZi = new Array()
        for(var i = 0; i < 15;i++){
            this.allQiZi[i] = new Array()
            for(var j = 0; j < 15;j++){
                this.allQiZi[i][j] = null
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:

    registerTouch:function(){
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            
            //var temp = event.getLocation()
            //cc.log("点击全局坐标： ",temp.x,temp.y)
            //获取当前点击的局部坐标
            //var tempPlayer = this.node.convertToNodeSpaceAR(event.getLocation())
            //cc.log("点击局部坐标： ",tempPlayer.x,tempPlayer.y)


          }, this);


          this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            
            //var temp = event.getLocation()
            //cc.log("点击全局坐标： ",temp.x,temp.y)
            //获取当前点击的局部坐标
            var tempPlayer = this.node.convertToNodeSpaceAR(event.getLocation())
            console.log("点击局部坐标： ",tempPlayer.x,tempPlayer.y)
            if(this.gameInfoData == null){
                return
            }
            if(this.gameInfoData.State != 2){
                return
            }
            if(this.gameInfoData.GameSeatIndex != this.mySeatIndex || this.mySeatIndex == -1){
                return
            }

            var Y = Math.floor((tempPlayer.y+350+25)/50)
            var X = Math.floor((tempPlayer.x+350+25)/50)
            console.log("x： y:",X,Y)
            NetMananger.getInstance().SendMsg(Msg.CS_DoGame5G(X,Y))

          }, this);
    },

    gameInfo:function(data){
        var jsdata = JSON.parse(data.JsonData)
        // var jsdata = {MsgGame5GPlayerInfo:[
        //     {Name:"123",SeatIndex:0,Uid:12},
        //     {Name:"333",SeatIndex:1,Uid:13}
        // ]}
        
         console.log("2222")

        //玩家信息
        for (var k in jsdata.PlayerInfo){
            var p = jsdata.PlayerInfo[k]
            this.playerInfoData[p.SeatIndex] = p

            //自己
            if(p.Uid == GameDataManager.getInstance().GetHallInfoData().Uid){
            //if(p.SeatIndex == 0){
                this.mySeatIndex = p.SeatIndex
            }else{
                this.playerSeatIndex = p.SeatIndex
            }

        }
        this.showPlayerInfo()


        this.gameInfoData = jsdata.GameInfo
        this.startZouQiTime = Tool.GetTimeMillon()
        this.showQiPanInfo()
    },

    //其他玩家进入
    playerGoIn:function(data){
        var jsdata = JSON.parse(data.JsonData)
        var p = jsdata.PlayerInfo
        if(p == null){
            return
        }
        //观察者
        if(p.PlayerType == 2 || p.SeatIndex < 0 ){
            return
        }

        if(p != null){
            this.playerInfoData[p.SeatIndex] = p

            //自己
            if(p.Uid == GameDataManager.getInstance().GetHallInfoData().Uid){
            //if(p.SeatIndex == 0){
                this.mySeatIndex = p.SeatIndex
            }else{
                this.playerSeatIndex = p.SeatIndex
            }
        }
        this.showPlayerInfo()
    },

    // const (
    //     Game5GState_Wait   = 1 //等待玩家加入中
    //     Game5GState_Gaming = 2 //游戏中
    //     Game5GState_Result = 3 //结算中
    //     Game5GState_Over   = 4 //解散
    // )
    //游戏开始
    gameStart:function(data){
        console.log("gamestart!")
        this.gameInfoData.State = 2
    },

    //切换下棋的人
    changeGameTurn:function(data){
        var jsdata = JSON.parse(data.JsonData)
        console.log("changeGameTurn!")
        this.gameInfoData.GameSeatIndex = jsdata.GameSeatIndex
        if(this.playerInfoData[jsdata.GameSeatIndex] != null){
            this.playerInfoData[jsdata.GameSeatIndex].Time = jsdata.Time
            this.playerInfoData[jsdata.GameSeatIndex].EveryTime = jsdata.EveryTime
        }

        this.startZouQiTime = Tool.GetTimeMillon()
        //console.log("time:"+this.startZouQiTime)

    },
    //玩家走棋
    doGame5G:function(data){
        var jsdata = JSON.parse(data.JsonData)
        console.log("doGame5G!")
        
        if(this.playerInfoData[jsdata.GameSeatIndex] != null){
            this.playerInfoData[jsdata.GameSeatIndex].Time = jsdata.Time
            
        }
        this.gameInfoData.QiPan[jsdata.Y][jsdata.X] = jsdata.GameSeatIndex
        this.gameInfoData.GameSeatIndex = -1

        this.showQiPanInfo()
    },

    //游戏结束
    gameOver:function(data){
        var jsdata = JSON.parse(data.JsonData)
        console.log("gameOver! win:"+this.playerInfoData[jsdata.WinPlayerSeatIndex].Name )
        this.gameInfoData.State = 3

        cc.loader.loadRes("gameover", function (err, prefab) {
            var newNode = cc.instantiate(prefab);
            this.node.addChild(newNode);
            var quitbtn = newNode.getChildByName("quit")
            quitbtn.on(cc.Node.EventType.TOUCH_END, function (event) {
                console.log("TOUCH_END")
                cc.director.loadScene("Hall", null);
            });

            var winname = this.playerInfoData[jsdata.WinPlayerSeatIndex].Name
            newNode.getChildByName("winname").getComponent(cc.Label).string = winname
            var loseSeatIndex = jsdata.WinPlayerSeatIndex
            if(jsdata.WinPlayerSeatIndex == 0){
                loseSeatIndex = 1
            }else{
                loseSeatIndex = 0
            }
            var losename = this.playerInfoData[loseSeatIndex].Name
            newNode.getChildByName("losename").getComponent(cc.Label).string = losename

        }.bind(this));
        
    },

    //玩家离开
    playerGoOut:function(data){
        var jsdata = JSON.parse(data.JsonData)
        console.log("playerGoOut! uid:"+jsdata.Uid )
        
        if(jsdata.Uid == GameDataManager.getInstance().GetHallInfoData().Uid){
            cc.director.loadScene("Hall", null);
        }
        
    },



    exitClick(event, customEventData){
        console.log("exitClick")
        console.log("event=",event.type," data=",customEventData);
        if( this.mySeatIndex >= 0){
            UiTool.newKuang2btn("提示","如果中途退出游戏,将直接判负,你确定要退出游戏吗?",function(){
                NetMananger.getInstance().SendMsg(Msg.CS_GoOut())
            })
        }
        else{
            NetMananger.getInstance().SendMsg(Msg.CS_GoOut())
        }
    },

    Disconnect:function(){
        console.log("Disconnect")
        cc.director.loadScene("Login", null);
    },
    //
    onDestroy(){
        console.log("game destory")
        MsgManager.getInstance().RemoveListener("SC_GameInfo")
        MsgManager.getInstance().RemoveListener("SC_PlayerGoIn")
        MsgManager.getInstance().RemoveListener("SC_GameStart")
        MsgManager.getInstance().RemoveListener("SC_ChangeGameTurn")
        MsgManager.getInstance().RemoveListener("SC_DoGame5G")
        MsgManager.getInstance().RemoveListener("SC_GameOver")
        MsgManager.getInstance().RemoveListener("SC_PlayerGoOut")
        MsgManager.getInstance().RemoveListener("WS_Close")

        GameDataManager.getInstance().SetGameData("GameId",-1)
    },

    onLoad () {

        console.log("onLoad")

        //this.gameInfo(null)
        this.registerTouch()

        MsgManager.getInstance().AddListener("SC_GameInfo",this.gameInfo.bind(this))
        MsgManager.getInstance().AddListener("SC_PlayerGoIn",this.playerGoIn.bind(this))
        MsgManager.getInstance().AddListener("SC_GameStart",this.gameStart.bind(this))
        MsgManager.getInstance().AddListener("SC_ChangeGameTurn",this.changeGameTurn.bind(this))
        MsgManager.getInstance().AddListener("SC_DoGame5G",this.doGame5G.bind(this))
        MsgManager.getInstance().AddListener("SC_GameOver",this.gameOver.bind(this))
        MsgManager.getInstance().AddListener("SC_PlayerGoOut",this.playerGoOut.bind(this))
        MsgManager.getInstance().AddListener("WS_Close",this.Disconnect.bind(this))

        NetMananger.getInstance().SendMsg(Msg.CS_GoIn(GameDataManager.getInstance().GetGameData("GameId")))
    },
    //显示棋盘信息
    showQiPanInfo:function(){
        for(var y = 0; y < this.gameInfoData.QiPan.length;y++){
            for(var x = 0; x < this.gameInfoData.QiPan[y].length;x++){
                
                if(this.gameInfoData.QiPan[y][x] >= 0){
                    if(this.allQiZi[y][x] == null){
                        //创建棋子
                        
                        console.log("x:"+x+" y:"+y+" value:"+this.gameInfoData.QiPan[y][x])
                        var path = cc.url.raw("resources/qizi/qizi_"+(this.gameInfoData.QiPan[y][x]+1)+".png")
                        console.log(path)
                        this.allQiZi[y][x] = cc.instantiate(this.qizi);
                        this.allQiZi[y][x].parent = this.node;
                        this.allQiZi[y][x].position = cc.p(-350+x*50, -350+y*50)
                        //new cc.SpriteFrame(texture);
                        //var contentsize = this.allQiZi[y][x].getComponent(cc.Sprite).spriteFrame.contentsize
                        this.allQiZi[y][x].getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(path);
                        //this.allQiZi[y][x].getComponent(cc.Sprite).spriteFrame.contentsize = contentsize
                    }
                }else{
                    if(this.allQiZi[y][x] != null){
                        this.allQiZi[y][x].destory()
                    }
                }

            }
        }



    },

    //显示玩家信息
    showPlayerInfo:function(){

        var nodeInfo = new Array("myInfo","playerInfo")
        var playerInfo = new Array()
        //不是观察者的情况
        if( this.mySeatIndex >= 0){
            playerInfo[0] = this.mySeatIndex
            playerInfo[1] = this.playerSeatIndex
        }else{
            if( this.playerInfoData[0] != null){
                playerInfo[0] = this.playerInfoData[0].SeatIndex
            }
            if( this.playerInfoData[1] != null){
                playerInfo[1] = this.playerInfoData[1].SeatIndex
            }
            
        }

        for(var i = 0; i < 2; i++){
            //座位号 有人
            if( playerInfo[i] >= 0){
                this.node.getChildByName(nodeInfo[i]).getChildByName("name").getComponent(cc.Label).string = this.playerInfoData[playerInfo[i]].Name
                var win = this.playerInfoData[playerInfo[i]].WinCount
                var lose = this.playerInfoData[playerInfo[i]].LoseCount
                var winpersent = 0
                if(win+lose > 0){
                    winpersent = Math.floor(win/(win+lose)*10000)/100
                    console.log("num:"+winpersent)
                }
                this.node.getChildByName(nodeInfo[i]).getChildByName("winpersent").getComponent(cc.Label).string = winpersent+"%"

                //棋子类型
                var path = cc.url.raw("resources/qizi/qizi_"+(playerInfo[i]+1)+".png")
                this.node.getChildByName(nodeInfo[i]).getChildByName("qizi").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(path);
            }
        }



        // if( this.mySeatIndex >= 0){
        //     this.node.getChildByName("myInfo").getChildByName("name").getComponent(cc.Label).string = this.playerInfoData[this.mySeatIndex].Name
        //     var win = this.playerInfoData[this.mySeatIndex].WinCount
        //     var lose = this.playerInfoData[this.mySeatIndex].LoseCount
        //     var winpersent = 0
        //     if(win+lose > 0){
        //         winpersent = Math.floor(win/(win+lose)*10000)/100
        //         console.log("num:"+winpersent)
        //     }
        //     this.node.getChildByName("myInfo").getChildByName("winpersent").getComponent(cc.Label).string = winpersent+"%"

        //     //棋子类型
        //     var path = cc.url.raw("resources/qizi/qizi_"+(this.mySeatIndex+1)+".png")
        //     this.node.getChildByName("myInfo").getChildByName("qizi").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(path);

        // }
        // if( this.playerSeatIndex >= 0){
        //     var win = this.playerInfoData[this.playerSeatIndex].WinCount
        //     var lose = this.playerInfoData[this.playerSeatIndex].LoseCount
        //     var winpersent = 0
        //     if(win+lose > 0){
        //         winpersent = Math.floor(win/(win+lose)*10000)/100
        //         console.log("num:"+winpersent)
        //     }
        //     this.node.getChildByName("playerInfo").getChildByName("name").getComponent(cc.Label).string = this.playerInfoData[this.playerSeatIndex].Name
        //     this.node.getChildByName("playerInfo").getChildByName("winpersent").getComponent(cc.Label).string = winpersent+"%"

        //     //棋子类型
        //     var path = cc.url.raw("resources/qizi/qizi_"+(this.playerSeatIndex+1)+".png")
        //     this.node.getChildByName("playerInfo").getChildByName("qizi").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(path);
        // }
        
    },

    start () {
        
    },

    update (dt) {

        if(this.gameInfoData == null){
            return
        }


        if(this.gameInfoData.State == 2){


            var nodeInfo = new Array("myInfo","playerInfo")
            var playerInfo = new Array()
            //不是观察者的情况
            if( this.mySeatIndex >= 0){
                playerInfo[0] = this.mySeatIndex
                playerInfo[1] = this.playerSeatIndex
            }else{
                if( this.playerInfoData[0] != null){
                    playerInfo[0] = this.playerInfoData[0].SeatIndex
                }
                if( this.playerInfoData[1] != null){
                    playerInfo[1] = this.playerInfoData[1].SeatIndex
                }
            }
            for(var i = 0; i < 2; i++){
                //座位号 有人
                if( playerInfo[i] >= 0){
                    var time = this.playerInfoData[playerInfo[i]].Time
                    var everytime = this.playerInfoData[playerInfo[i]].EveryTime
                    //console.log("time:"+time)
                    if(this.gameInfoData.GameSeatIndex == playerInfo[i] && this.gameInfoData.GameSeatIndex != -1){
        
                        var subtime = (Tool.GetTimeMillon()-this.startZouQiTime)/1000
                        var gameEveryTime = everytime
                        if( subtime >= gameEveryTime){
                            this.node.getChildByName(nodeInfo[i]).getChildByName("EveryTime").getComponent(cc.Label).string = Tool.TimeMillonToHHMMSS(0)
                            this.node.getChildByName(nodeInfo[i]).getChildByName("Time").getComponent(cc.Label).string = Tool.TimeMillonToHHMMSS(time-subtime+gameEveryTime)
                        }
                        else{
                            this.node.getChildByName(nodeInfo[i]).getChildByName("EveryTime").getComponent(cc.Label).string = Tool.TimeMillonToHHMMSS(gameEveryTime-subtime)
                            this.node.getChildByName(nodeInfo[i]).getChildByName("Time").getComponent(cc.Label).string = Tool.TimeMillonToHHMMSS(time)
                        }
                    }
                }
            }


            // if( this.mySeatIndex >= 0){
            //     var time = this.playerInfoData[this.mySeatIndex].Time
            //     var everytime = this.playerInfoData[this.mySeatIndex].EveryTime
            //     //console.log("time:"+time)
            //     if(this.gameInfoData.GameSeatIndex == this.mySeatIndex && this.gameInfoData.GameSeatIndex != -1){
    
            //         var subtime = (Tool.GetTimeMillon()-this.startZouQiTime)/1000
            //         var gameEveryTime = everytime
            //         if( subtime >= gameEveryTime){
            //             this.node.getChildByName("myInfo").getChildByName("EveryTime").getComponent(cc.Label).string = Tool.TimeMillonToHHMMSS(0)
            //             this.node.getChildByName("myInfo").getChildByName("Time").getComponent(cc.Label).string = Tool.TimeMillonToHHMMSS(time-subtime+gameEveryTime)
            //         }
            //         else{
            //             this.node.getChildByName("myInfo").getChildByName("EveryTime").getComponent(cc.Label).string = Tool.TimeMillonToHHMMSS(gameEveryTime-subtime)
            //             this.node.getChildByName("myInfo").getChildByName("Time").getComponent(cc.Label).string = Tool.TimeMillonToHHMMSS(time)
            //         }
            //     }
            // }
            // if( this.playerSeatIndex >= 0){
    
            //     var time = this.playerInfoData[this.playerSeatIndex].Time
            //     var everytime = this.playerInfoData[this.playerSeatIndex].EveryTime
            //     //console.log("time:"+time)
            //     if(this.gameInfoData.GameSeatIndex == this.playerSeatIndex && this.gameInfoData.GameSeatIndex != -1){
    
            //         var subtime = (Tool.GetTimeMillon()-this.startZouQiTime)/1000
            //         var gameEveryTime = everytime
            //         if( subtime >= gameEveryTime){
            //             this.node.getChildByName("playerInfo").getChildByName("EveryTime").getComponent(cc.Label).string = Tool.TimeMillonToHHMMSS(0)
            //             this.node.getChildByName("playerInfo").getChildByName("Time").getComponent(cc.Label).string = Tool.TimeMillonToHHMMSS(time-subtime+gameEveryTime)
            //         }
            //         else{
            //             this.node.getChildByName("playerInfo").getChildByName("EveryTime").getComponent(cc.Label).string = Tool.TimeMillonToHHMMSS(gameEveryTime-subtime)
            //             this.node.getChildByName("playerInfo").getChildByName("Time").getComponent(cc.Label).string = Tool.TimeMillonToHHMMSS(time)
            //         }
            //     }
            //     //this.node.getChildByName("playerInfo").getChildByName("name").getComponent(cc.Label).string = this.playerInfoData[this.playerSeatIndex].Name
            // }
        }

        
    },
});
