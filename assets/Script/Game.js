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
var ResData = require("ResData")
var gezhiwidth = 48
cc.Class({
    extends: cc.Component,
    gameInfoData:null,
    playerInfoData:null,
    allQiZi:null,
    allQiZiStep:null,
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
        this.allQiZiStep = new Array()
        for(var i = 0; i < 15;i++){
            this.allQiZiStep[i] = new Array()
            for(var j = 0; j < 15;j++){
                this.allQiZiStep[i][j] = null
            }
        }
    },

    checkfirstshow:function(){
        this.node.getChildByName("firstlayer").active = false
        if(this.gameInfoData == null){
            return
        }
        if(this.gameInfoData.State != 2){
            return
        }
        if(this.gameInfoData.GameSeatIndex != this.mySeatIndex || this.mySeatIndex == -1){
            return
        }

        for(var y = 0; y < this.gameInfoData.QiPan.length;y++){
            for(var x = 0; x < this.gameInfoData.QiPan[y].length;x++){

               
                
                if(this.gameInfoData.QiPan[y][x] >= 0){
                    return
                }
            }
        }

        this.node.getChildByName("firstlayer").active = true
    },

    // LIFE-CYCLE CALLBACKS:

    registerTouch:function(){

        var touchStartTime = Tool.GetTimeMillon()
        var moved = false
        var moveY = -1
        var moveX = -1
        var touchTime = 400
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            
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

            touchStartTime = Tool.GetTimeMillon()

            this.node.getChildByName("touchmoveqizi").position = cc.p(0,10000)
            var path = UiTool.getPathByQiZiId(this.playerInfoData[this.mySeatIndex].QiZiId)
            this.node.getChildByName("touchmoveqizi").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(path);
            moved = false


          }, this);

          this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            
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
            tempPlayer.y = tempPlayer.y + 100
            var Y = Math.floor((tempPlayer.y+360)/gezhiwidth)
            var X = Math.floor((tempPlayer.x+360)/gezhiwidth)
            console.log("t1:"+(Tool.GetTimeMillon() - touchStartTime)+" t2:"+touchTime)
            if( Tool.GetTimeMillon() - touchStartTime < touchTime){
                return
            }
            console.log("x： y:",X,Y)
            if( X < 0 || X >=15 || Y < 0 || Y >= 15){
                moved = true
                moveX = X
                moveY = Y
                this.node.getChildByName("touchmoveqizi").position = cc.p(0,10000)
                return
            }
            moved = true
            moveX = X
            moveY = Y

            this.node.getChildByName("touchmoveqizi").position = cc.p(-336+moveX*gezhiwidth, -336+moveY*gezhiwidth)

            

          }, this);


          this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            
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

            var Y = Math.floor((tempPlayer.y+360)/gezhiwidth)
            var X = Math.floor((tempPlayer.x+360)/gezhiwidth)
            console.log("x： y:",X,Y)
            //if( Tool.GetTimeMillon() - touchStartTime > touchTime)

            if(moved == true){
                

                this.showOK(moveX,moveY)
                //NetMananger.getInstance().SendMsg(Msg.CS_DoGame5G(moveX,moveY))
                return
            }
            this.showOK(X,Y)
            //NetMananger.getInstance().SendMsg(Msg.CS_DoGame5G(X,Y))

          }, this);
    },
    showOK:function(x,y){
        //this.ok.active = true
        console.log("----x:"+x+"---y:"+y)
        
        this.node.getChildByName("ok").position = cc.p(-336+x*gezhiwidth, -336+(y+1)*gezhiwidth)
        this.node.getChildByName("ok").zIndex = 100000
        this.node.getChildByName("touchmoveqizi").position = cc.p(-336+x*gezhiwidth, -336+(y)*gezhiwidth)
        //console.log("---11-x:"+this.ok.position.x+"---y:"+this.ok.position.y)
        this.node.getChildByName("ok").X = x
        this.node.getChildByName("ok").Y = y
    },
    hideOK:function(){
        //this.ok.active = false
        this.node.getChildByName("ok").position = cc.p(0, 10000)
    },
    okClick(event, customEventData){
        console.log("okClick")
        this.hideOK()
        this.node.getChildByName("touchmoveqizi").position = cc.p(0,10000)
        NetMananger.getInstance().SendMsg(Msg.CS_DoGame5G(this.node.getChildByName("ok").X,this.node.getChildByName("ok").Y))
    },

    gameInfo:function(data){
        var jsdata = JSON.parse(data.JsonData)
        // var jsdata = {MsgGame5GPlayerInfo:[
        //     {Name:"123",SeatIndex:0,Uid:12},
        //     {Name:"333",SeatIndex:1,Uid:13}
        // ]}
        
         console.log("2222")
         this.gameInfoData = jsdata.GameInfo
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

        this.lookNoticeAnim()


        
        this.startZouQiTime = Tool.GetTimeMillon()
        this.showQiPanInfo()
        this.changeGameTurnAnim()
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

    //3,2,1动画
    startTimeAnim:function(){
        console.log("startTimeAnim!")
        

        var myAction = cc.sequence( cc.callFunc(function(target, score) {
                                    target.position = cc.p(0,750/4)
                                    target.setScale(2)
                                    target.getComponent(cc.Label).string = 3
                                    Tool.playSound("resources/sound/time.mp3",false,0.3)
                                    }, this, 0),
                                    cc.scaleTo(1,1,1),
                                    //cc.delayTime(0.2),
                                    cc.callFunc(function(target, score) {
                                        target.position = cc.p(0,750/4)
                                        target.setScale(2)
                                        target.getComponent(cc.Label).string = 2
                                        Tool.playSound("resources/sound/time.mp3",false,0.3)
                                        }, this, 0),
                                    cc.scaleTo(1,1,1),
                                    //cc.delayTime(0.2),
                                    cc.callFunc(function(target, score) {
                                        target.position = cc.p(0,750/4)
                                        target.setScale(2)
                                        target.getComponent(cc.Label).string = 1
                                        Tool.playSound("resources/sound/time.mp3",false,0.3)
                                        }, this, 0),
                                    cc.scaleTo(1,1,1),
                                    //cc.delayTime(0.2),
                                    cc.callFunc(function(target, score) {
                                        target.position = cc.p(0,750/4)
                                        target.position = cc.p(0,1000)
                                        }, this, 0),
                                    );
        
        this.node.getChildByName("startTime").runAction(myAction)
        this.node.getChildByName("startTime").runAction(cc.repeat(cc.moveBy(1,cc.p(0,-50)),3))
    },

    //3,2,1动画
    lookNoticeAnim:function(){
        console.log("lookNoticeAnim!")
        
        if(this.mySeatIndex < 0){
            var myAction = cc.sequence( cc.callFunc(function(target, score) {
                target.position = cc.p(0,657)
                target.zIndex = 100001
                
                }, this, 0),
                cc.moveTo(1,cc.p(0,750/4)),
                cc.delayTime(2),
                cc.moveTo(1,cc.p(-1000,750/4)),
                );

            this.node.getChildByName("looknotice").runAction(myAction)
        }

        
    },


    //游戏开始
    gameStart:function(data){
        console.log("gamestart!")

        var jsdata = JSON.parse(data.JsonData)

        this.gameInfoData.State = 2
        this.playerInfoData[0].QiZiId = jsdata.SeatIndex0_qiziid
        this.playerInfoData[1].QiZiId = jsdata.SeatIndex1_qiziid
        this.startTimeAnim()
        this.showPlayerInfo()
    },

    getNodeBySeatIndex:function(seatindex){
        var nodeInfo = new Array("myInfo","playerInfo")
        //不是观察者的情况
        if( this.mySeatIndex >= 0){
            if( this.mySeatIndex ==  seatindex){
                return this.node.getChildByName(nodeInfo[0])
            }else{
                return this.node.getChildByName(nodeInfo[1])
            }
            
        }else{

            return this.node.getChildByName(nodeInfo[seatindex])
            
        }
    },

    //3,2,1动画
    changeGameTurnAnim:function(){

        if(this.gameInfoData.GameSeatIndex < 0 || this.gameInfoData.GameSeatIndex >= 2){
            return
        }
        var nodeInfo = new Array("myInfo","playerInfo")
        var mynode = this.getNodeBySeatIndex(this.gameInfoData.GameSeatIndex).getChildByName("qizi")
        var elsenode = this.getNodeBySeatIndex(Math.abs(this.gameInfoData.GameSeatIndex-1)).getChildByName("qizi")
        
        elsenode.setRotation(0)
        elsenode.stopAllActions()


        var myAction = cc.sequence( cc.callFunc(function(target, score) {
                target.setScale(4)
            }, this, 0),
            cc.scaleTo(0.5,1,1),
            cc.delayTime(0.8),
            );
        mynode.runAction(myAction)
        var seq = cc.repeatForever(
            cc.rotateBy(1,360));
        mynode.runAction(seq)

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
        this.changeGameTurnAnim()

    },

    //3,2,1动画
    // doGame5GAnim:function(){

    // },

    //玩家走棋
    doGame5G:function(data){
        var jsdata = JSON.parse(data.JsonData)
        console.log("doGame5G!")
        
        if(this.playerInfoData[jsdata.GameSeatIndex] != null){
            this.playerInfoData[jsdata.GameSeatIndex].Time = jsdata.Time
            
        }
        this.gameInfoData.QiPan[jsdata.Y][jsdata.X] = jsdata.GameSeatIndex
        this.gameInfoData.StepNum[jsdata.Y][jsdata.X] = jsdata.StepNum
        this.gameInfoData.GameSeatIndex = -1

        this.showQiPanInfo()
    },


    showGameOverUi:function(winSeatIndex,winscore,losescore,GameOverShare){
        cc.loader.loadRes("gameover", function (err, prefab) {
            var newNode = cc.instantiate(prefab);
            this.node.addChild(newNode);
            newNode.zIndex = 20000
            var quitbtnnormal = newNode.getChildByName("normal").getChildByName("quit")
            quitbtnnormal.on(cc.Node.EventType.TOUCH_END, function (event) {
                Tool.playSound("resources/sound/btn.mp3",false,0.5)
                console.log("TOUCH_END")
                //NetMananger.getInstance().SendMsg(Msg.CS_AddScore(5))
                cc.director.loadScene("Hall", null);
            });

            var quitbtnshare = newNode.getChildByName("share").getChildByName("quit")
            quitbtnshare.on(cc.Node.EventType.TOUCH_END, function (event) {
                Tool.playSound("resources/sound/btn.mp3",false,0.5)
                console.log("TOUCH_END")
                //NetMananger.getInstance().SendMsg(Msg.CS_AddScore(5))
                cc.director.loadScene("Hall", null);
            });

            var sharebtnshare = newNode.getChildByName("share").getChildByName("share")
            sharebtnshare.on(cc.Node.EventType.TOUCH_END, function (event) {
                Tool.playSound("resources/sound/btn.mp3",false,0.5)
                console.log("TOUCH_END")
                //NetMananger.getInstance().SendMsg(Msg.CS_AddScore(5))
                //cc.director.loadScene("Hall", null);
                var time = Tool.GetTimeMillon()
                var uid = GameDataManager.getInstance().GetHallInfoData().Uid
                Tool.ShareApp(uid,-1,time,function(){
                    console.log("task share over!")
                    NetMananger.getInstance().SendMsg(Msg.CS_Share())
                    NetMananger.getInstance().SendMsg(Msg.CS_AddScore(5))
                    cc.director.loadScene("Hall", null);
                })
            });

            var winname = this.playerInfoData[winSeatIndex].Name
            newNode.getChildByName("winname").getComponent(cc.Label).string = winname
            newNode.getChildByName("winscore").getComponent(cc.Label).string = "+"+winscore
            var loseSeatIndex = Math.abs(winSeatIndex-1)
            var losename = this.playerInfoData[loseSeatIndex].Name
            newNode.getChildByName("losename").getComponent(cc.Label).string = losename
            newNode.getChildByName("losescore").getComponent(cc.Label).string = "-"+losescore


            if(GameOverShare == 1){
                newNode.getChildByName("share").active = true
                newNode.getChildByName("normal").active = false
            }else{
                newNode.getChildByName("share").active = false
                newNode.getChildByName("normal").active = true
            }
            

        }.bind(this));
    },

    //游戏结束
    gameOver:function(data){
        var jsdata = JSON.parse(data.JsonData)
        console.log("gameOver! win:"+this.playerInfoData[jsdata.WinPlayerSeatIndex].Name )
        this.gameInfoData.State = 3
        console.log("--GameOverShare:",jsdata.GameOverShare)

        //不是下棋的人 不能参加分享得分
        if(GameDataManager.getInstance().GetHallInfoData().Uid != this.playerInfoData[0].Uid &&  GameDataManager.getInstance().GetHallInfoData().Uid != this.playerInfoData[1].Uid){
            jsdata.GameOverShare = 0
        }

        Tool.playSound("resources/sound/win.mp3",false,0.3)

        if(jsdata.Reason == 2){
            for(var i = 0; i < 5;i++){
                var y = jsdata.WinQiZi[i][0]
                var x = jsdata.WinQiZi[i][1]
                
                var onenode = this.allQiZi[y][x]
                if(onenode != null){
                    var action1 = cc.sequence(cc.delayTime(0.1*i),cc.repeat(cc.rotateBy(1,360),1000))
                    onenode.runAction(action1)
                    if (i == 4){
                        onenode.runAction(cc.sequence(cc.delayTime(1.5) ,cc.callFunc(function(){
                            this.showGameOverUi(jsdata.WinPlayerSeatIndex,jsdata.WinScore,jsdata.LoseScore,jsdata.GameOverShare)
                        },this,1)))
                    }
                }
            }
            
        }else{
            this.showGameOverUi(jsdata.WinPlayerSeatIndex,jsdata.WinScore,jsdata.LoseScore,0)
        }

        
        
    },

    //玩家离开
    playerGoOut:function(data){
        var jsdata = JSON.parse(data.JsonData)
        console.log("playerGoOut! uid:"+jsdata.Uid )
        
        if(jsdata.Uid == GameDataManager.getInstance().GetHallInfoData().Uid){
            cc.director.loadScene("Hall", null);
        }
        
    },

    //邀请玩家
    invateClick(event, customEventData){
        console.log("invateClick")
        var uid = GameDataManager.getInstance().GetHallInfoData().Uid
        var roomid = this.gameInfoData.GameId
        var time = this.gameInfoData.CreateGameTime
        Tool.ShareApp(uid,roomid,time,function(){
            //console.log("invateClick over!")
            //NetMananger.getInstance().SendMsg(Msg.CS_Share())
        })
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
        GameDataManager.getInstance().SetGameData("LookGamePlayerId",-1)
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

        MsgManager.getInstance().AddListener("SC_FriendsInfo",this.friendsInfo.bind(this))

        NetMananger.getInstance().SendMsg(Msg.CS_GoIn(GameDataManager.getInstance().GetGameData("GameId"),GameDataManager.getInstance().GetGameData("LookGamePlayerId")))

        //var action1 = cc.sequence( cc.delayTime(0.1*i),cc.repeat(cc.rotateBy(1,360),1000))

        var seq = cc.repeatForever(cc.sequence(cc.scaleTo(0.5,1.2,1.2),cc.scaleTo(0.5,1,1)));
        this.node.getChildByName("touchmoveqizi").runAction(seq)

        this.node.getChildByName("firstlayer").scale = 1
        this.node.getChildByName("firstlayer").active = false
    },
    //显示棋盘信息
    showQiPanInfo:function(){
        for(var y = 0; y < this.gameInfoData.QiPan.length;y++){
            for(var x = 0; x < this.gameInfoData.QiPan[y].length;x++){

                // if(this.gameInfoData.StepNum[y][x] > 0){
                //     if( this.allQiZiStep[y][x] == null){
                //         console.log("allQiZiStep----x:"+x+"---y:"+y+"---step:"+this.gameInfoData.StepNum[y][x])

                //         this.allQiZiStep[y][x] = new cc.Node();
                //         this.allQiZiStep[y][x].parent = this.node;
                //         this.allQiZiStep[y][x].zIndex = 3100
                //         this.allQiZiStep[y][x].position = cc.p(-336+x*gezhiwidth, -336+y*gezhiwidth)
                //         var label = this.allQiZiStep[y][x].addComponent(cc.Label);
                //         label.string=""+this.gameInfoData.StepNum[y][x]
                //         this.allQiZiStep[y][x].color = new cc.Color(220,220, 220)
                //         this.allQiZiStep[y][x].scale = 0
                        
                        
                //         var myAction = cc.sequence(
                //                                 cc.delayTime(0.8),
                //                                 cc.callFunc(function(target, score) {
                //                                     target.scale = 0.6
                //                                 }, this, 0),
                //                                 );

                //         this.allQiZiStep[y][x].runAction(myAction)
                //     }
                    
                // }else{
                //     if(this.allQiZiStep[y][x] != null){
                //         this.allQiZiStep[y][x].destory()
                //     }
                // }
                
                if(this.gameInfoData.QiPan[y][x] >= 0){
                    if(this.allQiZi[y][x] == null){

                        var mynode = this.getNodeBySeatIndex(this.gameInfoData.QiPan[y][x])
                        
                        var startpos = mynode.getChildByName("qizi").convertToWorldSpaceAR(cc.p(0,0))
                        startpos = this.node.convertToNodeSpaceAR(startpos)
                        //console.log("pos x:"+startpos.x+" pos y:"+startpos.y)
                        //console.log("11pos x:"+mynode.getChildByName("qizi").position.x+" pos y:"+mynode.getChildByName("qizi").position.y)
                        //创建棋子
                        
                        console.log("x:"+x+" y:"+y+" value:"+this.gameInfoData.QiPan[y][x])
                        //var path = cc.url.raw("resources/qizi/qizi_"+(this.gameInfoData.QiPan[y][x]+1)+".png")
                        var path = UiTool.getPathByQiZiId(this.playerInfoData[this.gameInfoData.QiPan[y][x]].QiZiId)
                        console.log(path)
                        this.allQiZi[y][x] = cc.instantiate(this.qizi);
                        this.allQiZi[y][x].zIndex = this.playerInfoData[this.gameInfoData.QiPan[y][x]].QiZiId+1000
                        this.allQiZi[y][x].parent = this.node;
                        //this.allQiZi[y][x].position = cc.p(-350+x*50, -350+y*50)
                        this.allQiZi[y][x].position = startpos
                        //new cc.SpriteFrame(texture);
                        //var contentsize = this.allQiZi[y][x].getComponent(cc.Sprite).spriteFrame.contentsize
                        this.allQiZi[y][x].getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(path);
                        //this.allQiZi[y][x].getComponent(cc.Sprite).spriteFrame.contentsize = contentsize
                        

                        var myAction = cc.sequence( 
                                                cc.callFunc(function(target, score) {
                                                    Tool.playSound("resources/sound/move.mp3",false,0.5)
                                                }, this, 0),
                                                cc.moveTo(0.5,cc.p(-336+x*gezhiwidth, -336+y*gezhiwidth)).easing(cc.easeIn(2.0)),
                                                cc.callFunc(function(target, score) {
                                                    // var animation = target.getChildByName("anim").getComponent(cc.Animation);
                                                    // animation.play("qizi_floor_a1")
                                                    Tool.playSound("resources/sound/qizi.mp3",false,0.5)
                                                    if(this.LastQiZiAction != null){
                                                        this.LastQiZiAction.scale = 1
                                                        this.LastQiZiAction.stopAllActions()
                                                    }

                                                    this.LastQiZiAction = target
                                                    //target.stopAllActions()
                                                    target.runAction( cc.repeatForever(cc.sequence(cc.scaleTo(0.5,1.2,1.2),cc.scaleTo(0.5,1,1))))

                                                }, this, 0),
                                                );

                        this.allQiZi[y][x].runAction(myAction)
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
        this.node.getChildByName("invite").active = false
        if(this.FriendNode != null){
            this.FriendNode.active = false
        }
        for(var i = 0; i < 2; i++){
            //座位号 有人
            if( playerInfo[i] >= 0){
                this.node.getChildByName(nodeInfo[i]).active = true

                var ranknum = this.playerInfoData[playerInfo[i]].RankNum
                this.node.getChildByName(nodeInfo[i]).getChildByName("name").getComponent(cc.Label).string = this.playerInfoData[playerInfo[i]].Name+Tool.RankNum2Str(ranknum)
                var seasonscore = this.playerInfoData[playerInfo[i]].SeasonScore
                
                var win = this.playerInfoData[playerInfo[i]].WinCount
                var lose = this.playerInfoData[playerInfo[i]].LoseCount
                var winpersent = 0
                if(win+lose > 0){
                    winpersent = Math.floor(win/(win+lose)*10000)/100
                    console.log("num:"+winpersent)
                }
                this.node.getChildByName(nodeInfo[i]).getChildByName("winpersent").getComponent(cc.Label).string = seasonscore

                var beiyongtimeitem = this.playerInfoData[playerInfo[i]].Beiyongtime
                var steptimeitem = this.playerInfoData[playerInfo[i]].Steptime
                if( beiyongtimeitem <= 0){
                    this.node.getChildByName(nodeInfo[i]).getChildByName("beiyongtimeicon").active = false
                }else{
                    var path1 = cc.url.raw(ResData[beiyongtimeitem].path)
                    this.node.getChildByName(nodeInfo[i]).getChildByName("beiyongtimeicon").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(path1);
                }

                if( steptimeitem <= 0){
                    this.node.getChildByName(nodeInfo[i]).getChildByName("steptimeicon").active = false
                }else{
                    var path1 = cc.url.raw(ResData[steptimeitem].path)
                    this.node.getChildByName(nodeInfo[i]).getChildByName("steptimeicon").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(path1);
                }
                

                //棋子类型
                //var path = cc.url.raw("resources/qizi/qizi_"+(playerInfo[i]+1)+".png")
                var path = UiTool.getPathByQiZiId(this.playerInfoData[playerInfo[i]].QiZiId)
                this.node.getChildByName(nodeInfo[i]).getChildByName("qizi").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(path);

                //头像
                var avatarurl = this.playerInfoData[playerInfo[i]].AvatarUrl
                console.log("url:"+avatarurl)
                if(avatarurl != null && avatarurl.length > 0){
                    var imgurl = UiTool.getHeadUrlPath(avatarurl)//avatarurl+"?aaa=aa.jpg";
                    var mynode = this.node.getChildByName(nodeInfo[i]).getChildByName("headicon")
                    console.log("mynode:"+mynode)
                    cc.loader.load(imgurl, function(err, texture){
                        console.log("err:"+err)
                        console.log("texture:"+texture)
                        this.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                    }.bind(mynode));
                }

            }else{
                this.node.getChildByName(nodeInfo[i]).active = false
                if(this.gameInfoData.GameMode == 1){//自己建游戏
                    //邀请朋友来玩ShareApp invite
                    this.node.getChildByName("invite").active = true
                    if(this.FriendNode != null){
                        this.FriendNode.active = true
                    }

                    NetMananger.getInstance().SendMsg(Msg.CS_GetFriendsInfo())

                    

                }
                
            }
        }


        
    },

    friendsInfo:function(data){
        var jsdata = JSON.parse(data.JsonData)
        console.log("friendsInfo! uid:" )
        this.newFriendsInfo(jsdata)
    },
    
    
    newFriendsInfo:function(data){

        var parentscene = this.node
        if(parentscene == null){
            console.log("parentscene == null")
        }

        cc.loader.loadRes("friendsinfo", function (err, prefab) {
            var newNode = cc.instantiate(prefab);
            this.FriendNode = newNode
            
            newNode.parent = parentscene

            var cancelbtn = newNode.getChildByName("close")
            cancelbtn.on(cc.Node.EventType.TOUCH_END, function (event) {
                console.log("TOUCH_END")
                Tool.playSound("resources/sound/btn.mp3",false,0.5)
                //newNode.destory()
                newNode.removeFromParent()

                NetMananger.getInstance().SendMsg(Msg.CS_GoOut())
                
            });

            var yaoqingbtn = newNode.getChildByName("addfriend")
            yaoqingbtn.on(cc.Node.EventType.TOUCH_END, function (event) {
                console.log("addfriend")
                Tool.playSound("resources/sound/btn.mp3",false,0.5)
                this.invateClick(null,null)

                
            }.bind(this));

            var scrollview = newNode.getChildByName("scrollview").getChildByName("view").getChildByName("content")

            //排序
            var karray = new Array()
            for (var k in data.Friends){
                if( data.Friends[k].State != 0){
                    karray[karray.length] = k
                }
            }
            for (var k in data.Friends){
                if( data.Friends[k].State == 0){
                    karray[karray.length] = k
                }
            }

            //玩家信息
            for (var k in karray){

                // this.scheduleOnce(function() {
                //     var k = this
                // }.bind(k),0.05*k)

                var gameid = this.gameInfoData.GameId
                this.scheduleOnce(function() {
                    var k = this
                    k = karray[k]

                    var p = data.Friends[k]

                    var oneGameInfo = cc.instantiate(newNode.getChildByName("oneFriend"));
                    oneGameInfo.parent = scrollview
                    oneGameInfo.getChildByName("name").getComponent(cc.Label).string = p.Name+Tool.RankNum2Str(p.RankNum)

                    oneGameInfo.getChildByName("namefriend").getComponent(cc.Label).string = p.Name
                    oneGameInfo.getChildByName("namemy").getComponent(cc.Label).string = GameDataManager.getInstance().GetHallInfoData().Name
                    oneGameInfo.getChildByName("winfriend").getComponent(cc.Label).string = p.FriendWin
                    oneGameInfo.getChildByName("winmy").getComponent(cc.Label).string = p.MyWin
                    
                    oneGameInfo.getChildByName("score").getComponent(cc.Label).string = p.Seasonscore
                    
                    if(p.Avatarurl != null && p.Avatarurl.length > 0){
                        var imgurl = UiTool.getHeadUrlPath(p.Avatarurl)//p.Avatar+"?aaa=aa.jpg";
                        cc.loader.load(imgurl, function(err, texture){
                            console.log("err:"+err)
                            var oneGameInfo = this
                            oneGameInfo.getChildByName("head").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                        }.bind(oneGameInfo));
                    }

                    var lookbtn = oneGameInfo.getChildByName("look")
                    lookbtn.active = false
                    lookbtn.on(cc.Node.EventType.TOUCH_END, function (event) {
                        Tool.playSound("resources/sound/btn.mp3",false,0.5)
                        var p = this
                        console.log("lookbtn:"+p.Uid)
                        NetMananger.getInstance().SendMsg(Msg.CS_GoOut())

                        NetMananger.getInstance().SendMsg(Msg.CS_GoIn(-1,p.Uid))
                        //GameDataManager.getInstance().SetGameData("GameId",p.GameId)
                        
                    }.bind(p));
                    var yaoqingbtn = oneGameInfo.getChildByName("yaoqing")
                    yaoqingbtn.active = false
                    oneGameInfo.getChildByName("yaoqing").lastyaoqingtime = 0
                    yaoqingbtn.on(cc.Node.EventType.TOUCH_END, function (event) {
                        Tool.playSound("resources/sound/btn.mp3",false,0.5)
                        var p = this
                        console.log("yaoqingbtn:"+p.Uid)
                        if(Tool.GetTimeMillon()-oneGameInfo.getChildByName("yaoqing").lastyaoqingtime > 5000){
                            NetMananger.getInstance().SendMsg(Msg.CS_YaoQingFriend(p.Uid,GameDataManager.getInstance().GetHallInfoData().Name,gameid))
                            oneGameInfo.getChildByName("yaoqing").lastyaoqingtime = Tool.GetTimeMillon()
                        }
                        
                        
                        
                    }.bind(p));
                    if(p.State == 0){
                        oneGameInfo.getChildByName("state").getComponent(cc.Label).string = "(离线)"
                    }else if(p.State == 1){
                        oneGameInfo.getChildByName("state").getComponent(cc.Label).string = "(大厅中)"
                        yaoqingbtn.active = true
                    }else if(p.State == 2){
                        oneGameInfo.getChildByName("state").getComponent(cc.Label).string = "(游戏中)"
                    }else if(p.State == 3){
                        oneGameInfo.getChildByName("state").getComponent(cc.Label).string = "(观战中)"
                    }
                    

                    
                    

                }.bind(k),0.05*k)


                
                

            }
            

        }.bind(this));

    
    },

    start () {
        
    },

    update (dt) {

        this.checkfirstshow()

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
                    }else{
                        this.node.getChildByName(nodeInfo[i]).getChildByName("EveryTime").getComponent(cc.Label).string = Tool.TimeMillonToHHMMSS(everytime)
                        this.node.getChildByName(nodeInfo[i]).getChildByName("Time").getComponent(cc.Label).string = Tool.TimeMillonToHHMMSS(time)
                    }
                }
            }

        }

        
    },
});
