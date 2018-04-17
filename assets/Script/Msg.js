



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


export function CS_MsgWeiXingLogin(code,name){
    var data = MsgBase("Login","CS_MsgWeiXingLogin")
    data.JsonData = JSON.stringify({
        "Code" : code,
        "Name" : name,
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
export function CS_GoIn(id){
    var data = MsgBase("Game5G","CS_GoIn")
    data.JsonData = JSON.stringify({
        "GameId" : id,
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
export function CS_CheckGoToGame(gameid){
    var data = MsgBase("Game5G","CS_CheckGoToGame")
    data.JsonData = JSON.stringify({
        "GameId" : gameid,
    })
    return JSON.stringify(data)
};