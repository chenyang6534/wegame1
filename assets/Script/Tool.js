


//var wx = require("Wx")
var GameDataManager = require("GameDataManager")

var playsoundmap = new Map()
export function playSound(path,loop,volume){
    var curtime = GetTimeMillon()

    if( playsoundmap[path] == null){
        cc.audioEngine.play(cc.url.raw(path),loop,volume)
        playsoundmap[path] = curtime
    }else{
        if( curtime-playsoundmap[path] >= 100){
            cc.audioEngine.play(cc.url.raw(path),loop,volume)
            playsoundmap[path] = curtime
        }
    }

}




export function ShareApp(uid,roomid,time,succCallback){
    wx.shareAppMessage({
        title:"@所有人 全国最好玩的五子棋!比跳一跳好玩多了! ",
        imageUrl:"res/raw-assets/resources/timg.jpg",
        query:"uid="+uid+"&roomid="+roomid+"&time="+time,
        success:function(){
            console.log("zhuanfa success")
            if(succCallback != null){
                succCallback()

            }
        },
        fail:function(){
            console.log("zhuanfa fail")
        },
        complete:function(){
            console.log("zhuanfa complete")
        },
    })
};

export function wordhuanhang(str){
    return str.replace(/\\n/g, " \n ")

}


export function RankNum2Str(ranknum){
    if(ranknum >= 1000){
        return "[1-1段]"
    }

    var duan1 = 10-Math.floor(ranknum/100)
    var duan2 = 10-Math.floor(ranknum%100/10)

    return "["+duan1+"-"+duan2+"段]"

}







export function checkShare(){

    //NetMananger.getInstance().SendMsg(Msg.CS_CheckGoToGame(10001,10))

    if (cc.sys.platform === cc.sys.WECHAT_GAME){
        wx.onShow(res => {
            console.log("onshow "+res.scene)
            console.log("onshow uid"+res.query.uid)
            console.log("onshow roomid"+res.query.roomid)
            console.log("onshow time"+res.query.time)
            console.log("onshow ticket"+res.shareTicket)
            GameDataManager.getInstance().SetQueryData(res.query)
        })
    
        var launchOption = wx.getLaunchOptionsSync()
        console.log("launchOption:"+launchOption.query)
        console.log("launchOption23331:")
        console.log("launchOption:"+GameDataManager.getInstance())
        console.log("launchOption2221:")
        GameDataManager.getInstance().SetQueryData(launchOption.query)
        console.log("launchOption111:")


    }

    

    

    //fds
};


export function FormatSeconds(value) { 
    var theTime = parseInt(value);// 秒 
    var theTime1 = 0;// 分 
    var theTime2 = 0;// 小时 
    // alert(theTime); 
    if(theTime > 60) { 
        theTime1 = parseInt(theTime/60); 
        theTime = parseInt(theTime%60); 
    // alert(theTime1+"-"+theTime); 
        if(theTime1 > 60) { 
            theTime2 = parseInt(theTime1/60); 
            theTime1 = parseInt(theTime1%60); 
        } 
    } 
    var result = ""+parseInt(theTime)+"秒"; 
    if(theTime1 > 0) { 
        result = ""+parseInt(theTime1)+"分"+result; 
    } 
    if(theTime2 > 0) { 
        result = ""+parseInt(theTime2)+"小时"+result; 
    } 
    return result; 
} 


var wxLoginBtn = null
var pixel = 1
export function createLoginBtn(clickfun,startfun){

    //NetMananger.getInstance().SendMsg(Msg.CS_CheckGoToGame(10001,10))


    if (cc.sys.platform === cc.sys.WECHAT_GAME){

        if(startfun != null){
            startfun()
        }

        
        wx.getSystemInfo({
            success: function(res) {
              console.log(res.model)
              console.log(res.pixelRatio)
              console.log(res.windowWidth)
              console.log(res.windowHeight)
              console.log(res.language)
              console.log(res.version)
              console.log(res.platform)
              console.log(res.SDKVersion)
              pixel = res.pixelRatio
              
           
          
          } })
        
        console.log("width:"+window.innerWidth)
        console.log("height:"+window.innerHeight)

        if(wx.createUserInfoButton != null){
            console.log("createUserInfoButton != null")
            wxLoginBtn = wx.createUserInfoButton({
                type: 'image',
                text: '微信登录',
                image:"res/raw-assets/resources/wxlogin.png",
                style: {
                    left: window.innerWidth/2-472/pixel/2,
                    top: window.innerHeight/2-165/pixel-30/pixel+window.innerHeight/2,
                    width: 472/pixel,
                    height: 165/pixel,
                    lineHeight: 40,
                    backgroundColor: '#7EF73A',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontSize: 16,
                    borderRadius: 4
                }
            })//
        }else{
            console.log("createUserInfoButton == null")
            if(clickfun != null){
                clickfun("","")
            }
        }

        
        
        wxLoginBtn.onTap((res) => {

            console.log("err:"+res.errMsg)
            console.log(res)
            console.log("-----")
            console.log(res.userInfo)
            console.log("11111")
            if(res.userInfo == null){
                if(clickfun != null){
                    clickfun("","")
                    return
                }
            }
            console.log(res.userInfo.nickName);
            console.log(res.userInfo.avatarUrl);
            if(clickfun != null){
                clickfun(res.userInfo.nickName,res.userInfo.avatarUrl)
            }
            
        })
        
    }else{
        if(clickfun != null){
            clickfun("nickname","")
        }
    }

    
};

export function destroyLoginBtn(clickfun){
    if(wxLoginBtn != null){
        wxLoginBtn.destroy()
        wxLoginBtn = null
    }
    
    
};

var wxBannerBtn = null
export function showBanner(isShow,id){
    if(id == null){
        id = 1
    }

    if (cc.sys.platform === cc.sys.WECHAT_GAME){

        if(isShow == true){
            if(wxBannerBtn == null){
                if(id == 1){
                    wxBannerBtn = wx.createBannerAd({
                        adUnitId: 'adunit-3985b65e5fdad299',
                        style: {
                            left: window.innerWidth/2-300/pixel/2,
                            top: window.innerHeight-95/pixel,
                            width: 300
                        }
                    })
                }else if(id == 2){
                    wxBannerBtn = wx.createBannerAd({
                        adUnitId: 'adunit-3985b65e5fdad299',
                        style: {
                            left: 0,
                            top: window.innerHeight-95/pixel,
                            width: 300
                        }
                    })
                }else{
                    wxBannerBtn = wx.createBannerAd({
                        adUnitId: 'adunit-3985b65e5fdad299',
                        style: {
                            left: window.innerWidth/2-300/pixel/2,
                            top: window.innerHeight-95/pixel,
                            width: 300
                        }
                    })
                }
                
            }

            wxBannerBtn.show()
        }else{
            if( wxBannerBtn != null){
                wxBannerBtn.destroy()
                wxBannerBtn = null
            }
        }
    }

};


export function showVideoAd(isShow,succFun){

    if (cc.sys.platform === cc.sys.WECHAT_GAME){

        if(isShow == true){
            let videoAd = wx.createRewardedVideoAd({
                adUnitId: 'adunit-39e46fd1896b5bc3'
            })
            
            videoAd.load()
            .then(() => videoAd.show())
            .catch(err => console.log(err.errMsg))

            videoAd.onClose(res => {
                // 用户点击了【关闭广告】按钮
                // 小于 2.1.0 的基础库版本，res 是一个 undefined
                if (res && res.isEnded || res === undefined) {
                  // 正常播放结束，可以下发游戏奖励
                    if(succFun != null){
                        succFun()
                    }
                }
                else {
                    // 播放中途退出，不下发游戏奖励
                }
            })
        }else{
            
        }
    }

};






function format(date,str){
    var mat={};
    mat.M=date.getMonth()+1;//月份记得加1
    mat.H=date.getHours();
    mat.s=date.getSeconds();
    mat.m=date.getMinutes();
    mat.Y=date.getFullYear();
    mat.D=date.getDate();
    mat.d=date.getDay();//星期几
    mat.d=check(mat.d);
    mat.H=check(mat.H);
    mat.M=check(mat.M);
    mat.D=check(mat.D);
    mat.s=check(mat.s);
    mat.m=check(mat.m);
    console.log(typeof mat.D)
    if(str.indexOf(":")>-1){
　　　　　mat.Y=mat.Y.toString().substr(2,2);
　　　　 return mat.Y+"/"+mat.M+"/"+mat.D+" "+mat.H+":"+mat.m+":"+mat.s;
    }
    if(str.indexOf("/")>-1){
        return mat.Y+"/"+mat.M+"/"+mat.D+" "+mat.H+"/"+mat.m+"/"+mat.s;
    }
    if(str.indexOf("-")>-1){
        return mat.Y+"-"+mat.M+"-"+mat.D+" "+mat.H+"-"+mat.m+"-"+mat.s;
    }
}
//检查是不是两位数字，不足补全
function check(str){
    str=str.toString();
    if(str.length<2){
        str='0'+ str;
    }
    return str;
}


export function filteremoji(str){
    var ranges = [
        '\ud83c[\udf00-\udfff]', 
        '\ud83d[\udc00-\ude4f]', 
        '\ud83d[\ude80-\udeff]'
    ];
    
    str = str .replace(new RegExp(ranges.join('|'), 'g'), '');
    return str
}






export function GetTimeMillon(){
   return new Date().getTime()
};




export function TimeMillonToHHMMSS(timeSecond){


    var h = check(Math.floor(timeSecond/3600))
    var m = check(Math.floor(timeSecond%3600/60))
    var s = check(Math.floor(timeSecond%3600%60))

     return h+":"+m+":"+s
 };


 function quickSort(arr){
    //如果数组的个数小于等于1，就返回该数组
    if(arr.length<=1){
        return arr;
    }else{
        //否则，取得该数组的中间位置，保存在变量c中
        var c=Math.floor(arr.length/2);
        //将变量c位置的值取出来存入变量center中
        var center=arr.splice(c,1)[0];
        //声明两个空数组left、right
        var left=[];var right=[];
        //然后遍历arr数组将每个数与center做比较，大的放在right中，小的放在left中
        for(var i=0;i<arr.length;i++){
            if(arr[i]<=center){
                left.push(arr[i]);
            }else{
                right.push(arr[i]);
            }
        }
        //最后返回左边和右边的数组，并对其做相同操作，直到递归完成
        return quickSort(left).concat(center).concat(quickSort(right));
        }
}
/**********插入排序算法***********/
function insertSort(arr){
    //遍历数组
    for(var i=1;i<arr2.length;i++){
        //声明一个变量用来记录开始比较的位置，并将i位置的值保存在变量t中
        var t=arr2[i];
        //声明一个变量用来记录i前一个位置保存在变量p中
        var p=i-1;
        //如果p不为负数且t的值不小于p位置的值就无限循环
        while(p>=0&&t<arr2[p]){
            //让p位置的值和p+1位置的值交换位置
            arr2[p+1]=arr2[p];
            //然后让p自减
            p--;
        }
        //当退出循环的时候讲t的值保存在p+1的位置
        arr2[p+1]=t;
        }
}
    /***********冒泡排序算法***************/
function bubbleSort(arr){
    for (var i = 1; i < arr.length; i++) {
        for(var r=0;r<arr.length-i;r++){
            if(arr[r]>arr[r+1]){
                arr[r]=[arr[r+1],arr[r+1]=arr[r]][0];
            }
        }
    }
}