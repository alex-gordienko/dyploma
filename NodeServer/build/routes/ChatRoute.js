"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable */
const fs_1 = __importDefault(require("fs"));
const ChatRoute = (con, socket) => {
    //  формат входящих сообщений для сокетов - {command, {'user':user, 'data': data})}
    //  формат исходящих сообщений от сервера - {'response', {'response': data})}
    socket.on('connect to chat page', (msg) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('New connection');
        const time = (new Date).toLocaleTimeString();
        // socket.emit('response',{'data': msg, 'time': time});
        console.log(msg.user + " connected at " + time);
        const chatList = [];
        // поиск чатов в бд, в которых состоит пользователь
        const searchUserChatsQuery = `SELECT
                    chatID,
                    type,
                    name,
                    Messenger.avatar
                FROM Messenger
                JOIN Messanger_has_member
                WHERE Messanger_has_member.idMessenger=Messenger.chatID
                AND Messanger_has_member.idMember
                    =(SELECT idUsers FROM Users WHERE username='${msg.user}')`;
        yield con.query(searchUserChatsQuery, (error, messengers) => __awaiter(void 0, void 0, void 0, function* () {
            if (error)
                socket.emit('response', { 'response': error });
            messengers.map((messenger) => __awaiter(void 0, void 0, void 0, function* () {
                // преобразование результата поиска в json
                let JSONmessenger = JSON.parse(JSON.stringify(messenger));
                // подключение пользователя для прослушивания каждого из чатов
                console.log('Connecting ' + msg.user + " to chatroom " + JSONmessenger.chatID);
                socket.join(JSONmessenger.chatID);
                // загрузка данных о каждом чате - обработка названия и аватарки чата
                // загрузка последнего сообщения чата
                // отдельно для приватных и пабликов (поскольку методы обработки разные)
                JSONmessenger.members = [];
                if (JSONmessenger.type === 'private') {
                    const getPrivateChatsQuery = `SELECT username, avatar FROM Users JOIN Messanger_has_member WHERE Messanger_has_member.idMember=Users.idUsers AND Messanger_has_member.idMessenger=${JSONmessenger.chatID}`;
                    yield con.query(getPrivateChatsQuery, (err1, res) => __awaiter(void 0, void 0, void 0, function* () {
                        // этот запрос нужен для загрузки аватарки и ника юзера из бд как превью чата
                        if (err1)
                            socket.emit('response', { 'response': err1 });
                        const JSONmembers = JSON.parse(JSON.stringify(res));
                        const JSONOpponent = JSONmembers.filter((member) => member.username !== msg.user)[0];
                        if (JSONOpponent.avatar !== null)
                            JSONOpponent.avatar = Buffer.from(JSONOpponent.avatar).toString();
                        JSONmessenger.avatar = JSONOpponent.avatar;
                        JSONmessenger.name = JSONOpponent.username;
                        fs_1.default.exists("./messages/" + JSONmessenger.chatID + '.json', (exists) => __awaiter(void 0, void 0, void 0, function* () {
                            if (exists) {
                                const rawdata = JSON.parse(fs_1.default.readFileSync("./messages/" + JSONmessenger.chatID + '.json').toString());
                                JSONmessenger.lastMessage = rawdata[rawdata.length - 1];
                            }
                            else
                                JSONmessenger.lastMessage = {};
                        }));
                        // загрузка данных о участниках чата. айди, ник, рейтинг и аватар (будут использованы для идентификации в переписке)
                        console.log('Connected to DB');
                        const getChatDataQuery = `SELECT 
                                            idUsers,
                                            username,
                                            rating,
                                            avatar
                                        FROM Users
                                        JOIN Messanger_has_member
                                        WHERE Messanger_has_member.idMember=Users.idUsers
                                        AND Messanger_has_member.idMessenger = ${JSONmessenger.chatID}`;
                        con.query(getChatDataQuery, (err2, res) => {
                            if (err2)
                                socket.emit('response', { 'response': err2 });
                            res.map(member => {
                                const JSONmember = JSON.parse(JSON.stringify(member));
                                if (JSONmember.avatar !== null)
                                    JSONmember.avatar = Buffer.from(JSONmember.avatar).toString();
                                JSONmessenger.members.push(JSONmember);
                            });
                            if (socket.emit('new chat', { 'chatlist': JSONmessenger })) {
                                console.log('Sending private chat...');
                            }
                            ;
                        });
                    }));
                }
                else if (JSONmessenger.type === 'public') {
                    if (JSONmessenger.avatar !== null)
                        JSONmessenger.avatar = Buffer.from(JSONmessenger.avatar).toString();
                    // загрузка данных о участниках чата. айди, ник, рейтинг и аватар (будут использованы для идентификации в переписке)
                    yield con.connect(function (err) {
                        return __awaiter(this, void 0, void 0, function* () {
                            if (err)
                                socket.emit('response', { 'response': err });
                            fs_1.default.exists("./messages/" + JSONmessenger.chatID + '.json', (exists) => __awaiter(this, void 0, void 0, function* () {
                                if (exists) {
                                    const rawdata = JSON.parse(fs_1.default.readFileSync("./messages/" + JSONmessenger.chatID + '.json').toString());
                                    JSONmessenger.lastMessage = rawdata[rawdata.length - 1];
                                }
                                else
                                    JSONmessenger.lastMessage = {};
                            }));
                            console.log('Connected to DB');
                            con.query(`SELECT idUsers, username, rating, avatar FROM Users JOIN Messanger_has_member WHERE Messanger_has_member.idMember=Users.idUsers AND Messanger_has_member.idMessenger=${JSONmessenger.chatID}`, function (err, res) {
                                if (err)
                                    socket.emit('response', { 'response': err });
                                res.map(member => {
                                    const JSONmember = JSON.parse(JSON.stringify(member));
                                    if (JSONmember.avatar !== null)
                                        JSONmember.avatar = Buffer.from(JSONmember.avatar).toString();
                                    JSONmessenger.members.push(JSONmember);
                                });
                                if (socket.emit('new chat', { 'chatlist': JSONmessenger })) {
                                    console.log('Sending public chat...');
                                }
                                ;
                            });
                        });
                    });
                }
            }));
        }));
    }));
    socket.on('join room', (msg) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('New joining room');
        let rawdata = [];
        // поиск файла с текстом сообщений для выбранного чата
        // если найден - отправляем юзеру. Инече - отправка пустого массива
        fs_1.default.exists("./messages/" + msg.chatroom + '.json', (exists) => {
            if (exists) {
                rawdata = fs_1.default.readFileSync("./messages/" + msg.chatroom + '.json');
                socket.emit('selected room', { chatroom: msg.chatroom, chatMessages: rawdata });
                socket.broadcast.to(msg.chatroom).emit('selected room', { 'chatroom': msg.user });
            }
            else
                rawdata = [];
        });
        console.log(msg.user + ' connected to room ' + msg.chatroom);
    }));
    socket.on('typing', msg => {
        console.log(msg.user + ' is typing in room ' + msg.room);
        socket.broadcast.to(msg.room).emit('onTyping', { 'room': msg.room, 'typing': msg.user });
    });
    socket.on('send', (msg) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('new message from ' + msg.user + ' in room ' + msg.room);
        console.log('content: ' + msg.data);
        const now = new Date();
        const today = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
        let rawdata = [];
        fs_1.default.exists("./messages/" + msg.room + '.json', (exists) => __awaiter(void 0, void 0, void 0, function* () {
            if (exists) {
                rawdata = JSON.parse(fs_1.default.readFileSync("./messages/" + msg.room + '.json'));
                // JSONmessenger.lastMessage = rawdata[rawdata.length-1];
            }
            else
                rawdata = [];
        }));
        const newMessage = {
            id: rawdata.length + 1,
            id_author: msg.id_author,
            isHiddenFromAuthor: false,
            message: msg.data,
            time: today,
            type: msg.type
        };
        socket.to(msg.room).emit('new message', { 'toRoom': msg.room, 'newMessage': newMessage });
        rawdata.push(newMessage);
        fs_1.default.writeFileSync("./messages/" + msg.room + '.json', JSON.stringify(rawdata), { flag: 'w+' });
        // socket.to(msg.room).emit('new message', );
    }));
    socket.on('delete', msg => {
        console.log('Deleting messages from chat ' + msg.room);
        const rawdata = JSON.parse(fs_1.default.readFileSync("./messages/" + msg.room + '.json'));
        let newChatState = [];
        if (msg.justHide) {
            console.log('Hiding from ' + msg.user);
            newChatState = rawdata.map((message) => {
                if (msg.data.find((sel) => sel === message.id)) {
                    return {
                        id: message.id,
                        id_author: message.id_author,
                        isHiddenFromAuthor: true,
                        message: message.message,
                        time: message.time,
                        type: message.type
                    };
                }
                else
                    return {
                        id: message.id,
                        id_author: message.id_author,
                        isHiddenFromAuthor: false,
                        message: message.message,
                        time: message.time,
                        type: message.type
                    };
            });
        }
        else {
            console.log('Fully deleted');
            newChatState = rawdata.filter((message) => !msg.data.find((sel) => sel === message.id));
            socket.broadcast.to(msg.room).emit('onDeletion', msg.data);
        }
        fs_1.default.writeFileSync("./messages/" + msg.room + '.json', JSON.stringify(newChatState));
    });
    socket.on('Create chat request', (msg) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('new Chat...');
        yield con.connect(function (err) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err)
                    socket.emit('Create chat response', { 'response': err });
                console.log('Connected to DB');
                let query1 = '';
                if (msg.newChat.avatar === null) {
                    query1 = 'INSERT INTO Messenger (type, name) VALUES ("' + msg.newChat.type + '","' + msg.newChat.name + '")';
                }
                else {
                    query1 = 'INSERT INTO Messenger (type, name, avatar) VALUES ("' + msg.newChat.type + '","' + msg.newChat.name + '","' + msg.newChat.avatar + '")';
                }
                console.log(query1);
                yield con.query(query1, (err, result) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        console.error(err);
                        socket.emit('Create chat response', { 'response': err });
                    }
                    ;
                    if (result) {
                        const query2 = 'SELECT chatID from Messenger WHERE name="' + msg.newChat.name + '"';
                        console.log(query2);
                        yield con.query(query2, (err, res) => __awaiter(this, void 0, void 0, function* () {
                            const JSONChatID = JSON.parse(JSON.stringify(res));
                            console.log(JSONChatID[0]);
                            msg.newChat.chatID = JSONChatID[0].chatID;
                            if (msg.newChat.type === 'private')
                                msg.newChat.name = msg.newChat.members.filter((member) => member.username !== msg.user)[0].username;
                            socket.emit('new chat', { 'chatlist': msg.newChat });
                            yield msg.newChat.members.map((member) => __awaiter(this, void 0, void 0, function* () {
                                const query3 = 'INSERT INTO Messanger_has_member (idMessenger, idMember) VALUES (' + JSONChatID[0].chatID + ', ' + member.idUsers + ')';
                                console.log(query3);
                                yield con.query(query3);
                            }));
                        }));
                    }
                }));
            });
        });
    }));
    socket.on('Edit chat Request', (msg) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Editing chat ' + msg.newChat.chatID);
        yield con.connect(function (err) {
            return __awaiter(this, void 0, void 0, function* () {
                if (err)
                    socket.emit('response', { 'response': err });
                console.log('Connected to DB');
                let query1;
                if (msg.newChat.avatar === null)
                    query1 = 'UPDATE Messenger SET name="' + msg.newChat.name + '" WHERE chatID="' + msg.newChat.chatID + '"';
                else
                    query1 = 'UPDATE Messenger SET name="' + msg.newChat.name + '", avatar="' + msg.newChat.avatar + '" WHERE chatID="' + msg.newChat.chatID + '"';
                yield con.query(query1);
                const query2 = 'DELETE FROM Messanger_has_member WHERE idMessenger="' + msg.newChat.chatID + '"';
                yield con.query(query2);
                msg.newChat.members.map((member) => __awaiter(this, void 0, void 0, function* () {
                    const query3 = 'INSERT INTO Messanger_has_member (idMessenger, idMember) VALUES (' + msg.newChat.chatID + ', ' + member.idUsers + ')';
                    yield con.query(query3);
                }));
                yield socket.emit('Edit chat Response', { 'chatlist': msg.newChat });
            });
        });
    }));
    socket.on('Typing request', msg => {
        console.log(msg.user + ' is typing in room ' + msg.room);
        socket.broadcast.to(msg.room).emit('Typing response', { 'room': msg.room, 'typing': msg.user });
    });
    // socket.on('edit chat', async msg=>{
    // })
};
exports.default = ChatRoute;
//# sourceMappingURL=ChatRoute.js.map