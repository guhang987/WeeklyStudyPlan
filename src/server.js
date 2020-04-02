var express = require('express')
var bodyParser = require('body-parser');
var app = express()

app.all('*', (req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*')
	next()
})
var mongoose = require('mongoose');

//1.连接数据库
mongoose.connect('mongodb://localhost:27017/week5', { useNewUrlParser: true });

//2.设计文档结构
var Schema = mongoose.Schema;

var stateSchema = new Schema({

	id: Number,
	name: {
		type: String,
		unique: true,
	},
	password: String,
	percent: Number,
	taskData: {
		list0: [Object],
		//周任务表，任务未细分 示例：
		// list0: [
		// 	{
		// 	  detail: [
		// 		{
		// 		  i: 'c_1_去',
		// 		  x: 0,
		// 		  y: 0,
		// 		  w: 1,
		// 		  h: 1,
		// 		  name: '去'
		// 		}
		// 	  ],
		// 	  name: '安啊的'
		// 	},
		// 	{
		// 	  detail: [
		// 		{
		// 		  i: 'c_0_问问',
		// 		  x: 0,
		// 		  y: 0,
		// 		  w: 1,
		// 		  h: 1,
		// 		  name: '问问'
		// 		},
		// 		{
		// 		  i: 'c_0_安啊',
		// 		  x: 0,
		// 		  y: 0,
		// 		  w: 1,
		// 		  h: 1,
		// 		  name: '安啊'
		// 		},
		// 	  ],
		// 	  name: '安啊'
		// 	}
		//   ],
		list1: [String],//日待完成任务表
		list2: [String],//日已完成任务吧
	},
	commentData: [
		{
			id: Number,//每个评论需要有id 不然不好更新
			author: String,
			avatar: String,
			content: String,
			datetime: String,
			reply: [
				{
					author: String,
					avatar: String,
					content: String,
					datetime: String,
				}
			]
		}
	]
});
// 3.将文档结构发布为模型，
// 第一个参数传入大写名词单数字符串表示数据库名称，系统改成users；第二个参数传入架构
var User = mongoose.model('User', stateSchema)
// 解析 application/json
app.use(bodyParser.json());
// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/detail', function (req, res) {
	//console.log("收到请求，id是：" + req.query.userId)
	res.header('Access-Control-Allow-Origin', '*');
	User.findOne({ id: req.query.userId },
		'taskData commentData id name', (err, user) => {
			if (!err) {
				//console.log(user)
				res.send({
					taskData: user.taskData,
					commentData: user.commentData,
					id: user.id,
					name: user.name
				})
			}
		})
})
app.get('/all', function (req, res) {
	//获取首页的所有用户进度概览
	//console.log("get all")
	User.find({}, 'name id percent',
		(err, user) => {
			if (err) {
				console.log(err)
			} else {
				res.send(user)
			}
		})

})
app.get('/register', function (req, res) {
	//console.log(req.query)
	//先看用户名是否已经注册
	User.findOne({ name: req.query.username }, 'name',
		(err, user) => {
			if (err) {
				console.log(err)
			} else {
				console.log(user)
				if (user != null) {
					//查到了
					res.send('WrongUser')
				} else {
					//没查到
					User.count({}, (err, count) => {
						if (!err) {
							var m = new User({
								id: count,
								name: req.query.username,
								password: req.query.password,
								percent: 0,
								taskData: [],
								commentData: [],
							})
							m.save((err) => {
								if (err) {
									console.log(err)
								} else {
									res.send('OK');
								}
							})
						}
					})
				}
			}
		})
})
app.get('/identify', function (req, res) {
	//获取首页的所有用户进度概览
	//console.log("收到登陆请求："+req.query.username,req.query.password)

	User.findOne({ name: req.query.username }, 'password',
		(err, user) => {
			if (err) {
				console.log(err)
			} else {
				if (user == null) {
					//未查到该用户
					res.send('WrongUser')
				} else {
					//查到有该用户
					if (user.password === req.query.password) {
						//正确
						res.send('OK')
					} else {
						res.send('WrongPass')
					}
				}
			}
		}
	)
})
app.post('/saveData', function (req, res) {
	//console.log(req.body)
	let list1 = req.body.list1 ? req.body.list1 : []
	let list2 = req.body.list2 ? req.body.list2 : []
	User.findOneAndUpdate(
		{ id: Number(req.body.id) },
		{ $set: { "percent":Number(req.body.percent),"taskData.list1": list1, "taskData.list2": list2 } },
		(err, doc) => {
			if (err) console.log(err)
			else {
				//console.log(doc)
			}
		})
	res.send("ok");
})
app.post('/saveList', function (req, res) {
	console.log(req.body)
	let data=req.body.data?req.body.data:[]
	console.log(data)
	if (req.body.num === '0') {
		User.findOneAndUpdate(
			{ id: Number(req.body.id) },
			{ $set: { "taskData.list0": data } },
			(err, doc) => {
				if (err) console.log(err)

			})
	} else if (req.body.num === '1') {
		//console.log("mode 1" + req.body.data)
		User.findOneAndUpdate(
			{ id: Number(req.body.id) },
			{ $set: { "taskData.list1": data } },
			(err, doc) => {
				if (err) console.log(err)

			})
	}

	res.send("ok");

})
app.post('/saveCommentData', function (req, res) {
	console.log(req.body)
	// let len
	// User.findOne({ id: Number(req.body.id) },
	// 	'commentData',
	// 	(err, user) => {
	// 		if (err) console.log(err)
	// 		len = user.commentData.length
	// 	})
	//state[req.body.id-1].data=req.body.data
	User.findOneAndUpdate({ id: Number(req.body.id) },
		{
			commentData: req.body.data,
		},
		(err, doc) => {
			if (err) {
				console.log(err)
			}
		})

	res.send("ok");
})
app.post('/saveSonCommentData', function (req, res) {
	console.log(req.body)
	//state[req.body.id-1].data=req.body.data
	User.updateOne({ "id": Number(req.body.id), "commentData.id": Number(req.body.index) },
		{ $set: { "commentData.$.reply": req.body.data } },
		(err, user) => {
			if (err) console.log(err)
			console.log(user)
		})
	// User.findOneAndUpdate({ id: Number(req.body.id),"commentData.id": Number(req.body.index)}
	res.send("ok");
})
app.listen(8001, function () {
	console.log('running')
})