







var Msg = require("Msg")
var MsgManager = require("MsgManager")

var GameDataManager = cc.Class({
    name: "GameDataManager",
    hallInfo:null,
    gameInfo:null,
    ctor: function () {
        MsgManager.getInstance().AddListener("SC_MsgHallInfo",this.HallInfoData.bind(this))
        this.gameInfo = new Map()
    },

    HallInfoData:function(data){
        this.hallInfo = JSON.parse(data.JsonData).PlayerInfo
        console.log("HallInfoData"+data.JsonData)
    },

    GetHallInfoData:function(){
        return this.hallInfo
    },

    SetGameData:function(key,value){
        this.gameInfo[key] = value
    },
    GetGameData:function(key){
        return this.gameInfo[key]
    },
    


});
    





GameDataManager._instance = null;
GameDataManager.getInstance = function () {
    if(!GameDataManager._instance){
        GameDataManager._instance = new GameDataManager();
    }
    return GameDataManager._instance;
}

module.exports = GameDataManager;