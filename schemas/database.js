var mongoose = require('mongoose')

//数据库地址
DB_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/mongoose';

mongoose.connect(DB_URL);
console.log('connect success');

mongoose.connection.on('disconnected',function(){
    console.log('connect wrong');
})

module.exports = mongoose;