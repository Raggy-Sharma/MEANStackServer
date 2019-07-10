require('./config/config');
require('./models/db');
require('./config/passportConfig');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const rtsIndex = require('./routes/index.router');

var app = express();

// middleware
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use('/api', rtsIndex);

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);
let users = [];
usersList = [];
let userLeft;

io.of('userProfile').on('connection', (socket) => {
    var userId = socket.request._query['userId'];
    if (userId) {
        usersList.push(userId);
        users.push({
            userName: userId,
            socketId: socket.id
        })
        users.forEach(element => {
            io.of('/userProfile').to(element.socketId).emit('message', { 'message': 'Hi ' + element.userName }),
                io.of('/userProfile').to(element.socketId).emit('onlineUsers', usersList.filter(res => res !== element.userName))
        });
    }

    socket.on('sendTo', (message, user) => {
        var sendToUser = users.filter(res => res.userName === user);
        io.of('/userProfile').to(sendToUser[0].socketId).emit('message', { 'message': message })
    })

    socket.on('disconnect', () => {
        users.forEach((element, i) => {
            if (element.userName === userId) {
                userLeft = users.splice(i, 1);
            }
        });
        usersList.forEach((element, i) => {
            if (element === userId) {
                usersList.splice(i, 1);
            }
        });
        users.filter(res => io.of('/userProfile').to(res.socketId).emit('message', { 'message': userLeft[0].userName + ' left' }))
        users.filter(res => io.of('/userProfile').to(res.socketId).emit('onlineUsers', usersList.filter(res2 => res2 !== res.userName)))
    })
});



// error handler
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors);
    }
})

// start server
server.listen(process.env.PORT, () => {
    console.log(`started on port: ${process.env.PORT}`);
});