



function MsgBase(modetype,msgtype){
    var database = {
        "ModeType" : modetype,
        "MsgType" : msgtype,
    }

    return database
}


export function CS_MsgQuickLogin(platform,machineid){
    var data = MsgBase("Login","CS_MsgQuickLogin")
    data.JsonData = JSON.stringify({
        "Platform" : platform,
        "MachineId" : machineid,
    })
    return JSON.stringify(data)
};


export function CS_MsgWeiXingLogin(code,name,avatarUrl){
    var data = MsgBase("Login","CS_MsgWeiXingLogin")
    data.JsonData = JSON.stringify({
        "Code" : code,
        "Name" : name,
        "AvatarUrl":avatarUrl,
    })
    return JSON.stringify(data)
};

//快速游戏
export function CS_QuickGame(){
    var data = MsgBase("Hall","CS_QuickGame")
    
    return JSON.stringify(data)
};
//取消快速游戏
export function CS_QuickGameExit(){
    var data = MsgBase("Hall","CS_QuickGameExit")
    
    return JSON.stringify(data)
};

//进入
export function CS_GoIn(id,uid){

    if(uid == null){
        uid = -1
    }

    var data = MsgBase("Game5G","CS_GoIn")
    data.JsonData = JSON.stringify({
        "GameId" : Number(id),
        "OtherPlayerUid" : Number(uid),
    })
    return JSON.stringify(data)
};

//走棋
export function CS_DoGame5G(x,y){
    var data = MsgBase("Game5G","CS_DoGame5G")
    data.JsonData = JSON.stringify({
        "X" : x,
        "Y" : y,
    })
    return JSON.stringify(data)
};

//退出游戏
export function CS_GoOut(){
    var data = MsgBase("Game5G","CS_GoOut")
    
    return JSON.stringify(data)
};

//心跳
export function CS_Heart(){
    var data = MsgBase("Hall","CS_Heart")
    
    return JSON.stringify(data)
};
//获取任务信息
export function CS_GetTskInfo(){
    var data = MsgBase("Hall","CS_GetTskInfo")
    
    return JSON.stringify(data)
};

//获取邮件信息
export function CS_GetMailInfo(){
    var data = MsgBase("Hall","CS_GetMailInfo")
    
    return JSON.stringify(data)
};

//获取商店信息
export function CS_GetStoreInfo(){
    var data = MsgBase("Hall","CS_GetStoreInfo")
    
    return JSON.stringify(data)
};

//获取排行信息
export function CS_GetRankInfo(start,end){
    var data = MsgBase("Hall","CS_GetRankInfo")
    data.JsonData = JSON.stringify({
        "StartRank" : start,
        "EndRank" : end,
    })
    
    return JSON.stringify(data)
};

//获取背包信息
export function CS_GetBagInfo(){
    var data = MsgBase("Hall","CS_GetBagInfo")
    
    return JSON.stringify(data)
};



//获取当前进行中的游戏信息
export function CS_GetGamingInfo(){
    var data = MsgBase("Game5G","CS_GetGamingInfo")
    data.JsonData = JSON.stringify({
        "Count" : 10,
    })
    return JSON.stringify(data)
};

//创建游戏房间
export function CS_CreateRoom(){
    var data = MsgBase("Game5G","CS_CreateRoom")
    
    return JSON.stringify(data)
};

//检查游戏房间
export function CS_CheckGoToGame(gameid,CreateGameTime){
    var data = MsgBase("Game5G","CS_CheckGoToGame")
    data.JsonData = JSON.stringify({
        "GameId" : Number(gameid),
        "CreateGameTime" : Number(CreateGameTime),
    })
    return JSON.stringify(data)
};

//获取任务奖励
export function CS_GetTaskRewards(taskid){
    var data = MsgBase("Hall","CS_GetTaskRewards")
    data.JsonData = JSON.stringify({
        "Id" : Number(taskid),
        
    })
    return JSON.stringify(data)
};

//获取邮件奖励
export function CS_GetMailRewards(taskid){
    var data = MsgBase("Hall","CS_GetMailRewards")
    data.JsonData = JSON.stringify({
        "Id" : Number(taskid),
        
    })
    return JSON.stringify(data)
};

//购买商品
export function CS_BuyItem(taskid,index){
    var data = MsgBase("Hall","CS_BuyItem")
    data.JsonData = JSON.stringify({
        "Id" : Number(taskid),
        "Index" : Number(index),
        
    })
    return JSON.stringify(data)
};
//装备特效
export function CS_ZhuangBeiItem(type){
    var data = MsgBase("Hall","CS_ZhuangBeiItem")
    data.JsonData = JSON.stringify({
        "Type" : Number(type),
        
    })
    return JSON.stringify(data)
};


//获取UI提示信息
export function CS_GetHallUIInfo(){
    var data = MsgBase("Hall","CS_GetHallUIInfo")
    
    return JSON.stringify(data)
};

//获取公告提示信息
export function CS_GetNoticeInfo(){
    var data = MsgBase("Hall","CS_GetNoticeInfo")
    
    return JSON.stringify(data)
};

//CS_BuyItem

//分享一次给朋友
export function CS_Share(taskid){
    var data = MsgBase("Hall","CS_Share")
    
    return JSON.stringify(data)
};

//上传推荐者
export function CS_Presenter(uid){
    var data = MsgBase("Hall","CS_Presenter")
    data.JsonData = JSON.stringify({
        "PresenterUid" : Number(uid),
    })
    
    return JSON.stringify(data)
};

//获取好友信息
export function CS_GetFriendsInfo(){
    var data = MsgBase("Hall","CS_GetFriendsInfo")
    
    return JSON.stringify(data)
};

//邀请好友
export function CS_YaoQingFriend(uid,name,gameid){
    var data = MsgBase("Hall","CS_YaoQingFriend")
    data.JsonData = JSON.stringify({
        "FriendUid" : Number(uid),
        "MyName" : name,
        "GameId" : gameid,
    })
    
    return JSON.stringify(data)
};