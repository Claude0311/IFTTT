var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

//基本設定
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
})
app.get('/',function(req,res){
    res.render('index',__dirname+"public/index.html")
})

//資料庫
var airSchema = require('./schemas/air.js');

//功能
app.get('/getdata',function(req,res){
	airSchema.find({ID:'123'},function(err,obj){
		if(err) return concole.log(err)
		res.json(obj[0]);
	})
})

app.post('/chdb', function (req, res) {
	var airOn = req.body.airOn;
	var airMode = req.body.airMode;
	var temperature = req.body.temperature;
	var fanON = req.body.fanOn;
	console.log(airOn,airMode,temperature, fanON)
	airSchema.find({ID:'123'},function(err,obj){
		if (err) {
            console.log("Error:" + err);
        }else{
			if(obj.length == 0){
				var newMode = new airSchema({"ID":'123', "airOn":airOn, "temperature":temperature, "airMode":airMode, "fanON":fanON});
				console.log(newMode);
				newMode.save(function(err,response){
					if(err){
						console.log(err);
					}
					else{
						console.log('成功儲存：',{ID:'123', "airOn":airOn, "airMode":airMode, "temperature":temperature, "fanON":fanON});
						res.send({status:'success',message:true});
				}});
            }else{
				console.log("更改資料");
                airSchema.updateOne({ID:'123'},{$set:{"airOn":airOn, "airMode":airMode, "temperature":temperature, "fanON":fanON}},function(err,res){
					if (err) throw err;
				});
				res.send({status:'success',message:true});
			}
		}
	})
	io.emit('on',{airOn:airOn, airMode:airMode, temperature:temperature, fanON:fanON});
});

app.post('/ifttt', function(req, res){
	var toCh = {};
	if(req.query.airOn !== undefined) toCh.airOn = req.query.airOn;
	if(req.query.airMode !== undefined) toCh.airMode = req.query.airMode;
	if(req.query.temperature !== undefined) toCh.temperature = req.query.temperature;
	if(req.query.fanON !== undefined) toCh.fanON = req.query.fanON;
	console.log('toCh',toCh);
	airSchema.updateOne({ID:'123'},{$set:toCh},function(err,res){
		if (err) throw err;
		airSchema.find({ID:'123'}, function(err,obj){
			console.log('toSend',obj[0]);
			//io.emit('on',obj[0]);
		})
	});
	
})


/*io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
	io.emit('chat message', msg);
	io.emit('chat message', msg);
  })
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});*/

var server = app.listen(process.env.PORT||3000,function(){
    console.log('server connect');
	console.log(DB_URL);
	console.log(process.env.PORT||3000);
})