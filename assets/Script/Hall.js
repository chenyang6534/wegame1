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
        console.log("event=",event.type," data=",customEventData);

        NetMananger.getInstance().SendMsg(Msg.CS_QuickGame())
    },
    lookGameClick(event, customEventData){
        console.log("lookGameClick")
        console.log("event=",event.type," data=",customEventData);

        // var t1 = Tool.GetTimeMillon()
        // console.log("time:"+t1)

        // console.log(Tool.TimeMillonToHHMMSS(t1/1000))
        //NetMananger.getInstance().SendMsg(Msg.CS_Share())

        NetMananger.getInstance().SendMsg(Msg.CS_GetGamingInfo())
        
    },
    roomGameClick(event, customEventData){
        console.log("roomGameClick")
        console.log("event=",event.type," data=",customEventData);

        //
        NetMananger.getInstance().SendMsg(Msg.CS_CreateRoom())
        // Tool.ShareApp(GameDataManager.getInstance().GetHallInfoData().Uid,100,function(){
        //     console.log("Tool.ShareApp")
        // })
        
    },

    taskClick(event, customEventData){
        console.log("taskClick")
        console.log("event=",event.type," data=",customEventData);
        

        NetMananger.getInstance().SendMsg(Msg.CS_GetTskInfo())

        this.node.getChildByName("btnlayer").getChildByName("task_btn").getChildByName("tishi").active = false
        
        
    },
    mailClick(event, customEventData){
        console.log("mailClick")
        console.log("event=",event.type," data=",customEventData);
        

        NetMananger.getInstance().SendMsg(Msg.CS_GetMailInfo())
        this.node.getChildByName("btnlayer").getChildByName("mail_btn").getChildByName("tishi").active = false
    },
    bagClick(event, customEventData){
        console.log("bagClick")
        console.log("event=",event.type," data=",customEventData);
        

        NetMananger.getInstance().SendMsg(Msg.CS_GetBagInfo())
    },
    storeClick(event, customEventData){
        console.log("storeClick")
        console.log("event=",event.type," data=",customEventData);
        

        NetMananger.getInstance().SendMsg(Msg.CS_GetStoreInfo())
    },
    rankClick(event, customEventData){
        console.log("rankClick")
        console.log("event=",event.type," data=",customEventData);
        

        NetMananger.getInstance().SendMsg(Msg.CS_GetRankInfo(0,20))
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


            //动画
            var myAction = cc.sequence( cc.callFunc(function(target, score) {
                
                                        target.getComponent(cc.Label).string = "搜寻中."
                                        }, this, 0),
                                        cc.delayTime(1),
                                        cc.callFunc(function(target, score) {
                                        
                                            target.getComponent(cc.Label).string = "搜寻中.."
                                            }, this, 0),
                                        
                                        cc.delayTime(1),
                                        cc.callFunc(function(target, score) {
                                            
                                            target.getComponent(cc.Label).string = "搜寻中..."
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
                    var p = this
                    console.log("lookbtn:"+p.GameId)
                    //newNode.destory()
                    //newNode.removeFromParent()
                    GameDataManager.getInstance().SetGameData("GameId",p.GameId)
                    
                }.bind(p));
                

            }
            

        });

    
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
    RankInfo:function(data){
        var jsdata = JSON.parse(data.JsonData)
        console.log("RankInfo! " )
        //this.newBagInfo(jsdata)
        for(var k in jsdata.Ranks){
            var v = jsdata.Ranks[k]
            console.log("rank:"+v.RankNum+"---name:"+v.Name+"--score:"+v.Score)
        }
        
    },

    

    

    freshTaskEd:function(){
        var newNode = this.taskEd
        var data = this.taskData

        var scrollview = newNode.getChildByName("scrollview").getChildByName("view").getChildByName("content")
        scrollview.removeAllChildren()
        //任务信息
        for (var k in data.Task){
            var p = data.Task[k]

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

            var goto = oneGameInfo.getChildByName("goto")
            goto.active = false
            var get = oneGameInfo.getChildByName("get")
            if( p.State == 1){
                get.active = true
            }else{
                get.active = false
            }
            get.on(cc.Node.EventType.TOUCH_END, function (event) {
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
                console.log("TOUCH_END")
                //newNode.destory()
                this.taskEd = null
                newNode.removeFromParent()
                
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
            //任务信息
            for (var k in data.Mails){
                var p = data.Mails[k]

                var oneGameInfo = cc.instantiate(newNode.getChildByName("oneTaskInfo"));
                oneGameInfo.parent = scrollview
                oneGameInfo.getChildByName("discripte").getComponent(cc.Label).string = p.Title
                
                

                
               
                var get = oneGameInfo.getChildByName("get")
                get.on(cc.Node.EventType.TOUCH_END, function (event) {
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
                        getbtn.on(cc.Node.EventType.TOUCH_END, function (event) {
                            var p = this
                            NetMananger.getInstance().SendMsg(Msg.CS_GetMailRewards(p.Id))
                            p.GetState = 1
                            getbtn.active = false
                            //
                        }.bind(p))
                    }else{
                        getbtn.active = false
                    }
                    
                    
                }.bind(p));
                

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
        

        MsgManager.getInstance().AddListener("WS_Close",this.Disconnect.bind(this))
        // NetMananger.getInstance().Login(this.LoginSucc.bind(this),this.LoginFail.bind(this))

        NetMananger.getInstance().SendMsg(Msg.CS_Presenter(90))

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
        //console.log("GameDataManager.getInstance().GetQueryData()")
        var querydata = GameDataManager.getInstance().GetQueryData()
        if(querydata != null ){
            if( querydata.roomid > 0){
                if (NetMananger.getInstance().SendMsg(Msg.CS_CheckGoToGame(querydata.roomid,querydata.time))){
                    GameDataManager.getInstance().SetQueryData(null)
                }
            }
            
            
        }
    },
});
