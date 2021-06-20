var mysql = require('mysql');
const fs = require('fs');

const connectDB = async()=>{
    try{
        var con = await mysql.createConnection({
            host: 'localhost',
            user: 'alexoid1999',
            password: '18ebyhwb',
            database: 'RadianceEternal'
        });
        return con;
    } catch(err){
        console.error(err.message);
    }
}

const ChatRoute = (socket, con)=>{
        //  формат входящих сообщений для сокетов - {command, {'user':user, 'data': data})}
        //  формат исходящих сообщений от сервера - {'response', {'response': data})}
        socket.on('connect to chat page', async msg =>{
            console.log('New connection');
            var time = (new Date).toLocaleTimeString();
            //socket.emit('response',{'data': msg, 'time': time});
            console.log(msg.user+" connected at "+ time);
            
            await con.connect(async function(err){
                if(err) socket.emit('response',{'response': err});
                console.log('Connected to DB');
                var chatList=[];
                // поиск чатов в бд, в которых состоит пользователь
                await con.query(`SELECT chatID, type, name, Messenger.avatar FROM Messenger JOIN Messanger_has_member WHERE Messanger_has_member.idMessenger=Messenger.chatID AND Messanger_has_member.idMember=(SELECT idUsers FROM Users WHERE username='${msg.user}')`,
                    async function(err,messengers){
                        if(err) socket.emit('response',{'response': err});
                        messengers.map( async(messenger, indx)=>{
                            // преобразование результата поиска в json 
                            let JSONmessenger = JSON.parse(JSON.stringify(messenger));

                            // подключение пользователя для прослушивания каждого из чатов
                            console.log('Connecting '+msg.user+ " to chatroom "+JSONmessenger.chatID);
                            socket.join(JSONmessenger.chatID);                                
                            
                             // загрузка данных о каждом чате - обработка названия и аватарки чата
                             // загрузка последнего сообщения чата
                             // отдельно для приватных и пабликов (поскольку методы обработки разные)
                             

                            JSONmessenger.members=[];

                            if(JSONmessenger.type==='private'){
                                await con.query(`SELECT username, avatar FROM Users JOIN Messanger_has_member WHERE Messanger_has_member.idMember=Users.idUsers AND Messanger_has_member.idMessenger=${JSONmessenger.chatID}`,
                                    async function(err,res){
                                        // этот запрос нужен для загрузки аватарки и ника юзера из бд как превью чата
                                        if(err) socket.emit('response',{'response': err});
                                        let JSONmembers = JSON.parse(JSON.stringify(res));
                                        let JSONOpponent = JSONmembers.filter(member=> member.username!==msg.user)[0];
                                        if(JSONOpponent.avatar!==null) JSONOpponent.avatar = Buffer.from(JSONOpponent.avatar).toString();
                                        JSONmessenger.avatar = JSONOpponent.avatar;
                                        JSONmessenger.name=JSONOpponent.username;

                                        fs.exists("./messages/"+JSONmessenger.chatID+'.json', async (exists)=>{
                                            if(exists){
                                                let rawdata =  JSON.parse(fs.readFileSync("./messages/"+JSONmessenger.chatID+'.json'));
                                                JSONmessenger.lastMessage = rawdata[rawdata.length-1];
                                            }
                                            else JSONmessenger.lastMessage = {};
                                        })

                                        // загрузка данных о участниках чата. айди, ник, рейтинг и аватар (будут использованы для идентификации в переписке)
                                        await con.connect(async function(err){
                                            if(err) socket.emit('response',{'response': err});
                                            console.log('Connected to DB'); 
                                            con.query(`SELECT idUsers, username, rating, avatar FROM Users JOIN Messanger_has_member WHERE Messanger_has_member.idMember=Users.idUsers AND Messanger_has_member.idMessenger=${JSONmessenger.chatID}`,
                                                function(err,res){
                                                    if(err) socket.emit('response',{'response': err});
                                                    res.map(member=>{
                                                        let JSONmember = JSON.parse(JSON.stringify(member));
                                                        if(JSONmember.avatar!==null) JSONmember.avatar = Buffer.from(JSONmember.avatar).toString();
                                                        JSONmessenger.members.push(JSONmember);
                                                    });
                                                    if(socket.emit('new chat',{'chatlist': JSONmessenger})){
                                                        console.log('Sending private chat...');
                                                    };
                                                })      
                                        })
                                    })
                            }
                            else if(JSONmessenger.type==='public') {
                                if(JSONmessenger.avatar!==null)JSONmessenger.avatar = Buffer.from(JSONmessenger.avatar).toString();
                                // загрузка данных о участниках чата. айди, ник, рейтинг и аватар (будут использованы для идентификации в переписке)
                                await con.connect(async function(err){
                                    if(err) socket.emit('response',{'response': err});

                                    fs.exists("./messages/"+JSONmessenger.chatID+'.json', async (exists)=>{
                                        if(exists){
                                            let rawdata =  JSON.parse(fs.readFileSync("./messages/"+JSONmessenger.chatID+'.json'));
                                            JSONmessenger.lastMessage = rawdata[rawdata.length-1];
                                        }
                                        else JSONmessenger.lastMessage = {};
                                    })

                                    console.log('Connected to DB'); 
                                    con.query(`SELECT idUsers, username, rating, avatar FROM Users JOIN Messanger_has_member WHERE Messanger_has_member.idMember=Users.idUsers AND Messanger_has_member.idMessenger=${JSONmessenger.chatID}`,
                                        function(err,res){
                                            if(err) socket.emit('response',{'response': err});
                                            res.map(member=>{
                                                
                                                let JSONmember = JSON.parse(JSON.stringify(member));
                                                if(JSONmember.avatar!==null) JSONmember.avatar = Buffer.from(JSONmember.avatar).toString();
                                                JSONmessenger.members.push(JSONmember);
                                            });
                                            if(socket.emit('new chat',{'chatlist': JSONmessenger})){
                                                console.log('Sending public chat...');
                                            };
                                        })      
                                })
                            }
                        });
                                          
                    })
            })
        });

        socket.on('join room', async msg=>{
            console.log('New joining room');
            let rawdata = [];
            // поиск файла с текстом сообщений для выбранного чата
            // если найден - отправляем юзеру. Инече - отправка пустого массива
            fs.exists("./messages/"+msg.chatroom+'.json', (exists)=>{
                if(exists){
                    rawdata = fs.readFileSync("./messages/"+msg.chatroom+'.json');
                    socket.emit('selected room',{'chatroom': msg.chatroom, 'chatMessages':JSON.parse(rawdata)});
                    socket.to(msg.chatroom).broadcast.emit('selected room',{'chatroom': msg.user});
                }
                else rawdata = [];
            })
            
            console.log(msg.user+' connected to room '+ msg.chatroom);

            
           

        })

        socket.on('typing', msg =>{
            console.log(msg.user+' is typing in room '+msg.room);
            socket.broadcast.to(msg.room).emit('onTyping', {'room':msg.room, 'typing':msg.user});
        });


        try{
            socket.on('send', async msg=>{
                console.log('new message from '+msg.user+' in room '+msg.room);
                console.log('content: '+msg.data);
                let now = new Date();
                let today = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()+' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
                let rawdata = [];

                fs.exists("./messages/"+msg.room+'.json', async (exists)=>{
                    if(exists){
                       rawdata = JSON.parse(fs.readFileSync("./messages/"+msg.room+'.json'));
                       JSONmessenger.lastMessage = rawdata[rawdata.length-1];
                    }
                    else rawdata = [];
                })

                let newMessage ={
                    id: rawdata.length+1,
                    id_author: msg.id_author,
                    isHiddenFromAuthor: false,
                    message: msg.data,
                    time: today,
                    type: msg.type
                }
                socket.to(msg.room).emit('new message', {'toRoom': msg.room, 'newMessage':newMessage});
                rawdata.push(newMessage);

                fs.writeFileSync("./messages/"+msg.room+'.json', JSON.stringify(rawdata),{ flag:'w+'}, (err)=>{
                    if(err) console.error(err);
                    console.log('Rewriting file...');
                })
                //socket.to(msg.room).emit('new message', );
            });
            
        } catch(err){
            console.error(err.message);
        }

        try{
            socket.on('delete', msg=>{
                console.log('Deleting messages from chat '+msg.room);
                let rawdata = JSON.parse(fs.readFileSync("./messages/"+msg.room+'.json'));
                let newChatState = [];
                if(msg.justHide){
                    console.log('Hiding from '+msg.user);
                    newChatState = rawdata.map(message=>{
                        if(msg.data.find(sel=> sel===message.id)){
                            return {
                                id: message.id,
                                id_author: message.id_author,
                                isHiddenFromAuthor: true,
                                message: message.message,
                                time: message.time,
                                type: message.type
                            }
                        }
                        else return {
                            id: message.id,
                            id_author: message.id_author,
                            isHiddenFromAuthor: false,
                            message: message.message,
                            time: message.time,
                            type: message.type
                        }
                    })
                }
                else{
                    console.log('Fully deleted');
                    newChatState = rawdata.filter(message=> !msg.data.find(sel=> sel===message.id));
                    socket.to(msg.room).broadcast.emit('onDeletion', msg.data)
                }
                

                fs.writeFileSync("./messages/"+msg.room+'.json', JSON.stringify(newChatState), (err)=>{
                    if(err) console.error(err);
                    console.log('Rewriting file...');
                })
            })
        } catch{
            console.error('error on deletion')
        }

        socket.on('create chat',async msg=>{
            console.log('new Chat...');
            await con.connect(async function(err){
                if(err) socket.emit('response',{'response': err});
                console.log('Connected to DB');

                let query1 = '';
                if(msg.newChat.avatar===null){
                    query1 = 'INSERT INTO Messenger (type, name) VALUES ("'+msg.newChat.type+'","'+msg.newChat.name+'")';
                }
                else{
                    query1 = 'INSERT INTO Messenger (type, name, avatar) VALUES ("'+msg.newChat.type+'","'+msg.newChat.name+'","'+msg.newChat.avatar+'")';
                }
                console.log(query1);
                await con.query(query1,
                    async (err, result)=>{
                        if(err) {
                            console.error(err);
                            socket.emit('response',{'response': err})
                        };
                        if(result){
                            let query2= 'SELECT chatID from Messenger WHERE name="'+msg.newChat.name+'"';
                            console.log(query2);
                            await con.query(query2,async (err,res)=>{
                                let JSONChatID = JSON.parse(JSON.stringify(res));
                                console.log(JSONChatID[0]);

                                msg.newChat.chatID=JSONChatID[0].chatID;

                                if(msg.newChat.type==='private') msg.newChat.name= msg.newChat.members.filter(member=> member.username!==msg.user)[0].username;
                                socket.emit('new chat',{'chatlist': msg.newChat});

                                await msg.newChat.members.map(async member=>{
                                    let query3= 'INSERT INTO Messanger_has_member (idMessenger, idMember) VALUES ('+JSONChatID[0].chatID+', '+member.idUsers+')';
                                    console.log(query3);
                                    await con.query(query3);
                                })
                            })
                            
                            
                        }
                    })
            })
        })

        socket.on('edit chat', async msg=>{
            console.log('Editing chat '+msg.newChat.chatID);
            await con.connect(async function(err){
                if(err) socket.emit('response',{'response': err});
                console.log('Connected to DB');

                let query1;
                if (msg.newChat.avatar===null)  query1 = 'UPDATE Messenger SET name="'+msg.newChat.name+'" WHERE chatID="'+msg.newChat.chatID+'"';
                else query1 = 'UPDATE Messenger SET name="'+msg.newChat.name+'", avatar="'+msg.newChat.avatar+'" WHERE chatID="'+msg.newChat.chatID+'"';
                
                await con.query(query1);

                let query2= 'DELETE FROM Messanger_has_member WHERE idMessenger="'+msg.newChat.chatID+'"';
                await con.query(query2);
                msg.newChat.members.map(async member=>{
                    let query3= 'INSERT INTO Messanger_has_member (idMessenger, idMember) VALUES ('+msg.newChat.chatID+', '+member.idUsers+')';
                    await con.query(query3);
                })
                await socket.emit('editing chat',{'chatlist': msg.newChat});
            })
        })
};

module.exports = ChatRoute;