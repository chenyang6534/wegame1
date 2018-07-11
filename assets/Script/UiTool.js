











var Tool = require("Tool")

var ResData = require("ResData")


export function getPathByQiZiId(id){
    if( id <= 0){
        return cc.url.raw("resources/qizi/qizi_"+(1)+".png")
    }
    if(id >= 1000){
        return cc.url.raw("resources/qizi/qizi_"+(id-1000)+".png")
    }else{
        return cc.url.raw("resources/qizi/qizi_"+(id)+".png")
    }
    
}

export function getHeadUrlPath(path){
    if( path.indexOf("resources/head") < 0){
        return path+"?aaa=aa.jpg"
    }else{
        return cc.url.raw(path)
    }
}

export function newIcon(type,words,parent,pos,scale){

    var parentscene = parent
    if(parentscene == null){
        parentscene = cc.director.getScene()
    }
    if( scale == null){
        scale = 1.0
    }

    cc.loader.loadRes("icon", function (err, prefab) {
        var newNode = cc.instantiate(prefab);
        parentscene.addChild(newNode);
        //newNode
        newNode.position = pos
        newNode.scale = scale

        
        newNode.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.url.raw(ResData[type].path));
        
        newNode.getChildByName("words").getComponent(cc.Label).string = words

    });

   
 };

 export function newGetRewards(types,words,parent,time){

    var parentscene = parent
    if(parentscene == null){
        parentscene = cc.director.getScene()
    }

    if(time == null){
        time = 3
    }

    cc.loader.loadRes("getrewards", function (err, prefab) {
        var newNode = cc.instantiate(prefab);
        parentscene.addChild(newNode);
        //newNode.position = cc.p(1334/2,750/2)
        //newNode
        var width = 120
        var len = types.length

        Tool.playSound("resources/sound/getreward.mp3",false,0.5)

        //任务信息
        for (var i in types){

            newNode.getComponent(cc.Layout).scheduleOnce(function() {
                var i = this
                var type = types[i]
                var word = words[i]

                var oneGameInfo = cc.instantiate(newNode.getChildByName("rewardmode"));
                oneGameInfo.parent = newNode
                oneGameInfo.position = cc.p( 0-(len-1)*width/2+i*width,0)

                oneGameInfo.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.url.raw(ResData[type].path));
                oneGameInfo.getChildByName("wordbg").getChildByName("words").getComponent(cc.Label).string = word
               
                oneGameInfo.getChildByName("guang").runAction(cc.repeatForever(cc.rotateBy(2,360)))

                oneGameInfo.scale = 0
                oneGameInfo.runAction(cc.scaleTo(1,1,1))
            }.bind(i),0.05*i)

        }

        newNode.getComponent(cc.Layout).scheduleOnce(function() {
            newNode.destroy()
        }.bind(newNode),time)
        
        
        // newNode.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.url.raw(ResData[type].path));
        // newNode.getChildByName("words").getComponent(cc.Label).string = words

    });

   
 };


 export function newScrollWords(jsdata){

    var parentscene = cc.director.getScene()

    cc.loader.loadRes("scrollwords", function (err, prefab) {
        var newNode = cc.instantiate(prefab);
        newNode.position = cc.p(1334/2,750/2)
        parentscene.addChild(newNode);
        
        var day = ""
        if(jsdata.Count > 0){
            day = jsdata.Count
        }else{
            day = jsdata.Time+"天"
        }

        var words = "恭喜玩家: "+jsdata.PlayerName+" 通过 "+jsdata.Src+" 获得 "+ResData[jsdata.Type].name+"("+day+")"

        var worditem = newNode.getChildByName("mask").getChildByName("words")
        worditem.position = cc.p(508,0)
        worditem.getComponent(cc.Label).string = words
        var alllen = worditem.width+1000
        var speed = 100

        var myAction = cc.sequence( cc.moveBy(alllen/speed,cc.p(0-alllen,0)),
                                    cc.callFunc(function(target, score) {
                                        newNode.destroy()
                                    }, null, 0),
                                    );

        worditem.runAction(myAction)

        
        

    });


   
 };



export function newKuang2btn(title,content,okfun,cancelfun,parent){

    var parentscene = parent
    if(parentscene == null){
        parentscene = cc.director.getScene()
    }

    cc.loader.loadRes("kuang2btn", function (err, prefab) {
        var newNode = cc.instantiate(prefab);
        parentscene.addChild(newNode);

        var quitbtn = newNode.getChildByName("ok")
        quitbtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            Tool.playSound("resources/sound/btn.mp3",false,0.5)
            console.log("TOUCH_END")
            //newNode.destory()
            newNode.removeFromParent()
            if(okfun != null){
                okfun()
                
            }
        });
        var cancelbtn = newNode.getChildByName("cancel")
        cancelbtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            Tool.playSound("resources/sound/btn.mp3",false,0.5)
            console.log("TOUCH_END")
            //newNode.destory()
            newNode.removeFromParent()
            if(cancelfun != null){
                cancelfun()
                
            }
        });

        

        
        newNode.getChildByName("title").getComponent(cc.Label).string = title
        
        newNode.getChildByName("content").getComponent(cc.Label).string = content

    });

   
 };



