


var wx = require("Wx")
var GameDataManager = require("GameDataManager")
export function ShareApp(uid,roomid,time,succCallback){
    wx.shareAppMessage({
        title:"宝石五子棋",
        imageUrl:"res/raw-assets/Res/qipan.png",
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


export function checkShare(){

    //NetMananger.getInstance().SendMsg(Msg.CS_CheckGoToGame(10001,10))
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
    GameDataManager.getInstance().SetQueryData(launchOption.query)

    

    //fds
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