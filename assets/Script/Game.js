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
cc.Class({
    extends: cc.Component,
    gameInfoData:null,
    playerInfoData:null,
    allQiZi:null,
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
            var tempPlayer = this.node.convertToNodeSpaceAR(event.getLocation())
            cc.log("点击局部坐标： ",tempPlayer.x,tempPlayer.y)


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
        this.showQiPanInfo()
    },

    onLoad () {

        

        //this.gameInfo(null)
        this.registerTouch()

        MsgManager.getInstance().AddListener("SC_GameInfo",this.gameInfo.bind(this))


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



        // this.allQiZi = new Array()
        // for(i = 0; i < 15;i++){
        //     this.allQiZi[i] = new Array()
        //     for(j = 0; j < 15;j++){
        //         this.allQiZi[i][j] = null
        //     }
        // }
    },

    //显示玩家信息
    showPlayerInfo:function(){
        if( this.mySeatIndex >= 0){
            this.node.getChildByName("myInfo").getChildByName("name").getComponent(cc.Label).string = this.playerInfoData[this.mySeatIndex].Name
        }
        if( this.playerSeatIndex >= 0){
            this.node.getChildByName("playerInfo").getChildByName("name").getComponent(cc.Label).string = this.playerInfoData[this.playerSeatIndex].Name
        }
        
    },

    start () {
        
    },

    update (dt) {

    },
});
