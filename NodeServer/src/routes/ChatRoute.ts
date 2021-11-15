/* tslint:disable */
import fs from 'fs';
import Connection from 'mysql2/typings/mysql/lib/Connection';
import RowDataPacket from 'mysql2/typings/mysql/lib/protocol/packets/RowDataPacket';
import { Socket } from 'socket.io';

const ChatRoute = (con: Connection, socket: Socket)=>{
        //  формат входящих сообщений для сокетов - {command, {'user':user, 'data': data})}
        //  формат исходящих сообщений от сервера - {'response', {'response': data})}
        socket.on('connect to chat page', async msg =>{
            console.log('New connection');
            const time = (new Date).toLocaleTimeString();
            // socket.emit('response',{'data': msg, 'time': time});
            console.log(msg.user+" connected at "+ time);

            const chatList=[];
            // поиск чатов в бд, в которых состоит пользователь
            const searchUserChatsQuery =
                `SELECT
                    chatID,
                    type,
                    name,
                    Messenger.avatar
                FROM Messenger
                JOIN Messanger_has_member
                WHERE Messanger_has_member.idMessenger=Messenger.chatID
                AND Messanger_has_member.idMember
                    =(SELECT idUsers FROM Users WHERE username='${msg.user}')`;

            await con.query(searchUserChatsQuery,
                async (error, messengers) => {
                    if(error) socket.emit('response',{'response': error});
                    (messengers as RowDataPacket[]).map(async(messenger)=>{
                        // преобразование результата поиска в json
                        let JSONmessenger = JSON.parse(JSON.stringify(messenger));

                        // подключение пользователя для прослушивания каждого из чатов
                        console.log('Connecting '+msg.user+ " to chatroom "+JSONmessenger.chatID);
                        socket.join(JSONmessenger.chatID);

                            // загрузка данных о каждом чате - обработка названия и аватарки чата
                            // загрузка последнего сообщения чата
                            // отдельно для приватных и пабликов (поскольку методы обработки разные)


                        JSONmessenger.members=[];

                        if (JSONmessenger.type === 'private') {
                            const getPrivateChatsQuery = `SELECT username, avatar FROM Users JOIN Messanger_has_member WHERE Messanger_has_member.idMember=Users.idUsers AND Messanger_has_member.idMessenger=${JSONmessenger.chatID}`;
                            await con.query(getPrivateChatsQuery,
                                async (err1,res) => {
                                    // этот запрос нужен для загрузки аватарки и ника юзера из бд как превью чата
                                    if(err1) socket.emit('response',{'response': err1});
                                    const JSONmembers = JSON.parse(JSON.stringify(res));
                                    const JSONOpponent = JSONmembers.filter((member: any) => member.username!==msg.user)[0];
                                    if(JSONOpponent.avatar!==null) JSONOpponent.avatar = Buffer.from(JSONOpponent.avatar).toString();
                                    JSONmessenger.avatar = JSONOpponent.avatar;
                                    JSONmessenger.name=JSONOpponent.username;

                                    fs.exists("./messages/"+JSONmessenger.chatID+'.json', async (exists)=>{
                                        if(exists){
                                            const rawdata =  JSON.parse(fs.readFileSync("./messages/"+JSONmessenger.chatID+'.json').toString());
                                            JSONmessenger.lastMessage = rawdata[rawdata.length-1];
                                        }
                                        else JSONmessenger.lastMessage = {};
                                    })

                                    // загрузка данных о участниках чата. айди, ник, рейтинг и аватар (будут использованы для идентификации в переписке)
                                    console.log('Connected to DB');
                                    const getChatDataQuery =
                                        `SELECT 
                                            idUsers,
                                            username,
                                            rating,
                                            avatar
                                        FROM Users
                                        JOIN Messanger_has_member
                                        WHERE Messanger_has_member.idMember=Users.idUsers
                                        AND Messanger_has_member.idMessenger = ${JSONmessenger.chatID}`;
                                    con.query(getChatDataQuery,
                                        (err2, res) => {
                                            if(err2) socket.emit('response',{'response': err2});
                                            (res as RowDataPacket[]).map(member => {
                                                const JSONmember = JSON.parse(JSON.stringify(member));
                                                if(JSONmember.avatar!==null) JSONmember.avatar = Buffer.from(JSONmember.avatar).toString();
                                                JSONmessenger.members.push(JSONmember);
                                            });
                                            if(socket.emit('new chat',{'chatlist': JSONmessenger})){
                                                console.log('Sending private chat...');
                                            };
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
                                        const rawdata =  JSON.parse(fs.readFileSync("./messages/"+JSONmessenger.chatID+'.json').toString());
                                        JSONmessenger.lastMessage = rawdata[rawdata.length-1];
                                    }
                                    else JSONmessenger.lastMessage = {};
                                })

                                console.log('Connected to DB');
                                con.query(`SELECT idUsers, username, rating, avatar FROM Users JOIN Messanger_has_member WHERE Messanger_has_member.idMember=Users.idUsers AND Messanger_has_member.idMessenger=${JSONmessenger.chatID}`,
                                    function(err,res){
                                        if(err) socket.emit('response',{'response': err});
                                        (res as RowDataPacket[]).map(member => {

                                            const JSONmember = JSON.parse(JSON.stringify(member));
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
        });

        socket.on('join room', async msg=>{
            console.log('New joining room');
            let rawdata = [];
            // поиск файла с текстом сообщений для выбранного чата
            // если найден - отправляем юзеру. Инече - отправка пустого массива
            fs.exists("./messages/"+msg.chatroom+'.json', (exists)=>{
                if(exists){
                    rawdata = fs.readFileSync("./messages/" + msg.chatroom + '.json') as unknown as any[];
                    socket.emit('selected room',{chatroom: msg.chatroom, chatMessages: rawdata});
                    socket.broadcast.to(msg.chatroom).emit('selected room',{'chatroom': msg.user});
                }
                else rawdata = [];
            })

            console.log(msg.user+' connected to room '+ msg.chatroom);




        })

        socket.on('typing', msg =>{
            console.log(msg.user+' is typing in room '+msg.room);
            socket.broadcast.to(msg.room).emit('onTyping', {'room':msg.room, 'typing':msg.user});
        });

        socket.on('send', async msg=>{
            console.log('new message from '+msg.user+' in room '+msg.room);
            console.log('content: '+msg.data);
            const now = new Date();
            const today = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()+' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
            let rawdata = [];

            fs.exists("./messages/"+msg.room+'.json', async (exists)=>{
                if(exists){
                    rawdata = JSON.parse(fs.readFileSync("./messages/" + msg.room + '.json') as any);
                    // JSONmessenger.lastMessage = rawdata[rawdata.length-1];
                }
                else rawdata = [];
            })

            const newMessage ={
                id: rawdata.length+1,
                id_author: msg.id_author,
                isHiddenFromAuthor: false,
                message: msg.data,
                time: today,
                type: msg.type
            }
            socket.to(msg.room).emit('new message', {'toRoom': msg.room, 'newMessage':newMessage});
            rawdata.push(newMessage);

            fs.writeFileSync("./messages/"+msg.room+'.json', JSON.stringify(rawdata),{ flag:'w+'})
            // socket.to(msg.room).emit('new message', );
        });

        socket.on('delete', msg=>{
            console.log('Deleting messages from chat '+msg.room);
            const rawdata = JSON.parse(fs.readFileSync("./messages/"+msg.room+'.json') as any);
            let newChatState = [];
            if(msg.justHide){
                console.log('Hiding from '+msg.user);
                newChatState = rawdata.map((message: { id: any; id_author: any; message: any; time: any; type: any; })=>{
                    if(msg.data.find((sel: any)=> sel===message.id)){
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
                newChatState = rawdata.filter((message: { id: any; }) => !msg.data.find((sel: any)=> sel===message.id));
                socket.broadcast.to(msg.room).emit('onDeletion', msg.data)
            }


            fs.writeFileSync("./messages/"+msg.room+'.json', JSON.stringify(newChatState))
        })

        socket.on('Create chat request',async msg=>{
            console.log('new Chat...');
            await con.connect(async function(err){
                if(err) socket.emit('Create chat response',{'response': err});
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
                            socket.emit('Create chat response',{'response': err})
                        };
                        if(result){
                            const query2= 'SELECT chatID from Messenger WHERE name="'+msg.newChat.name+'"';
                            console.log(query2);
                            await con.query(query2,async (err,res)=>{
                                const JSONChatID = JSON.parse(JSON.stringify(res));
                                console.log(JSONChatID[0]);

                                msg.newChat.chatID=JSONChatID[0].chatID;

                                if(msg.newChat.type==='private') msg.newChat.name= msg.newChat.members.filter((member: { username: any; })=> member.username!==msg.user)[0].username;
                                socket.emit('new chat',{'chatlist': msg.newChat});

                                await msg.newChat.members.map(async (member: { idUsers: string; })=>{
                                    const query3= 'INSERT INTO Messanger_has_member (idMessenger, idMember) VALUES ('+JSONChatID[0].chatID+', '+member.idUsers+')';
                                    console.log(query3);
                                    await con.query(query3);
                                })
                            })


                        }
                    })
            })
        })

        socket.on('Edit chat Request', async msg=>{
            console.log('Editing chat '+msg.newChat.chatID);
            await con.connect(async function(err){
                if(err) socket.emit('response',{'response': err});
                console.log('Connected to DB');

                let query1;
                if (msg.newChat.avatar===null)  query1 = 'UPDATE Messenger SET name="'+msg.newChat.name+'" WHERE chatID="'+msg.newChat.chatID+'"';
                else query1 = 'UPDATE Messenger SET name="'+msg.newChat.name+'", avatar="'+msg.newChat.avatar+'" WHERE chatID="'+msg.newChat.chatID+'"';

                await con.query(query1);

                const query2= 'DELETE FROM Messanger_has_member WHERE idMessenger="'+msg.newChat.chatID+'"';
                await con.query(query2);
                msg.newChat.members.map(async (member: { idUsers: string; })=>{
                    const query3= 'INSERT INTO Messanger_has_member (idMessenger, idMember) VALUES ('+msg.newChat.chatID+', '+member.idUsers+')';
                    await con.query(query3);
                })
                await socket.emit('Edit chat Response',{'chatlist': msg.newChat});
            })
        })
    
        socket.on('Typing request', msg => {
            console.log(msg.user + ' is typing in room ' + msg.room);
            socket.broadcast.to(msg.room).emit('Typing response', { 'room': msg.room, 'typing': msg.user });
        });

        // socket.on('edit chat', async msg=>{

        // })
};

export default ChatRoute;