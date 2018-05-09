













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

export function newIcon(type,words,parent,pos){

    var parentscene = parent
    if(parentscene == null){
        parentscene = cc.director.getScene()
    }

    cc.loader.loadRes("icon", function (err, prefab) {
        var newNode = cc.instantiate(prefab);
        parentscene.addChild(newNode);
        //newNode
        newNode.position = pos
        newNode.scale = 0.8

        
        newNode.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.url.raw(ResData[type].path));
        
        newNode.getChildByName("words").getComponent(cc.Label).string = words

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
            console.log("TOUCH_END")
            //newNode.destory()
            newNode.removeFromParent()
            if(okfun != null){
                okfun()
                
            }
        });
        var cancelbtn = newNode.getChildByName("cancel")
        cancelbtn.on(cc.Node.EventType.TOUCH_END, function (event) {
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



