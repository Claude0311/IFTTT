var io = require("socket.io");
var express = require("express");
var app = express();
app.use(express.static('public'));

app.post("/foo", function(req, res, next) {
    io.sockets.emit("foo", req.body);
    res.send({});
});

var server = app.listen(process.env.PORT||1993, function(req, res) {
  console.log("網站伺服器在1993埠口開工了！");
});


var sio = io(server);
 
sio.on('connection', function(socket){
  console.log("Connected");
 
  // 接收'connection'事件訊息
  socket.on('connection', function (data) {
　　console.log('來自Arduino的訊息：' + data.msg);
  });
 
  // 接收'atime'事件訊息
  socket.on('atime', function (data) {
　　console.log('來自Arduino的訊息：' + data.msg);
　　// 發送時間資料給前端
    socket.emit('atime', { 'time': new Date().toJSON() });
  });
});