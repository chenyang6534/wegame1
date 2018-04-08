



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