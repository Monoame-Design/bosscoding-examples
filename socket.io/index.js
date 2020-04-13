// var fs = require('fs')
// var https = require('https')
// 如果不需要用 https 的話，要改成引用 http 喔
var http = require('http')
var socketio = require('socket.io')

//https 的一些設定，如果不需要使用 ssl 加密連線的話，把內容註解掉就好
var options = {
    // key: fs.readFileSync('這個網域的 ssl key 位置'),
    // cert: fs.readFileSync('這個網域的 ssl fullchain 位置')
}

//http & socket port
var server = http.createServer(options);
server.listen(4040)
var io = socketio(server);
console.log("Server socket 4040 , api 4000")

//api port
var app = require('express')();
var port = 4000;
app.listen(port, function () {
    console.log('API listening on *:' + port);
});

//用 api 方式取得
app.get('/api/messages', function (req, res) {
    let messages = 'hellow world'
    res.send(messages);
})

var messages = [
    { name: "Majer", message: "Welcome!" }
]

var typing = false
var timer = null
//用 socket 方式取得
io.on('connection', function (socket) {
    console.log('user connected')
    socket.emit("allMessage", messages)

    socket.on("sendMessage", function (message) {
        console.log(message)
        messages.push(message)
        io.emit("newMessage", message)
    })

    socket.on('sendTyping', function () {
        console.log('typing')
        typing = true
        io.emit("someoneIsTyping", typing)
        clearTimeout(timer)
        timer = setTimeout(() => {
            typing = false
            io.emit("someoneIsTyping", typing)
        }, 3000)
    })
})

