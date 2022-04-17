/* tslint:disable */
import fs from 'fs';
import path from 'path';
import { Connection } from 'mysql2';
import RowDataPacket from 'mysql2/typings/mysql/lib/protocol/packets/RowDataPacket';
import { Socket } from 'socket.io';
import UserGetter from './DataParserScripts/userGetter';
import { formatDate, parseData } from './DataParserScripts/utils';

const ChatRoute = (con: Connection, socket: Socket, user: UserGetter) => {
    const chatsRoute = path.resolve(__dirname, '../messages');
    socket.on<socket.AvailableMessengerRequestRoutes>('Connect To Chat Page Request',
    async (msg: socket.ISocketRequest<api.models.IUser, socket.AvailableMessengerRequestRoutes>) => {
        const time = (new Date).toLocaleTimeString();
        // socket.emit('response',{'data': msg, 'time': time});
        console.log(user.name+" connected at "+ time);
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
                    'Connect To Chat Page Response',
                    {
                        status: 'SQL Error',
                        operation: 'Connect To Chat Page Response',
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
                    console.log('Connecting ' + user.name + " to chatroom " + messenger.chatID);
                    socket.join(messenger.chatID);

                    // загрузка данных о каждом чате - обработка названия и аватарки чата
                    // загрузка последнего сообщения чата
                    // отдельно для приватных и пабликов (поскольку методы обработки разные)


                    messenger.members = [];

                    if (messenger.type === 'private') {
                        const getPrivateChatsQuery = `SELECT username, avatar FROM Users JOIN Messanger_has_member WHERE Messanger_has_member.idMember=Users.idUsers AND Messanger_has_member.idMessenger=${messenger.chatID}`;
                        con.query(getPrivateChatsQuery,
                            async (err1, res) => {
                                // этот запрос нужен для загрузки аватарки и ника юзера из бд как превью чата
                                if (err1) socket.emit<socket.AvailableMessengerResponseRoutes>(
                                    'Connect To Chat Page Response',
                                    {
                                        status: 'SQL Error',
                                        operation: 'Connect To Chat Page Response',
                                        data: {
                                            requestFor: msg.data.requestFor,
                                            response: err1
                                        }
                                    }
                                );
                                const JSONmembers = parseData(res) as api.models.IMember[];
                                const JSONOpponent = JSONmembers.filter((member: any) => member.username !== user.name)[0];
                                if (JSONOpponent.avatar !== null) JSONOpponent.avatar = Buffer.from(JSONOpponent.avatar).toString();
                                messenger.avatar = JSONOpponent.avatar;
                                messenger.name = JSONOpponent.username;
                                console.log(`${chatsRoute}/${messenger.chatID}.json`);
                                fs.exists(`${chatsRoute}/${messenger.chatID}.json`, async (exists) => {
                                    if (exists) {
                                        const rawdata = JSON.parse(fs.readFileSync(`${chatsRoute}/${messenger.chatID}.json`).toString());
                                        messenger.lastMessage = rawdata[rawdata.length - 1];
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
                                        if (err2) socket.emit<socket.AvailableMessengerResponseRoutes>(
                                            'Connect To Chat Page Response',
                                            {
                                                status: 'SQL Error',
                                                operation: 'Connect To Chat Page Response',
                                                data: {
                                                    requestFor: msg.data.requestFor,
                                                    response: err2
                                                }
                                            }
                                        );
                                        const JSONmembers = parseData(res) as api.models.IMember[];
                                        JSONmembers.map(member => {
                                            const JSONmember = JSON.parse(JSON.stringify(member));
                                            if (JSONmember.avatar !== null) JSONmember.avatar = Buffer.from(JSONmember.avatar).toString();
                                            messenger.members.push(JSONmember);
                                        });
                                        if (socket.emit<socket.AvailableMessengerResponseRoutes>(
                                            'Connect To Chat Page Response', {
                                            status: 'OK',
                                            operation: 'Connect To Chat Page Response',
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
                    else if (messenger.type === 'public') {
                        if (messenger.avatar !== null) messenger.avatar = Buffer.from(messenger.avatar).toString();
                        // загрузка данных о участниках чата. айди, ник, рейтинг и аватар (будут использованы для идентификации в переписке)

                        fs.exists(`${chatsRoute}/${messenger.chatID}.json`, async (exists) => {
                            if (exists) {
                                const rawdata = JSON.parse(fs.readFileSync(`${chatsRoute}/${messenger.chatID}.json`).toString());
                                messenger.lastMessage = rawdata[rawdata.length - 1];
                            }
                            else messenger.lastMessage = null;
                        })

                        con.query(`SELECT idUsers, username, rating, avatar FROM Users JOIN Messanger_has_member WHERE Messanger_has_member.idMember=Users.idUsers AND Messanger_has_member.idMessenger=${messenger.chatID}`,
                            function (err2, res) {
                                if (err2) socket.emit<socket.AvailableMessengerResponseRoutes>(
                                    'Connect To Chat Page Response',
                                    {
                                        status: 'SQL Error',
                                        operation: 'Connect To Chat Page Response',
                                        data: {
                                            requestFor: msg.data.requestFor,
                                            response: err2
                                        }
                                    }
                                );
                                const JSONmembers = parseData(res) as api.models.IMember[];
                                JSONmembers.map(member => {
                                    if (member.avatar !== null) member.avatar = Buffer.from(member.avatar).toString();
                                    messenger.members.push(member);
                                });
                                if (socket.emit<socket.AvailableMessengerResponseRoutes>(
                                    'Connect To Chat Page Response', {
                                    status: 'OK',
                                    operation: 'Connect To Chat Page Response',
                                    data: {
                                        requestFor: msg.data.requestFor,
                                        response: messenger
                                    }
                                })
                                ) {
                                    console.log('Sending public chat...');
                                };
                            })
                    };
                });

            });
    });

    socket.on<socket.AvailableMessengerRequestRoutes>('Join Room Request',
        async (msg: socket.ISocketRequest<
            { chatroom: string },
            socket.AvailableMessengerRequestRoutes
        >) => {
            console.log('New joining room');
            // поиск файла с текстом сообщений для выбранного чата
            // если найден - отправляем юзеру. Инече - отправка пустого массива
            const isChatExists = fs.existsSync(`${chatsRoute}/${msg.data.options.chatroom}.json`)
            if (isChatExists) {
                const rawdata =
                    JSON.parse(
                        fs.readFileSync(`${chatsRoute}/${msg.data.options.chatroom}.json`).toString()
                    ) as api.models.IMessage[];
                const response: socket.ISocketResponse<
                    api.models.IMessage[],
                    socket.AvailableMessengerResponseRoutes
                > = {
                    operation: 'Join Room Response',
                    status: 'OK',
                    data: {
                        requestFor: 'Join Room Response',
                        response: rawdata
                    }
                };
                socket.join(msg.data.options.chatroom);
                socket.emit<socket.AvailableMessengerResponseRoutes>(
                    'Join Room Response',
                    response
                );

                const broadcastJoinMessage: socket.ISocketResponse<
                    { username: string },
                    socket.AvailableMessengerResponseRoutes
                > = {
                    operation: 'Join Room Response',
                    status: 'OK',
                    data: {
                        requestFor: 'Opponent Join Room Response',
                        response: {
                            username: user.name
                        }
                    }
                };
                socket
                    .broadcast
                    .to(msg.data.options.chatroom)
                    .emit<socket.AvailableMessengerResponseRoutes>('Join Room Response', broadcastJoinMessage);
            }
            console.log(user.name + ' connected to room ' + msg.data.options.chatroom);
        });

    socket.on<socket.AvailableMessengerRequestRoutes>('Chat Typing Request',
        async (msg: socket.ISocketRequest<
            { chatroom: string },
            socket.AvailableMessengerRequestRoutes
        >) => {
            console.log(user.name + ' is typing in room ' + msg.data.options.chatroom);
            const response: socket.ISocketResponse<
                    {chatroom: string, username: string},
                    socket.AvailableMessengerResponseRoutes
                > = {
                    operation: 'Chat Typing Response',
                    status: 'OK',
                    data: {
                        requestFor: 'Chat Typing Response',
                        response: {
                            chatroom: msg.data.options.chatroom,
                            username: user.name,
                        }
                    }
                };
            socket
                .broadcast
                .to(msg.data.options.chatroom)
                .emit<socket.AvailableMessengerResponseRoutes>('Chat Typing Response', response);
    });

    socket.on<socket.AvailableMessengerRequestRoutes>('Send Message Request',
        async (msg: socket.ISocketRequest<
            api.models.ISendMessageRequest,
            socket.AvailableMessengerRequestRoutes
        >) => {
        console.log('Send Message Response from '+msg.data.options.user+' in room '+msg.data.options.room);
        console.log('content: '+msg.data.options.data);
        const now = new Date();
        const today = formatDate();
        let rawdata: api.models.IMessage[] = [];

        const isChatExists = fs.existsSync(`${chatsRoute}/${msg.data.options.room}.json`);
        if(isChatExists){
            rawdata = JSON.parse(
                fs.readFileSync(`${chatsRoute}/${msg.data.options.room}.json`).toString()
            ) as api.models.IMessage[];
        }
        else rawdata = [];

        const newMessage: api.models.IMessage = {
            id: rawdata.length + 1,
            id_author: msg.data.options.id_author,
            isHiddenFromAuthor: false,
            message: msg.data.options.data,
            time: today,
            type: msg.data.options.type
        };
        
        const broadcastResponse: socket.ISocketResponse<
            api.models.IMessage & {toRoom: string},
            socket.AvailableMessengerResponseRoutes
        > = {
            operation: 'Send Message Response',
            status: 'OK',
            data: {
                requestFor: 'Send Message Response',
                response: { ...newMessage, toRoom: msg.data.options.room }
            }
        };
        
        socket
            .to(msg.data.options.room)
            .emit<socket.AvailableMessengerResponseRoutes>('Send Message Response', broadcastResponse);
            
        socket
            .emit<socket.AvailableMessengerResponseRoutes>('Send Message Response', broadcastResponse);
        rawdata.push(newMessage);

        fs.writeFileSync(`${chatsRoute}/${msg.data.options.room}.json`, JSON.stringify(rawdata),{ flag:'w+'})
    });

    socket.on<socket.AvailableMessengerRequestRoutes>('Delete Message Request', msg => {
        console.log('Deleting messages from chat ' + msg.room);
        const rawdata = JSON.parse(fs.readFileSync(`${chatsRoute}/${msg.room}.json`) as any);
        let newChatState = [];
        if (msg.justHide) {
            console.log('Hiding from ' + msg.user);
            newChatState = rawdata.map((message: { id: any; id_author: any; message: any; time: any; type: any; }) => {
                if (msg.data.find((sel: any) => sel === message.id)) {
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
        else {
            console.log('Fully deleted');
            newChatState = rawdata.filter((message: { id: any; }) => !msg.data.find((sel: any) => sel === message.id));
            socket.broadcast.to(msg.room).emit('Delete Message Response', msg.data)
        }


        fs.writeFileSync(`${chatsRoute}/${msg.room}.json`, JSON.stringify(newChatState))
    });

    socket.on<socket.AvailableMessengerRequestRoutes>('Create Chat Request', async msg => {
        console.log('new Chat...');
        let query1 = '';
        if (msg.newChat.avatar === null) {
            query1 = 'INSERT INTO Messenger (type, name) VALUES ("' + msg.newChat.type + '","' + msg.newChat.name + '")';
        }
        else {
            query1 = 'INSERT INTO Messenger (type, name, avatar) VALUES ("' + msg.newChat.type + '","' + msg.newChat.name + '","' + msg.newChat.avatar + '")';
        }
        console.log(query1);
        await con.query(query1,
            async (err, result) => {
                if (err) {
                    console.error(err);
                    socket.emit('Create Chat Response', { 'response': err })
                };
                if (result) {
                    const query2 = 'SELECT chatID from Messenger WHERE name="' + msg.newChat.name + '"';
                    await con.query(query2, async (err, res) => {
                        const JSONChatID = JSON.parse(JSON.stringify(res));

                        msg.newChat.chatID = JSONChatID[0].chatID;

                        if (msg.newChat.type === 'private') msg.newChat.name = msg.newChat.members.filter((member: { username: any; }) => member.username !== msg.user)[0].username;
                        socket.emit('Create Chat Response', { 'chatlist': msg.newChat });

                        await msg.newChat.members.map(async (member: { idUsers: string; }) => {
                            const query3 = 'INSERT INTO Messanger_has_member (idMessenger, idMember) VALUES (' + JSONChatID[0].chatID + ', ' + member.idUsers + ')';
                            await con.query(query3);
                        })
                    })


                }
            })
    });

    socket.on<socket.AvailableMessengerRequestRoutes>('Edit Chat Request',
        async (msg: socket.ISocketRequest<
            api.models.IPreviewChat,
            socket.AvailableMessengerRequestRoutes
            >) => {
            try {
                console.log('Editing chat ' + msg.data.options.chatID);
            
                let query1;
                if (msg.data.options.avatar === null) {
                    query1 =
                        `UPDATE Messenger 
                    SET name="${msg.data.options.name}" 
                    WHERE
                    chatID=${Number(msg.data.options.chatID)}`;
                }
                else {
                    query1 =
                        `UPDATE Messenger 
                    SET name="${msg.data.options.name}", 
                    avatar="${msg.data.options.avatar}"
                    WHERE
                    chatID=${Number(msg.data.options.chatID)}`;
                };

                await con.promise().query(query1);

                const query2 =
                    `DELETE FROM 
                Messanger_has_member
                WHERE idMessenger=${Number(msg.data.options.chatID)}`;
            
                await con.promise().query(query2);
            
                msg.data.options.members.map(async (member: api.models.IMember) => {
                    const query3 =
                        `INSERT INTO 
                    Messanger_has_member (idMessenger, idMember)
                    VALUES (${Number(msg.data.options.chatID)}, ${member.idUsers})`;
                
                    await con.promise().query(query3);
                });

                const response: socket.ISocketResponse<
                    api.models.IPreviewChat,
                    socket.AvailableMessengerResponseRoutes
                > = {
                    operation: 'Edit Chat Response',
                    status: 'OK',
                    data: {
                        requestFor: 'Edit Chat Response',
                        response: msg.data.options
                    }
                };
                socket.emit<socket.AvailableMessengerResponseRoutes>('Edit Chat Response', response);
            } catch (err) {
                console.log(`\t\x1b[31m Client ${user.name} connection Error: \n\t${err}`);
            }
    })
};

export default ChatRoute;