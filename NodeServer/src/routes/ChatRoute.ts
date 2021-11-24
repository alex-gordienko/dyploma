/* tslint:disable */
import fs from 'fs';
import path from 'path';
import Connection from 'mysql2/typings/mysql/lib/Connection';
import RowDataPacket from 'mysql2/typings/mysql/lib/protocol/packets/RowDataPacket';
import { Socket } from 'socket.io';
import UserGetter from './DataParserScripts/userGetter';
import { parseData } from './DataParserScripts/utils';

const ChatRoute = (con: Connection, socket: Socket, user: UserGetter) => {
    const chatsRoute = path.resolve(__dirname, '../messages');
    socket.on<socket.AvailableMessengerRequestRoutes>('Connect to chat page',
    async (msg: socket.ISocketRequest<api.models.IUser, socket.AvailableMessengerRequestRoutes>) => {
        const time = (new Date).toLocaleTimeString();
        // socket.emit('response',{'data': msg, 'time': time});
        console.log(user.name+" connected at "+ time);

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
            AND Messanger_has_member.idMember=${user.id}`;

        con.query(searchUserChatsQuery,
            async (error, messengers) => {
                if (error) socket.emit<socket.AvailableMessengerResponseRoutes>(
                    'new chat',
                    {
                        status: 'SQL Error',
                        operation: 'new chat',
                        data: {
                            requestFor: msg.data.requestFor,
                            response: error
                        }
                    }
                );
                const JSONMessengers = parseData(messengers) as api.models.IPreviewChat[];
                JSONMessengers.map(async (messenger) => {
                    // преобразование результата поиска в json

                    // подключение пользователя для прослушивания каждого из чатов
                    console.log('Connecting '+user.name+ " to chatroom "+messenger.chatID);
                    socket.join(messenger.chatID);

                        // загрузка данных о каждом чате - обработка названия и аватарки чата
                        // загрузка последнего сообщения чата
                        // отдельно для приватных и пабликов (поскольку методы обработки разные)


                    messenger.members=[];

                    if (messenger.type === 'private') {
                        const getPrivateChatsQuery = `SELECT username, avatar FROM Users JOIN Messanger_has_member WHERE Messanger_has_member.idMember=Users.idUsers AND Messanger_has_member.idMessenger=${messenger.chatID}`;
                        con.query(getPrivateChatsQuery,
                            async (err1,res) => {
                                // этот запрос нужен для загрузки аватарки и ника юзера из бд как превью чата
                                if (err1) socket.emit<socket.AvailableMessengerResponseRoutes>(
                                    'new chat',
                                    {
                                        status: 'SQL Error',
                                        operation: 'new chat',
                                        data: {
                                            requestFor: msg.data.requestFor,
                                            response: err1
                                        }
                                    }
                                );
                                const JSONmembers = parseData(res) as api.models.IMember[];
                                const JSONOpponent = JSONmembers.filter((member: any) => member.username!==user.name)[0];
                                if(JSONOpponent.avatar!==null) JSONOpponent.avatar = Buffer.from(JSONOpponent.avatar).toString();
                                messenger.avatar = JSONOpponent.avatar;
                                messenger.name=JSONOpponent.username;
                                console.log(`${chatsRoute}/${messenger.chatID}.json`);
                                fs.exists(`${chatsRoute}/${messenger.chatID}.json`, async (exists)=>{
                                    if(exists){
                                        const rawdata =  JSON.parse(fs.readFileSync(`${chatsRoute}/${messenger.chatID}.json`).toString());
                                        messenger.lastMessage = rawdata[rawdata.length-1];
                                    }
                                    else messenger.lastMessage = null;
                                })

                                // загрузка данных о участниках чата. айди, ник, рейтинг и аватар (будут использованы для идентификации в переписке)
                                const getChatDataQuery =
                                    `SELECT 
                                        idUsers,
                                        username,
                                        rating,
                                        avatar
                                    FROM Users
                                    JOIN Messanger_has_member
                                    WHERE Messanger_has_member.idMember=Users.idUsers
                                    AND Messanger_has_member.idMessenger = ${messenger.chatID}`;
                                con.query(getChatDataQuery,
                                    (err2, res) => {
                                        if(err2) socket.emit<socket.AvailableMessengerResponseRoutes>(
                                            'new chat',
                                            {
                                                status: 'SQL Error',
                                                operation: 'new chat',
                                                data: {
                                                    requestFor: msg.data.requestFor,
                                                    response: err2
                                                }
                                            }
                                        );
                                        const JSONmembers = parseData(res) as api.models.IMember[];
                                        JSONmembers.map(member => {
                                            const JSONmember = JSON.parse(JSON.stringify(member));
                                            if(JSONmember.avatar!==null) JSONmember.avatar = Buffer.from(JSONmember.avatar).toString();
                                            messenger.members.push(JSONmember);
                                        });
                                        if (socket.emit<socket.AvailableMessengerResponseRoutes>(
                                            'new chat', {
                                                    status: 'OK',
                                                    operation: 'new chat',
                                                    data: {
                                                        requestFor: msg.data.requestFor,
                                                        response: messenger
                                                    }
                                                })
                                        ) {
                                            console.log('Sending private chat...');
                                        };
                                    })
                            })
                    }
                    else if(messenger.type==='public') {
                        if(messenger.avatar!==null)messenger.avatar = Buffer.from(messenger.avatar).toString();
                        // загрузка данных о участниках чата. айди, ник, рейтинг и аватар (будут использованы для идентификации в переписке)

                        fs.exists(`${chatsRoute}/${messenger.chatID}.json`, async (exists)=>{
                            if(exists){
                                const rawdata =  JSON.parse(fs.readFileSync(`${chatsRoute}/${messenger.chatID}.json`).toString());
                                messenger.lastMessage = rawdata[rawdata.length-1];
                            }
                            else messenger.lastMessage = null;
                        })

                        con.query(`SELECT idUsers, username, rating, avatar FROM Users JOIN Messanger_has_member WHERE Messanger_has_member.idMember=Users.idUsers AND Messanger_has_member.idMessenger=${messenger.chatID}`,
                            function(err2,res){
                                if(err2) socket.emit<socket.AvailableMessengerResponseRoutes>(
                                        'new chat',
                                        {
                                            status: 'SQL Error',
                                            operation: 'new chat',
                                            data: {
                                                requestFor: msg.data.requestFor,
                                                response: err2
                                            }
                                        }
                                    );
                                const JSONmembers = parseData(res) as api.models.IMember[];
                                JSONmembers.map(member => {
                                    if(member.avatar!==null) member.avatar = Buffer.from(member.avatar).toString();
                                    messenger.members.push(member);
                                });
                                if (socket.emit<socket.AvailableMessengerResponseRoutes>(
                                    'new chat', {
                                            status: 'OK',
                                            operation: 'new chat',
                                            data: {
                                                requestFor: msg.data.requestFor,
                                                response: messenger
                                            }
                                        })
                                ) {
                                    console.log('Sending public chat...');
                                };
                            })
                    }
                });

            })
    });

    socket.on<socket.AvailableMessengerRequestRoutes>('Join room', async msg=>{
        console.log('New joining room');
        let rawdata = [];
        // поиск файла с текстом сообщений для выбранного чата
        // если найден - отправляем юзеру. Инече - отправка пустого массива
        fs.exists(`${chatsRoute}/${msg.chatroom}.json`, (exists)=>{
            if(exists){
                rawdata = fs.readFileSync(`${chatsRoute}/${msg.chatroom}.json`) as unknown as any[];
                socket.emit('selected room',{chatroom: msg.chatroom, chatMessages: rawdata});
                socket.broadcast.to(msg.chatroom).emit('selected room',{'chatroom': msg.user});
            }
            else rawdata = [];
        })

        console.log(msg.user+' connected to room '+ msg.chatroom);




    })

    socket.on<socket.AvailableMessengerRequestRoutes>('Typing', msg =>{
        console.log(msg.user+' is typing in room '+msg.room);
        socket.broadcast.to(msg.room).emit('onTyping', {'room':msg.room, 'typing':msg.user});
    });

    socket.on<socket.AvailableMessengerRequestRoutes>('Send message', async msg=>{
        console.log('new message from '+msg.user+' in room '+msg.room);
        console.log('content: '+msg.data);
        const now = new Date();
        const today = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate()+' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds();
        let rawdata = [];

        fs.exists(`${chatsRoute}/${msg.room}.json`, async (exists)=>{
            if(exists){
                rawdata = JSON.parse(fs.readFileSync(`${chatsRoute}/${msg.room}.json`) as any);
                // messenger.lastMessage = rawdata[rawdata.length-1];
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

        fs.writeFileSync(`${chatsRoute}/${msg.room}.json`, JSON.stringify(rawdata),{ flag:'w+'})
        // socket.to(msg.room).emit('new message', );
    });

    socket.on<socket.AvailableMessengerRequestRoutes>('Delete message', msg=>{
        console.log('Deleting messages from chat '+msg.room);
        const rawdata = JSON.parse(fs.readFileSync(`${chatsRoute}/${msg.room}.json`) as any);
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


        fs.writeFileSync(`${chatsRoute}/${msg.room}.json`, JSON.stringify(newChatState))
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
};

export default ChatRoute;