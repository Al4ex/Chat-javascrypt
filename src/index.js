const http = require('http');
const path = require('path');

const express = require('express');
const socketio = require('socket.io');
const app = express();

const server = http.createServer(app);
const io = socketio.listen(server);

//dbconection
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connect MongoDB at default port 27017.
mongoose.connect('mongodb://localhost:27017/chat-database',(err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded.')
    } else {
        console.log('Error in DB connection: ' + err)
    }
});


//configuraciones
app.set('port', process.env.PORT || 3000);

require('./sockets')(io);



//static files
app.use(express.static(path.join(__dirname, 'public')));


//iniciando el servidor

server.listen(app.get('port'), () => console.log(`si lees estos`, app.get('port')));
