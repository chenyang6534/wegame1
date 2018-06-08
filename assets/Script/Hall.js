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
        //console.log("event=",event.type," data=",customEventData);
        Tool.playSound("resources/sound/btn.mp3",false,0.5)

        NetMananger.getInstance().SendMsg(Msg.CS_QuickGame())
    },
    lookGameClick(event, customEventData){
        console.log("lookGameClick")
        //console.log("event=",event.type," data=",customEventData);

        // var t1 = Tool.GetTimeMillon()
        // console.log("time:"+t1)

        // console.log(Tool.TimeMillonToHHMMSS(t1/1000))
        //NetMananger.getInstance().SendMsg(Msg.CS_Share())
        Tool.playSound("resources/sound/btn.mp3",false,0.5)

        NetMananger.getInstance().SendMsg(Msg.CS_GetGamingInfo())
        
    },
    roomGameClick(event, customEventData){
        console.log("roomGameClick")
        //console.log("event=",event.type," data=",customEventData);
        Tool.playSound("resources/sound/btn.mp3",false,0.5)

        //
        NetMananger.getInstance().SendMsg(Msg.CS_CreateRoom())
        // Tool.ShareApp(GameDataManager.getInstance().GetHallInfoData().Uid,100,function(){
        //     console.log("Tool.ShareApp")
        // })
        
    },

    taskClick(event, customEventData){
        console.log("taskClick")
        
        Tool.playSound("resources/sound/btn.mp3",false,0.5)
        

        NetMananger.getInstance().SendMsg(Msg.CS_GetTskInfo())

        this.node.getChildByName("btnlayer").getChildByName("task_btn").getChildByName("tishi").active = false
        
        
    },
    mailClick(event, customEventData){
        console.log("mailClick")
        
        Tool.playSound("resources/sound/btn.mp3",false,0.5)
        

        NetMananger.getInstance().SendMsg(Msg.CS_GetMailInfo())
        this.node.getChildByName("btnlayer").getChildByName("mail_btn").getChildByName("tishi").active = false
    },
    bagClick(event, customEventData){
        console.log("bagClick")
        
        Tool.playSound("resources/sound/btn.mp3",false,0.5)
        

        NetMananger.getInstance().SendMsg(Msg.CS_GetBagInfo())
    },
    storeClick(event, customEventData){
        console.log("storeClick")
        Tool.playSound("resources/sound/btn.mp3",false,0.5)
        

        NetMananger.getInstance().SendMsg(Msg.CS_GetStoreInfo())
    },
    rankClick(event, customEventData){
        console.log("rankClick")
        Tool.playSound("resources/sound/btn.mp3",false,0.5)
        
        

        NetMananger.getInstance().SendMsg(Msg.CS_GetRankInfo((this.RankPage-1)*10,this.RankPage*10))
    },
    friendsClick(event, customEventData){
        console.log("friendsClick")
        Tool.playSound("resources/sound/btn.mp3",false,0.5)
        
        NetMananger.getInstance().SendMsg(Msg.CS_GetFriendsInfo())

    },
    
    FreshRankInfo:function(newNode,jsdata,onlyfreshrankdata){

        if(onlyfreshrankdata == false){
            var cancelbtn = newNode.getChildByName("close")
            cancelbtn.on(cc.Node.EventType.TOUCH_END, function (event) {
                
                console.log("TOUCH_END")
                //newNode.destory()
                Tool.playSound("resources/sound/btn.mp3",false,0.5)
                this.rankInfoNode = null
                newNode.removeFromParent()
                
            }.bind(this));


            //标题
            newNode.getChildByName("title").getComponent(cc.Label).string = "S"+jsdata.SeasonInfo.IdIndex+"赛季"

            //时间
            newNode.getChildByName("time").getComponent(cc.Label).string = jsdata.SeasonInfo.StartTime+"--"+jsdata.SeasonInfo.EndTime
            
            
            //奖励

            var scrollviewrw = newNode.getChildByName("scrollviewrw").getChildByName("view").getChildByName("content")
        
            scrollviewrw.removeAllChildren()
            //任务信息
            for (var i in jsdata.SeasonInfo.RewardList){

                this.scheduleOnce(function() {
                    var i = this

                    var p = jsdata.SeasonInfo.RewardList[i]

                    var oneGameInfo = cc.instantiate(newNode.getChildByName("oneReward"));
                    oneGameInfo.parent = scrollviewrw

                    //名次
                    oneGameInfo.getChildByName("name").getComponent(cc.Label).string = p.RankStart+"--"+p.RankEnd
                    //金币
                    oneGameInfo.getChildByName("rank").getComponent(cc.Label).string = p.Gold
                   

                }.bind(i),0.05*i)

                
            }



            // for( var i = 0; i < 5; i++){
            //     var rewardnode = newNode.getChildByName("oneReward"+i)
            //     if( jsdata.SeasonInfo.RewardList.length > i){
            //         rewardnode.active = true
                    
            //     }else{
            //         rewardnode.active = false
            //     }
                
            // }
            //上一页
            var lastbtn = newNode.getChildByName("last")
            lastbtn.on(cc.Node.EventType.TOUCH_END, function (event) {
                console.log("lastbtn")
                Tool.playSound("resources/sound/btn.mp3",false,0.5)
                this.RankPage = this.RankPage - 1
                this.rankClick()

                var lastbtn = newNode.getChildByName("last")
                var nextbtn = newNode.getChildByName("next")
                lastbtn.active = false
                nextbtn.active = false
                
            }.bind(this));
            //下一页
            var nextbtn = newNode.getChildByName("next")
            nextbtn.on(cc.Node.EventType.TOUCH_END, function (event) {
                console.log("nextbtn")
                Tool.playSound("resources/sound/btn.mp3",false,0.5)
                this.RankPage = this.RankPage + 1
                this.rankClick()

                var lastbtn = newNode.getChildByName("last")
                var nextbtn = newNode.getChildByName("next")
                lastbtn.active = false
                nextbtn.active = false
            }.bind(this));
        }

        //我的排名
        var myranknum = "1000+"
        if( jsdata.MyRank > 0 && jsdata.MyRank <= 1000){
            myranknum = jsdata.MyRank
        }
        newNode.getChildByName("myrank").getComponent(cc.Label).string = myranknum
            


        //

        //this.freshTaskEd()

        var scrollview = newNode.getChildByName("scrollview").getChildByName("view").getChildByName("content")
        
        scrollview.removeAllChildren()
        //任务信息
        for (var k in jsdata.Ranks){

            this.scheduleOnce(function() {
                var k = this

                var p = jsdata.Ranks[k]

                var oneGameInfo = cc.instantiate(newNode.getChildByName("oneTaskInfo"));
                oneGameInfo.parent = scrollview
                oneGameInfo.getChildByName("name").getComponent(cc.Label).string = p.Name
                oneGameInfo.getChildByName("score").getComponent(cc.Label).string = p.Score
                oneGameInfo.getChildByName("rank").getComponent(cc.Label).string = p.RankNum
            
                //头像
                var avatarurl = p.Avatar
                if(avatarurl != null && avatarurl.length > 0){
                    var imgurl = avatarurl+"?aaa=aa.jpg";
                    
                    cc.loader.load(imgurl, function(err, texture){
                        var one = this
                        console.log("texture:"+texture)
                        one.getChildByName("head").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                    }.bind(oneGameInfo));
                }

            }.bind(k),0.05*k)

            
            
        }


        this.scheduleOnce(function() {
            var lastbtn = newNode.getChildByName("last")
            var nextbtn = newNode.getChildByName("next")
            lastbtn.active = true
            nextbtn.active = true
        }.bind(this),2)

    },

    RankInfo:function(data){
        var jsdata = JSON.parse(data.JsonData)
        console.log("RankInfo! " )
        //this.newBagInfo(jsdata)
        for(var k in jsdata.Ranks){
            var v = jsdata.Ranks[k]
            console.log("rank:"+v.RankNum+"---name:"+v.Name+"--score:"+v.Score)
        }



        var parentscene = this.node
        if(parentscene == null){
            console.log("parentscene == null")
        }

        if( this.rankInfoNode != null){
            this.FreshRankInfo(this.rankInfoNode,jsdata,true)
        }else{

            console.log("rankInfoNode == null")

            cc.loader.loadRes("rankinfo", function (err, prefab) {
                var newNode = cc.instantiate(prefab);
                this.rankInfoNode = newNode
                newNode.parent = parentscene
                
    
                this.FreshRankInfo(this.rankInfoNode,jsdata,false)
                
                
    
            }.bind(this));
        }
        

        
        
    },

    SerchingPlayer:function(data){
        console.log("SerchingPlayer")
        cc.loader.loadRes("serchplayer", function (err, prefab) {
            var newNode = cc.instantiate(prefab);
            this.node.addChild(newNode);
            var quitbtn = newNode.getChildByName("quit")
            quitbtn.on(cc.Node.EventType.TOUCH_END, function (event) {
                console.log("TOUCH_END")
                Tool.playSound("resources/sound/btn.mp3",false,0.5)
                NetMananger.getInstance().SendMsg(Msg.CS_QuickGameExit())
                newNode.destroy()
            });


            //动画
            var myAction = cc.sequence( cc.callFunc(function(target, score) {
                
                                        target.getComponent(cc.Label).string = "搜寻对手中."
                                        }, this, 0),
                                        cc.delayTime(1),
                                        cc.callFunc(function(target, score) {
                                        
                                            target.getComponent(cc.Label).string = "搜寻对手中.."
                                            }, this, 0),
                                        
                                        cc.delayTime(1),
                                        cc.callFunc(function(target, score) {
                                            
                                            target.getComponent(cc.Label).string = "搜寻对手中..."
                                            }, this, 0),
                                        cc.delayTime(1)
                                        );
            newNode.getChildByName("searchtxt").runAction(cc.repeatForever(myAction))



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
                Tool.playSound("resources/sound/btn.mp3",false,0.5)
                //newNode.destory()
                newNode.removeFromParent()
                
            });

            var scrollview = newNode.getChildByName("scrollview").getChildByName("view").getChildByName("content")
            //玩家信息
            for (var k in data.GameInfo){

                // this.scheduleOnce(function() {
                //     var k = this
                // }.bind(k),0.05*k)
                this.scheduleOnce(function() {
                    var k = this

                    var p = data.GameInfo[k]

                    var oneGameInfo = cc.instantiate(newNode.getChildByName("oneGameInfo"));
                    oneGameInfo.parent = scrollview
                    oneGameInfo.getChildByName("name1").getComponent(cc.Label).string = p.PlayerOneName
                    //oneGameInfo.getChildByName("head1").getComponent(cc.Label).string = p.AvatarOne
                    oneGameInfo.getChildByName("name2").getComponent(cc.Label).string = p.PlayerTwoName
                    //oneGameInfo.getChildByName("head2").getComponent(cc.Label).string = p.AvatarTwo
                    oneGameInfo.getChildByName("score1").getComponent(cc.Label).string = p.ScoreOne
                    oneGameInfo.getChildByName("score2").getComponent(cc.Label).string = p.ScoreTwo


                    
                    if(p.AvatarOne != null && p.AvatarOne.length > 0){
                        var imgurl = p.AvatarOne+"?aaa=aa.jpg";
                        cc.loader.load(imgurl, function(err, texture){
                            console.log("err:"+err)
                            var oneGameInfo = this
                            oneGameInfo.getChildByName("head1").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                        }.bind(oneGameInfo));
                    }
                    if(p.AvatarTwo != null && p.AvatarTwo.length > 0){
                        var imgurl = p.AvatarTwo+"?aaa=aa.jpg";
                        cc.loader.load(imgurl, function(err, texture){
                            console.log("err:"+err)
                            var oneGameInfo = this
                            oneGameInfo.getChildByName("head2").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                        }.bind(oneGameInfo));
                    }


                    var lookbtn = oneGameInfo.getChildByName("look")
                    lookbtn.on(cc.Node.EventType.TOUCH_END, function (event) {
                        Tool.playSound("resources/sound/btn.mp3",false,0.5)
                        var p = this
                        console.log("lookbtn:"+p.GameId)
                        //newNode.destory()
                        //newNode.removeFromParent()
                        GameDataManager.getInstance().SetGameData("GameId",p.GameId)
                        
                    }.bind(p));

                }.bind(k),0.05*k)


                
                

            }
            

        }.bind(this));

    
    },
    
    // LIFE-CYCLE CALLBACKS:

    Disconnect:function(){
        console.log("Disconnect")
        cc.director.loadScene("Login", null);
    },
    

    
    CheckGoToGame:function(data){
        var jsdata = JSON.parse(data.JsonData)
        console.log("CheckGoToGame! err:"+jsdata.Err )
        //this.newGameInfo(jsdata)
        if(jsdata.Code == 1){
            GameDataManager.getInstance().SetGameData("GameId",jsdata.GameId)
            
        }
    },

    showPlayerInfo:function(){
        if( GameDataManager.getInstance().GetHallInfoData() != null){

            if ( this.IsShowPlayerInfo != true){
                var avatarurl = GameDataManager.getInstance().GetHallInfoData().AvatarUrl
                //var avatarurl = "https://wx.qlogo.cn/mmopen/vi_32/wsRmxcKeyV3TKk7mHEVKLl1rFLjK2aKk08vggdAIaGwzrQAexH88lnicbH9w17rG5AY3ptACgbjicqF8HJEj2gUg/0"
                
                if(avatarurl != null && avatarurl.length > 0){
                    var imgurl = avatarurl+"?aaa=aa.jpg";
                    
                    cc.loader.load(imgurl, function(err, texture){
                        console.log("err:"+err)
                        console.log("texture:"+texture)
                        this.node.getChildByName("userInfo").getChildByName("headicon").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                    }.bind(this));
                }
                this.IsShowPlayerInfo = true
            }

            this.node.getChildByName("userInfo").getChildByName("name").getComponent(cc.Label).string = GameDataManager.getInstance().GetHallInfoData().Name
            this.node.getChildByName("userInfo").getChildByName("goldnum").getComponent(cc.Label).string = GameDataManager.getInstance().GetHallInfoData().Gold
            this.node.getChildByName("userInfo").getChildByName("win").getComponent(cc.Label).string = GameDataManager.getInstance().GetHallInfoData().SeasonScore
            var allcount = GameDataManager.getInstance().GetHallInfoData().WinCount+GameDataManager.getInstance().GetHallInfoData().LoseCount
            this.node.getChildByName("userInfo").getChildByName("all").getComponent(cc.Label).string = allcount
            
        }
    },

    //好友邀请
    YaoQingFriend:function(data){
        var jsdata = JSON.parse(data.JsonData)
        console.log("YaoQingFriend! name:"+jsdata.Name )

        UiTool.newKuang2btn("对战邀请",jsdata.Name+"邀请你和他进行一局对战,你愿意接受吗?",function(){
            GameDataManager.getInstance().SetGameData("GameId",jsdata.GameId)
        }.bind(this))

        
        
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
                
            });
            var yaoqingbtn = newNode.getChildByName("addfriend")
            yaoqingbtn.on(cc.Node.EventType.TOUCH_END, function (event) {
                console.log("addfriend")
                Tool.playSound("resources/sound/btn.mp3",false,0.5)
                var uid = GameDataManager.getInstance().GetHallInfoData().Uid
                var roomid = 0
                var time = 0
                Tool.ShareApp(uid,roomid,time,function(){
                    //console.log("invateClick over!")
                    //NetMananger.getInstance().SendMsg(Msg.CS_Share())
                })
                

                
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

                //var gameid = this.gameInfoData.GameId
                this.scheduleOnce(function() {
                    var k = this
                    k = karray[k]

                    var p = data.Friends[k]

                    var oneGameInfo = cc.instantiate(newNode.getChildByName("oneFriend"));
                    oneGameInfo.parent = scrollview
                    oneGameInfo.getChildByName("name").getComponent(cc.Label).string = p.Name

                    oneGameInfo.getChildByName("namefriend").getComponent(cc.Label).string = p.Name
                    oneGameInfo.getChildByName("namemy").getComponent(cc.Label).string = GameDataManager.getInstance().GetHallInfoData().Name
                    oneGameInfo.getChildByName("winfriend").getComponent(cc.Label).string = p.FriendWin
                    oneGameInfo.getChildByName("winmy").getComponent(cc.Label).string = p.MyWin
                    
                    oneGameInfo.getChildByName("score").getComponent(cc.Label).string = p.Seasonscore
                    
                    if(p.Avatar != null && p.Avatar.length > 0){
                        var imgurl = p.Avatar+"?aaa=aa.jpg";
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
                        
                        GameDataManager.getInstance().SetGameData("LookGamePlayerId",p.Uid)
                        
                    }.bind(p));
                    var yaoqingbtn = oneGameInfo.getChildByName("yaoqing")
                    yaoqingbtn.active = false
                    
                    if(p.State == 0){
                        oneGameInfo.getChildByName("state").getComponent(cc.Label).string = "(离线)"
                    }else if(p.State == 1){
                        oneGameInfo.getChildByName("state").getComponent(cc.Label).string = "(大厅中)"
                        
                    }else if(p.State == 2){
                        oneGameInfo.getChildByName("state").getComponent(cc.Label).string = "(游戏中)"
                        lookbtn.active = true
                    }else if(p.State == 3){
                        oneGameInfo.getChildByName("state").getComponent(cc.Label).string = "(观战中)"
                        lookbtn.active = true
                    }
                    

                    
                    

                }.bind(k),0.05*k)


                
                

            }
            

        }.bind(this));

    
    },

    HallUIInfo:function(data){
        var jsdata = JSON.parse(data.JsonData)
        console.log("HallUIInfo! TaskED_ShowNum:"+jsdata.TaskED_ShowNum+"    Mail_ShowNum:"+jsdata.Mail_ShowNum )

        if(jsdata.TaskED_ShowNum > 0){
            this.node.getChildByName("btnlayer").getChildByName("task_btn").getChildByName("tishi").active = true
        }else{
            this.node.getChildByName("btnlayer").getChildByName("task_btn").getChildByName("tishi").active = false
        }
        if(jsdata.Mail_ShowNum > 0){
            this.node.getChildByName("btnlayer").getChildByName("mail_btn").getChildByName("tishi").active = true
        }else{
            this.node.getChildByName("btnlayer").getChildByName("mail_btn").getChildByName("tishi").active = false
        }
        //
        
    },
    GetTaskRewards:function(data){
        var jsdata = JSON.parse(data.JsonData)
        console.log("GetTaskRewards! code:"+jsdata.Code+"    id:"+jsdata.Id )
        if( jsdata.Code != 1){
            return
        }
        if(this.taskEd != null){
            for (var k in this.taskData.Task){
                var p = this.taskData.Task[k]
                if( p.Id == jsdata.Id){
                    p.State = 2
                }
            }

            //
            this.freshTaskEd()
        }
        
    },


    
    TskEdInfo:function(data){
        var jsdata = JSON.parse(data.JsonData)
        console.log("TskEdInfo! " )
        this.newTaskInfo(jsdata)
        
    },
    MailInfo:function(data){
        var jsdata = JSON.parse(data.JsonData)
        console.log("MailInfo! " )
        this.newMailInfo(jsdata)
        
    },
    StoreInfo:function(data){
        var jsdata = JSON.parse(data.JsonData)
        console.log("StoreInfo! " )
        this.newStoreInfo(jsdata)
        
    },
    BagInfo:function(data){
        var jsdata = JSON.parse(data.JsonData)
        console.log("BagInfo! " )
        this.newBagInfo(jsdata)
        
    },
    

    

    

    freshTaskEd:function(){
        var newNode = this.taskEd
        var data = this.taskData

        var scrollview = newNode.getChildByName("scrollview").getChildByName("view").getChildByName("content")
        scrollview.removeAllChildren()

        //任务列表排序
        var temptask = new Array()
        for (var k in data.Task){
            var p = data.Task[k]
            if(p.State == 1){
                temptask[temptask.length] = p
                console.log("----state = 1 id:"+p.Id)
            }

        }
        for (var k in data.Task){
            var p = data.Task[k]
            if(p.State == 0){
                temptask[temptask.length] = p
                console.log("----state = 0 id:"+p.Id)
            }

        }
        for (var k in data.Task){
            var p = data.Task[k]
            if(p.State == 2){
                temptask[temptask.length] = p
                console.log("----state = 2 id:"+p.Id)
            }

        }
        //type 3:分享到群  2:赢得快速游戏模式 4:赢得好友模式



        //任务信息
        for (var k in temptask){
            var p = temptask[k]
            console.log("----task =  id:"+p.Id)

            var oneGameInfo = cc.instantiate(newNode.getChildByName("oneTaskInfo"));
            oneGameInfo.parent = scrollview
            oneGameInfo.getChildByName("discripte").getComponent(cc.Label).string = ResData[p.Id].discripte
            
            oneGameInfo.getChildByName("progress").getComponent(cc.Label).string = p.ProgressValue+"/"+p.DestValue

            //任务奖励
            for ( var j in p.Rewards){
                var reward = p.Rewards[j]
                var word = ""
                if (reward.Count > 0){
                    word = reward.Count
                }else{
                    word = reward.Time +"天"
                }
                UiTool.newIcon(reward.Type,word,oneGameInfo,cc.p(-330+j*100,-30))
            }
            if(p.State == 2){
                oneGameInfo.getChildByName("complete").active = true
                
            }else{
                oneGameInfo.getChildByName("complete").active = false
            }
            //
            var goto = oneGameInfo.getChildByName("goto")
            if(p.State == 0){
                goto.active = true
            }else{
                goto.active = false
            }

            var rootnode = this
            goto.on(cc.Node.EventType.TOUCH_END, function (event) {
                Tool.playSound("resources/sound/btn.mp3",false,0.5)
                var p = this
                console.log("get:"+p.GameId)//CS_GetTaskRewards
                if(p.Type == 3){
                    newNode.destroy()
                    var time = Tool.GetTimeMillon()
                    var uid = GameDataManager.getInstance().GetHallInfoData().Uid
                    Tool.ShareApp(uid,-1,time,function(){
                        console.log("task share over!")
                        NetMananger.getInstance().SendMsg(Msg.CS_Share())
                    })
                }else if(p.Type == 2){
                    newNode.destroy()
                    rootnode.quickGameClick()
                }else if(p.Type == 4){
                    newNode.destroy()
                    rootnode.roomGameClick()
                }
                
            }.bind(p));
            
            var get = oneGameInfo.getChildByName("get")
            if( p.State == 1){
                get.active = true
            }else{
                get.active = false
            }
            get.on(cc.Node.EventType.TOUCH_END, function (event) {
                Tool.playSound("resources/sound/btn.mp3",false,0.5)
                var p = this
                console.log("get:"+p.GameId)//CS_GetTaskRewards
                NetMananger.getInstance().SendMsg(Msg.CS_GetTaskRewards(p.Id))
                
            }.bind(p));
            

        }
    },

    newTaskInfo:function(data){
        this.taskData = data

        var parentscene = this.node
        if(parentscene == null){
            console.log("parentscene == null")
        }

        cc.loader.loadRes("taskinfo", function (err, prefab) {
            var newNode = cc.instantiate(prefab);
            this.taskEd = newNode
            console.log("111")
            newNode.parent = parentscene
            console.log("222")
            //parentscene.addChild(newNode);

            var cancelbtn = newNode.getChildByName("close")
            cancelbtn.on(cc.Node.EventType.TOUCH_END, function (event) {
                Tool.playSound("resources/sound/btn.mp3",false,0.5)
                console.log("TOUCH_END")
                //newNode.destory()
                this.taskEd = null
                newNode.destroy()
                
            });

            this.freshTaskEd()
            
            

        }.bind(this));

    
    },

    newMailInfo:function(data){
        this.mailData = data

        var parentscene = this.node
        if(parentscene == null){
            console.log("parentscene == null")
        }

        cc.loader.loadRes("mailinfo", function (err, prefab) {
            var newNode = cc.instantiate(prefab);
            this.mailInfo = newNode
            console.log("---111")
            newNode.parent = parentscene
            console.log("---222")
            //parentscene.addChild(newNode);

            var cancelbtn = newNode.getChildByName("close")
            cancelbtn.on(cc.Node.EventType.TOUCH_END, function (event) {
                Tool.playSound("resources/sound/btn.mp3",false,0.5)
                console.log("TOUCH_END")
                //newNode.destory()
                this.mailInfo = null
                newNode.removeFromParent()
                
            });

            //this.freshTaskEd()

            var scrollview = newNode.getChildByName("scrollview").getChildByName("view").getChildByName("content")
            var wordlayer = newNode.getChildByName("oneMail")
            wordlayer.active = false
            scrollview.removeAllChildren()
            //get
            var wordlayergetbtn = wordlayer.getChildByName("get")
            wordlayergetbtn.on(cc.Node.EventType.TOUCH_END, function (event) {
                Tool.playSound("resources/sound/btn.mp3",false,0.5)
                var p = wordlayer.p
                console.log("---------------------get--rewards")
                NetMananger.getInstance().SendMsg(Msg.CS_GetMailRewards(p.Id))
                p.GetState = 1
                wordlayergetbtn.active = false
                //wordlayergetbtn.runAction()
                // wordlayergetbtn.getComponent(cc.Button).scheduleOnce(function(){
                //     wordlayergetbtn.active = false
                // },0.2)

                if(p.GetState == 0 && p.Reward.length > 0){
                    p.onegameinfo.color = cc.color(187,252,234)
                }else{
                    p.onegameinfo.color = cc.color(182,168,238)
                }
                //
            })

            //

            //任务信息
            for (var k in data.Mails){

                this.scheduleOnce(function() {
                    var k = this

                    var p = data.Mails[k]

                    var oneGameInfo = cc.instantiate(newNode.getChildByName("oneTaskInfo"));
                    oneGameInfo.parent = scrollview
                    oneGameInfo.getChildByName("discripte").getComponent(cc.Label).string = p.Title

                    p.onegameinfo = oneGameInfo
                    
                    if(p.GetState == 0 && p.Reward.length > 0){
                        oneGameInfo.color = cc.color(187,252,234)
                    }else{
                        oneGameInfo.color = cc.color(182,168,238)
                    }
                    
                    
                
                    var get = oneGameInfo.getChildByName("get")
                    get.on(cc.Node.EventType.TOUCH_END, function (event) {
                        Tool.playSound("resources/sound/btn.mp3",false,0.5)
                        var p = this
                        console.log("get:"+p.Id)//CS_GetTaskRewards
                        //NetMananger.getInstance().SendMsg(Msg.CS_GetTaskRewards(p.Id))
                        wordlayer.active = true
                        wordlayer.getChildByName("title").getComponent(cc.Label).string = p.Title
                        //console.log("---11"+p.Content)
                        p.Content = Tool.wordhuanhang(p.Content)
                        wordlayer.getChildByName("content").getComponent(cc.Label).string = p.Content
                        //console.log("---22"+p.Content)
                        wordlayer.getChildByName("sendname").getComponent(cc.Label).string = p.SendName
                        wordlayer.getChildByName("time").getComponent(cc.Label).string = p.Date
                        
                        var rewardslayer = wordlayer.getChildByName("rewardslayer")
                        rewardslayer.removeAllChildren()
                        //Reward    []conf.RewardsConfig
                        //任务奖励
                        var haveReward = false
                        for ( var j in p.Reward){
                            var reward = p.Reward[j]
                            var word = ""
                            if (reward.Count > 0){
                                word = reward.Count
                            }else{
                                word = reward.Time +"天"
                            }
                            //rewardslayer
                            UiTool.newIcon(reward.Type,word,rewardslayer,cc.p(-120+j*80,-0))
                            haveReward = true
                        }
                        //get
                        var getbtn = wordlayer.getChildByName("get")
                        if (haveReward == true && p.GetState == 0){
                            getbtn.active = true

                            wordlayer.p = p
                            

                            //getbtn.off(cc.Node.EventType.TOUCH_END, this._sayHello, this);
                            
                        }else{
                            getbtn.active = false
                        }
                        
                        
                    }.bind(p));

                }.bind(k),0.05*k)


                
                

            }
            
            

        }.bind(this));

    
    },


    newStoreInfo:function(data){
        //this.mailData = data

        var parentscene = this.node
        if(parentscene == null){
            console.log("parentscene == null")
        }

        cc.loader.loadRes("storeinfo", function (err, prefab) {
            var newNode = cc.instantiate(prefab);
            //this.mailInfo = newNode
            newNode.parent = parentscene

            var cancelbtn = newNode.getChildByName("close")
            cancelbtn.on(cc.Node.EventType.TOUCH_END, function (event) {
                Tool.playSound("resources/sound/btn.mp3",false,0.5)
                console.log("TOUCH_END")
                //newNode.destory()
                this.mailInfo = null
                newNode.removeFromParent()
                
            });

            //this.freshTaskEd()

            var scrollview = newNode.getChildByName("scrollview").getChildByName("view").getChildByName("content")
            
            scrollview.removeAllChildren()
            //商品信息
            for (var k in data.Commoditys){

                this.scheduleOnce(function() {
                    var k = this
                    var p = data.Commoditys[k]
                    var oneGameInfo = cc.instantiate(newNode.getChildByName("oneTaskInfo"));
                    oneGameInfo.parent = scrollview
                    oneGameInfo.getChildByName("name").getComponent(cc.Label).string = ResData[p.Type].name
                    oneGameInfo.getChildByName("discripte").getComponent(cc.Label).string = ResData[p.Type].discripte
                    console.log(ResData[p.Type].path)
                    oneGameInfo.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.url.raw(ResData[p.Type].path));
                    //oneGameInfo.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.url.raw("resources/qizi/qizi_3.png"))

                    oneGameInfo.getChildByName("usetime").getComponent(cc.Label).string = p.Time
                    oneGameInfo.getChildByName("price").getComponent(cc.Label).string = p.SalePrice

                    oneGameInfo.getChildByName("time").getComponent(cc.Label).string = p.StartTime+"----"+p.EndTime
                    var buybtn = oneGameInfo.getChildByName("buy")
                    buybtn.active = false
                    if( p.IsStartSale == true){
                        buybtn.active = true
                        buybtn.on(cc.Node.EventType.TOUCH_END, function (event) {
                            Tool.playSound("resources/sound/btn.mp3",false,0.5)
                            
                            var k = this
                            var p = data.Commoditys[k]
                            if(GameDataManager.getInstance().GetHallInfoData().Gold >= p.SalePrice){
                                UiTool.newKuang2btn("提示","你确定要以"+p.SalePrice+"宝石购买"+ResData[p.Type].name+"("+p.Time+"天)吗?",function(){
                                    var k = this
                                    var p = data.Commoditys[k]
                                    NetMananger.getInstance().SendMsg(Msg.CS_BuyItem(p.Id,k))
                                }.bind(k))
                            }else{
                                UiTool.newKuang2btn("提示","宝石不足！")
                            }

                            //NetMananger.getInstance().SendMsg(Msg.CS_BuyItem(p.Id,k))
                            
                            //
                        }.bind(k))
                    }

                }.bind(k), 0.05*k);

                
                
                

            }
            
            

        }.bind(this));

    
    },


    freshBagInfo:function(){

    },

    newBagInfo:function(data){
        //this.mailData = data

        var parentscene = this.node
        if(parentscene == null){
            console.log("parentscene == null")
        }

        cc.loader.loadRes("baginfo", function (err, prefab) {
            var newNode = cc.instantiate(prefab);
            //this.mailInfo = newNode
            newNode.parent = parentscene

            var cancelbtn = newNode.getChildByName("close")
            cancelbtn.on(cc.Node.EventType.TOUCH_END, function (event) {
                Tool.playSound("resources/sound/btn.mp3",false,0.5)
                console.log("TOUCH_END")
                //newNode.destory()
                this.mailInfo = null
                newNode.removeFromParent()
                
            });

            //this.freshTaskEd()

            var scrollview = newNode.getChildByName("scrollview").getChildByName("view").getChildByName("content")
            
            scrollview.removeAllChildren()

            

            var zhuangbeimap = new Map()
            zhuangbeimap[data.Firstqizi] = 1
            //zhuangbeimap[data.Secondqizi] = 1
            zhuangbeimap[data.Qizi_move] = 1
            zhuangbeimap[data.Qizi_move_trail] = 1
            zhuangbeimap[data.Qizi_floor] = 1
            zhuangbeimap[data.Qizi_lastplay] = 1
            zhuangbeimap[data.Beiyongtime] = 1
            zhuangbeimap[data.Steptime] = 1

            var zhuangbeiInfo = new Map()


            //商品信息
            for (var k in data.Items){
                var p = data.Items[k]
                if(p.IsExpiry == true){
                    continue
                }

                var oneGameInfo = cc.instantiate(newNode.getChildByName("oneTaskInfo"));
                //if(zhuangbeimap[p.Type] == 1){
                zhuangbeiInfo[p.Type] = oneGameInfo
                //}

                oneGameInfo.parent = scrollview
                oneGameInfo.getChildByName("name").getComponent(cc.Label).string = ResData[p.Type].name
                
                
                oneGameInfo.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.url.raw(ResData[p.Type].path));
                
                oneGameInfo.getChildByName("time").getComponent(cc.Label).string = p.ExpiryTime
                var buybtn = oneGameInfo.getChildByName("zhuangbei")
                buybtn.active = false
                console.log("---------:"+zhuangbeimap[p.Type]+"-----"+p.Type)
                if( zhuangbeimap[p.Type] != 1 ){
                    buybtn.active = true
                }
                buybtn.on(cc.Node.EventType.TOUCH_END, function (event) {
                    Tool.playSound("resources/sound/btn.mp3",false,0.5)
                        
                    var k = this
                    var p = data.Items[k]
                    NetMananger.getInstance().SendMsg(Msg.CS_ZhuangBeiItem(p.Type))

                    //
                    for (var j in zhuangbeimap){
                        if(j == 0 || zhuangbeimap[j] != 1){
                            continue
                        }
                        if ( Math.floor(j%1000/100) == Math.floor(p.Type%1000/100) ){
                            zhuangbeimap[j] = 0
                            zhuangbeiInfo[j].getChildByName("zhuangbei").active = true
                            break
                        }
                    }
                    zhuangbeimap[p.Type] = 1

                    var myAction = cc.sequence( cc.delayTime(0.01),
                                                cc.callFunc(function(target, score) {
                                                    target.getChildByName("zhuangbei").active = false
                                                }, null, 0),
                                                
                                                );
                    zhuangbeiInfo[p.Type].runAction(myAction)
                    
                    //
                }.bind(k))
                
                

            }
            
            

        }.bind(this));

    
    },


    


    

    
    onLoad () {
        console.log("onload hall")
        this.RankPage = 1

        this.node.getChildByName("btnlayer").getChildByName("task_btn").getChildByName("tishi").active = false
        this.node.getChildByName("btnlayer").getChildByName("mail_btn").getChildByName("tishi").active = false

        MsgManager.getInstance().AddListener("SC_SerchPlayer",this.SerchingPlayer.bind(this))
        MsgManager.getInstance().AddListener("SC_GetGamingInfo",this.GetGamingInfo.bind(this))
        //
        MsgManager.getInstance().AddListener("SC_CheckGoToGame",this.CheckGoToGame.bind(this))
        MsgManager.getInstance().AddListener("SC_GetTaskRewards",this.GetTaskRewards.bind(this))
        
        MsgManager.getInstance().AddListener("SC_HallUIInfo",this.HallUIInfo.bind(this))
        MsgManager.getInstance().AddListener("SC_TskEdInfo",this.TskEdInfo.bind(this))
        MsgManager.getInstance().AddListener("SC_MailInfo",this.MailInfo.bind(this))
        MsgManager.getInstance().AddListener("SC_StoreInfo",this.StoreInfo.bind(this))
        MsgManager.getInstance().AddListener("SC_BagInfo",this.BagInfo.bind(this))

        MsgManager.getInstance().AddListener("SC_RankInfo",this.RankInfo.bind(this))

        MsgManager.getInstance().AddListener("SC_YaoQingFriend",this.YaoQingFriend.bind(this))
        MsgManager.getInstance().AddListener("SC_FriendsInfo",this.friendsInfo.bind(this))
        
        

        MsgManager.getInstance().AddListener("WS_Close",this.Disconnect.bind(this))
        // NetMananger.getInstance().Login(this.LoginSucc.bind(this),this.LoginFail.bind(this))

        //NetMananger.getInstance().SendMsg(Msg.CS_Presenter(2291))
        //NetMananger.getInstance().SendMsg(Msg.CS_GetFriendsInfo())

        NetMananger.getInstance().SendMsg(Msg.CS_GetHallUIInfo())

        // var node = new cc.Node();
        // this.node.addChild(node)
        // var particleSystem = node.addComponent(cc.ParticleSystem);
        // particleSystem.file = cc.url.raw("resources/particle/p1.plist")
        // particleSystem.playOnLoad = true
        
        

        //this.checkShare()

        
    
    },
    onDestroy(){
        console.log("hall destory")
        

        
        MsgManager.getInstance().RemoveListener("SC_SerchPlayer")
        //MsgManager.getInstance().RemoveListener("SC_NewGame")
        MsgManager.getInstance().RemoveListener("WS_Close")
        MsgManager.getInstance().RemoveListener("SC_GetGamingInfo")
        MsgManager.getInstance().RemoveListener("SC_YaoQingFriend")
        MsgManager.getInstance().RemoveListener("SC_FriendsInfo")
        
    },

    start () {
        // console.log("hall start")
        // wx.getShareInfo({
        //     shareTicket: res.shareTickets[0],
        //     success(res2) {
        //     //   res.errMsg; // 错误信息
        //     //   res.encryptedData;  //  解密后为一个 JSON 结构（openGId    群对当前小程序的唯一 ID）
        //     //   res.iv; // 加密算法的初始向量
        //         console.log("content");
        //         console.log(res2);
        //         console.log(res2.encryptedData);
        //         var encryptedData = encodeURIComponent(res2.encryptedData);//一定要把加密串转成URI编码
        //         var iv = res2.iv;
        //         console.log(encryptedData);
        //         console.log(res2.userInfo.nickName);
        //         console.log(res2.userInfo.avatarUrl);

        //     },
        //     fail() {},
        //     complete() {}
        //   });

                    

    },

    showTishi:function(){
        
    },

    update (dt) {

        this.showPlayerInfo()

        this.showTishi()

        if(GameDataManager.getInstance().GetGameData("GameId") > 0){
            cc.director.loadScene("Game5G", null);
        }
        if(GameDataManager.getInstance().GetGameData("LookGamePlayerId") > 0){
            cc.director.loadScene("Game5G", null);
        }
        //console.log("GameDataManager.getInstance().GetQueryData()")
        var querydata = GameDataManager.getInstance().GetQueryData()
        if(querydata != null ){

            if(querydata.uid > 0){
                
                NetMananger.getInstance().SendMsg(Msg.CS_Presenter(querydata.uid))
                    
            }

            if( querydata.roomid > 0){
                if (NetMananger.getInstance().SendMsg(Msg.CS_CheckGoToGame(querydata.roomid,querydata.time))){
                    
                }
            }

            GameDataManager.getInstance().SetQueryData(null)
            
            
        }
    },
});
