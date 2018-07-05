







var Msg = require("Msg")
var MsgManager = require("MsgManager")
var UiTool = require("UiTool")

var GameDataManager = cc.Class({
    name: "GameDataManager",
    hallInfo:null,
    gameInfo:null,
    queryData:null,
    ctor: function () {
        MsgManager.getInstance().AddListener("SC_MsgHallInfo",this.HallInfoData.bind(this))
        MsgManager.getInstance().AddListener("SC_NewGame",this.NewGame.bind(this))
        MsgManager.getInstance().AddListener("SC_ScrollWords",this.ScrollWords.bind(this))
        this.gameInfo = new Map()
        this.SetGameData("GameId",-1)

        
        
    },

    //滚动通知
    ScrollWords:function(data){
        var jsdata = JSON.parse(data.JsonData)
        console.log("ScrollWords! " )

        
        UiTool.newScrollWords(jsdata)
        
    },

    NewGame:function(data){
        var jd = JSON.parse(data.JsonData)
        console.log("NewGame"+jd.GameId)
        this.SetGameData("GameId",jd.GameId)
        //cc.director.loadScene("Game5G", null);
        
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

    SetQueryData:function(d1){
        this.queryData = d1
        
    },
    GetQueryData:function(){
        return this.queryData
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