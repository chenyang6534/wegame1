



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