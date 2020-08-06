const chat = require('./models/chat');

module.exports = function (io) {
    let nicknames = {};

    io.on('connection', async socket => {
        console.log('nuevo usuario conectado');
        
        let messages = await chat.find({}).sort({_id:-1}).limit(5);
        socket.emit('load', messages);

        socket.on('new user',(data, cb) => {
            console.log(data);
            if (data in nicknames) {
                cb(false);                
            }else{
                cb(true);
                socket.nickname = data;
                nicknames[socket.nickname] = socket;
                updatenick();
            }
        });

        socket.on('enviar mensaje', async (data, cb) => {
            var msg = data.trim();
            if (msg.substr(0, 3) === "/p " ) {
                msg = msg.substr(3);
                const index = msg.indexOf(' ');
                if (index !== -1) {
                    var name = msg.substr(0, index); 
                    var msg = msg.substr(index + 1);
                    if (name in nicknames) {
                        nicknames[name].emit('whisper',{
                            msg,
                            nick: socket.nickname
                        })                        
                    }else{
                        cb('ERROR! Porfavor ingrese un nombre de usuario valido');
                    }                  
                }else{
                    cb('Porfavor ingresa tu mensaje');
                }
            }else{

                var newmsg = new chat({
                    msg,
                    nick:socket.nickname,
                });
                await newmsg.save();
                io.sockets.emit('nuevo mensaje', {
                    msg: data,
                    nick: socket.nickname
                });
            }
        });

        socket.on('disconnect', data => {
            if (!socket.nickname) return;
            delete nicknames[socket.nickname];
            updatenick();
        });

        function updatenick(){
            io.sockets.emit('usernames', Object.keys(nicknames));
        }
    });
}