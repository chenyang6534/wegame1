




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
