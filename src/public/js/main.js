$(function(){
    const socket = io();
    //obteniendo los elementos DOM
    const $messageForm = $('#message-form');
    const $messageBox = $('#message');
    const $chat = $('#chat');

    //obteniendo datos del DOM nickname
    const $nickerror = $('#nickerror');
    const $nickform = $('#nickform');
    const $nickname = $('#nickname');
    const $mynick = $('#mynick');

    //nombres de usuarios
    const $users = $('#usernames');


    $nickform.submit( e => {
        e.preventDefault();
        socket.emit('new user', $nickname.val(), data => {
            if (data) {
                $('#nickwrap').hide();
                $('#contentwrap').show();

            }else{
                $nickerror.html(
                    "<div class='alert alert-danger' role='alert'><strong>Ese usuario ya existe</strong></div>"
                );
            }
            $nickname.val('');
        }); 
        $nickname.val('');
    });

    //eventos
    $messageForm.submit( e => {
        e.preventDefault();
        socket.emit('enviar mensaje', $messageBox.val(), data =>{
            $chat.append(`<p class="error">${data}</p>`);
        });
        $messageBox.val('');
    });

    socket.on('nuevo mensaje', data => {
        $chat.append('<b>'+data.nick+'</b>:'+data.msg+'<br/>');
        
    });

    socket.on('usernames', data => {
        let html = '';
        for (let i = 0; i < data.length; i++) {
            html += `<p><i class="fa fa-user-circle" aria-hidden="true"></i> ${data[i]}</p>`
            
        }
        $users.html(html);
    })

    socket.on('whisper', data => {
        $chat.append('<p class="whisper"><b>'+data.nick+'</b>:'+data.msg+'</p>');
    });

    socket.on('load', msgs=>{
        for (let i = msgs.length-1; i >= 0 ; i--) {
            
            displaymsg(msgs[i])
        }
    })

    function displaymsg(data) {
        $chat.append('<p class="whisper"><b>'+data.nick+'</b>:'+data.msg+'</p>');
    }
});