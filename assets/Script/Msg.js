



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