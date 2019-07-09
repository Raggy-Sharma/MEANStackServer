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

io.of('userProfile').on('connection', (socket) => {
    var userId = socket.request._query['userId'];
    if (userId) {
        if(users){
            users.forEach(element => {
                io.of('/userProfile').to(element.socketId).emit('message', { 'message': element.userName + ' joined' })
            });
        }
        users.push({
            userName: userId,
            socketId: socket.id
        })
        users.forEach(element => {
            io.of('/userProfile').to(element.socketId).emit('message', { 'message': 'Hi ' + element.userName })
        });
    }

    socket.on('disconnect', () => {
        users.forEach((element, i) => {
            if (element.userName === userId) {
                users.splice(i, 1);
            }
            io.of('/userProfile').to(element.socketId).emit('message', { 'message': element.userName + ' left' })
        });
        console.log('users', JSON.stringify(users))
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