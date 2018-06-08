














var MyData = [
    {
        "id":1,
        "discripte":"宝石!",
        "path":"resources/icon/gold.png"
    },
    // {
    //     "id":100,
    //     "discripte":"完成任意比赛5局!"
    // },
    // {
    //     "id":101,
    //     "discripte":"完成任意比赛10局!"
    // },
    {
        "id":102,
        "discripte":"赢得快速游戏2局!"
    },
    {
        "id":103,
        "discripte":"赢得快速游戏5局!"
    },
    {
        "id":104,
        "discripte":"分享到群1次!"
    },
    {
        "id":105,
        "discripte":"赢得好友对战2局!!"
    },
    {
        "id":106,
        "discripte":"赢得好友对战5局!!"
    },
    {
        "id":1003,
        "name":"紫棋",
        "discripte":"来自人间的传说 紫棋!",
        "path":"resources/qizi/qizi_3.png"

    },
    {
        "id":1004,
        "name":"红紫棋",
        "discripte":"来自人间的传说 红紫棋!",
        "path":"resources/qizi/qizi_4.png"
    },
    {
        "id":1005,
        "name":"紫黄棋",
        "discripte":"来自人间的传说 紫黄棋!",
        "path":"resources/qizi/qizi_5.png"
    },
    {
        "id":1006,
        "name":"蓝棋",
        "discripte":"来自人间的传说 蓝棋!",
        "path":"resources/qizi/qizi_6.png"
    },
    {
        "id":1501,
        "name":"备用时间1",
        "discripte":"备用时间增加5秒",
        "path":"resources/qizi/time1.png"
    },
    {
        "id":1601,
        "name":"单步时间1",
        "discripte":"单步时间增加2秒",
        "path":"resources/qizi/time1.png"
    },
    
]

var ResData = new Map()
for (var x in MyData){
    ResData[MyData[x].id] = MyData[x]
}


module.exports = ResData;