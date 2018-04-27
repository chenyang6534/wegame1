














var MyData = [
    {
        "id":1,
        "discripte":"宝石!",
        "path":cc.url.raw("resources/icon/gold.png")
    },
    {
        "id":100,
        "discripte":"完成任意比赛5局!"
    },
    {
        "id":101,
        "discripte":"完成任意比赛10局!"
    },
    {
        "id":102,
        "discripte":"赢得任意比赛2局!"
    },
    {
        "id":103,
        "discripte":"赢得任意比赛4局!"
    },
    {
        "id":104,
        "discripte":"分享给好友1次!"
    },
    {
        "id":105,
        "discripte":"分享给好友2次!"
    },
    {
        "id":106,
        "discripte":"分享给好友3次!"
    },
    
]

var ResData = new Map()
for (var x in MyData){
    ResData[MyData[x].id] = MyData[x]
}


module.exports = ResData;