














var MyData = [
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
    
]

var ResData = new Map()
for (var x in MyData){
    ResData[MyData[x].id] = MyData[x]
}


module.exports = ResData;