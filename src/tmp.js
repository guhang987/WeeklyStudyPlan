
var mongoose = require('mongoose');
//1.连接数据库
mongoose.connect('mongodb://localhost:27017/week2', { useNewUrlParser: true  , useUnifiedTopology: true });
//2.设计文档结构
var Schema = mongoose.Schema;
var stateSchema = new Schema({
    id: Number,
    name: String,
    password: String,
    percent: Number,
    taskData: {
        list1: [String],
        list2: [String],
    },
    commentData: [
        {
            author: String,
            avatar: String,
            content: String,
            reply: [
                {
                    author: String,
                    avatar: String,
                    contend: String
                }
            ]
        }
    ]



});
// 3.将文档结构发布为模型，
// 第一个参数传入大写名词单数字符串表示数据库名称，系统改成users；第二个参数传入架构
var User = mongoose.model('User', stateSchema)
User.find({},(err,user)=>{console.log(user[0].taskData.list1)})
// User.updateOne({"id":0,"commentData.id":1},
//     {$set:{"commentData.$.content":"hhhhhhhhuuuhhhhhhhh"}},
//     (err,user)=>{
//     if(err) console.log(err)
//     console.log(user)
// })