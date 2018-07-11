














var MyData = [
    {
        "id":1,
        "name":"宝石",
        "discripte":"游戏中的通用货币!",
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
        "id":107,
        "discripte":"赢得快速游戏8局!"
    },
    {
        "id":108,
        "discripte":"赢得快速游戏12局!"
    },
    {
        "id":109,
        "discripte":"分享到不同群3次!"
    },
    {
        "id":1003,
        "name":"紫宝石",
        "discripte":"棋盘上的棋子!",
        "path":"resources/qizi/qizi_3.png"

    },
    {
        "id":1004,
        "name":"红紫宝石",
        "discripte":"棋盘上的棋子!",
        "path":"resources/qizi/qizi_4.png"
    },
    {
        "id":1005,
        "name":"黄宝石",
        "discripte":"棋盘上的棋子!",
        "path":"resources/qizi/qizi_5.png"
    },
    {
        "id":1006,
        "name":"蓝宝石",
        "discripte":"棋盘上的棋子!",
        "path":"resources/qizi/qizi_6.png"
    },
    {
        "id":1007,
        "name":"经典黑棋",
        "discripte":"棋盘上的棋子!",
        "path":"resources/qizi/qizi_7.png"
    },
    {
        "id":1008,
        "name":"经典白棋",
        "discripte":"棋盘上的棋子!",
        "path":"resources/qizi/qizi_8.png"
    },
    {
        "id":1009,
        "name":"足球",
        "discripte":"棋盘上的棋子!",
        "path":"resources/qizi/qizi_9.png"
    },
    {
        "id":1501,
        "name":"备用时间5s",
        "discripte":"备用时间增加5秒,不能与其他增加备用时间道具叠加",
        "path":"resources/qizi/time1.png"
    },
    {
        "id":1601,
        "name":"单步时间2s",
        "discripte":"单步时间增加2秒,不能与其他增加单步时间道具叠加",
        "path":"resources/qizi/steptime1.png"
    },
    {
        "id":1602,
        "name":"单步时间5s",
        "discripte":"单步时间增加5秒,不能与其他增加单步时间道具叠加",
        "path":"resources/qizi/steptime2.png"
    },
    {
        "id":1603,
        "name":"单步时间10s",
        "discripte":"单步时间增加10秒,不能与其他增加单步时间道具叠加",
        "path":"resources/qizi/steptime3.png"
    },
    {
        "id":1604,
        "name":"单步时间20s",
        "discripte":"单步时间增加20秒,不能与其他增加单步时间道具叠加",
        "path":"resources/qizi/steptime4.png"
    },
    {
        "id":1605,
        "name":"单步时间30s",
        "discripte":"单步时间增加30秒,不能与其他增加单步时间道具叠加",
        "path":"resources/qizi/steptime5.png"
    },
    
]

var ResData = new Map()
for (var x in MyData){
    ResData[MyData[x].id] = MyData[x]
}


module.exports = ResData;