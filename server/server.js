var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(3000, function (){
  console.log('listening on *:3000');
});

var users = {};

io.on('connection', function (socket) {
  console.log('a user connected');

  socket.on('user message', function (message) {
    console.log(socket.username + ': ' + message);
    socket.broadcast.emit('user message', socket.username + ': ' + message);
  });

  socket.on('user status', function (payload) {
    var username = payload.username;
    var status = payload.status;

    if (!username) {
      console.log('Skipped username');
      return;
    }

    console.log('user status: "' + username + '" => ' + status);

    var user = users[username] || {};
    user.status = status;
    user.duration = payload.duration;
    user.updatedAt = Date();
    users[username] = user;

    socket.username = username;

    io.emit('user status', users);
  });

  socket.on('disconnect', function () {
    console.log('user disconnected');

    if (!username) { return; }

    var user = users[socket.username] || {};
    user.status = 'away';
    user.duration = null;
    user.updatedAt = Date();

    io.emit('user status', users);
  });
});
