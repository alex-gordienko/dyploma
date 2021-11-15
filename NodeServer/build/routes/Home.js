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
// import ChatRoute from './ChatRoute';
const userGetter_1 = __importDefault(require("./DataParserScripts/userGetter"));
const postGetter_1 = __importDefault(require("./DataParserScripts/postGetter"));
const postSetter_1 = __importDefault(require("./DataParserScripts/postSetter"));
const socket_io_1 = require("socket.io");
const __1 = require("..");
const isConnectedToDb = (con) => con.config !== undefined;
const isCreateCommentData = (data) => data.content !== undefined;
const Home = (server) => {
    const io = new socket_io_1.Server(server, {
        serveClient: false,
        allowEIO3: true,
        pingTimeout: 60000,
        cors: {
            origin: 'http://10.15.0.96:3000',
            credentials: true
        }
    });
    io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('\n\x1b[0m New connection');
        // Для каждого сокета создаётся экземпляр коннектора БД, пользователя и парсера
        const con = yield (0, __1.connectDB)();
        if (!con) {
            socket.emit('Client Login Response', {
                status: 'Server Error',
                data: {
                    requestFor: 'Connection',
                    response: 'Can\'t connect to db'
                }
            });
            socket.disconnect();
        }
        if (isConnectedToDb(con)) {
            const user = new userGetter_1.default(con);
            const postGetter = new postGetter_1.default(con, socket);
            const postSetter = new postSetter_1.default(con, socket);
            //
            //  формат входящих сообщений от клиента:
            //  socket.on(<Название события реквеста>, msg:{operation: <название операции>, data: <JSON с необходимыми данными>}))
            //
            //  формат исходящих сообщений от сервера:
            //  socket.emit(<Название события респонса>, {status: 'OK || Server Error || SQL Error || Unknown operation', 'result': <JSON с необходимыми данными || дублирует status>})
            //
            // Подключаем кусок обработчиков для чата
            // ChatRoute(socket, con);
            // Обработчик запросов для авторизации
            socket.on('Client Login Request', (msg) => __awaiter(void 0, void 0, void 0, function* () {
                if (msg.data.options.login && msg.data.options.login !== '') {
                    console.log(`\x1b[33m Client ${msg.data.options.login} is connecting...`);
                    socket.join(msg.token);
                    try {
                        user.Login(msg.data.options)
                            .then((result) => {
                            console.log(`\t\x1b[32m Client ${msg.data.options.login} with token ${msg.token} is connected succesfully`);
                            socket.emit('Client Login Response', result);
                            user.id = result.data.response.idUsers;
                            user.name = result.data.response.username;
                            user.token = msg.token;
                        })
                            .catch((rejected) => {
                            console.log(`\t\x1b[31m Client ${msg.data.options.login} connection Error: \n\t${rejected}`);
                            socket.emit('Client Login Response', {
                                status: 'Server Error',
                                result: rejected
                            });
                        });
                    }
                    catch (e) {
                        console.log(`\t\x1b[31m Client ${msg.data.options.login} connection Error: \n\t${e}`);
                        socket.emit('Client Login Response', {
                            status: 'Server Error',
                            data: {
                                requestFor: msg.data.requestFor,
                                response: e
                            }
                        });
                    }
                }
            }));
            // Обработчик запросов для работы с постами
            socket.on('Get Posts Request', (msg) => __awaiter(void 0, void 0, void 0, function* () {
                switch (msg.data.requestFor) {
                    // Получить 4 поста, начиная с n-го (пагинация) и отправить
                    case 'get all posts': {
                        try {
                            console.log(`\n\x1b[33m User ${user.name} with ID=${user.id} is trying to get posts`);
                            console.log(`\tHe already have ${msg.data.options.postIDs.length} posts`);
                            // Получаем посты
                            postGetter.getAllPosts(msg.operation, msg.data.options.postIDs)
                                .then(postsPattern => {
                                // Затем для каждого получаем лайки
                                console.log(`\t\x1b[32m Server is look for ${postsPattern.length} posts`);
                                console.log(`\t\t\x1b[33m Gettin likes to posts ${postsPattern.map((post) => post.idPost)}`);
                                return Promise.all(postsPattern.map((post) => postGetter.getLikes(post, user)));
                            })
                                .then(postsWithLikes => {
                                // Затем для каждого получаем дизлайки
                                console.log(`\t\t\x1b[33m Gettin dislikes to posts ${postsWithLikes.map(post => post.idPost)}`);
                                return Promise.all(postsWithLikes.map(post => postGetter.getDisLikes(post, user)));
                            })
                                .then(postsWithFullRating => {
                                // Затем для каждого получаем фотографии
                                console.log(`\t\t\x1b[33m Gettin photoes to posts ${postsWithFullRating.map(post => post.idPost)}`);
                                return Promise.all(postsWithFullRating.map(post => postGetter.getPhotoes(post)));
                            })
                                .then(compiledPosts => {
                                // Отправляем
                                console.log(`\t\x1b[32m Successful parsing, sending posts...`);
                                console.log('parsed posts', compiledPosts);
                                socket.emit('Get Posts Response', {
                                    operation: msg.operation,
                                    status: 'OK',
                                    data: {
                                        requestFor: msg.data.requestFor,
                                        response: compiledPosts
                                    }
                                });
                            });
                        }
                        catch (e) {
                            console.log(`\t\x1b[31m Parsing post Error: \n\t${e}`);
                            socket.emit('Get Posts Response', {
                                operation: msg.operation,
                                status: 'Server Error',
                                data: {
                                    requestFor: msg.data.requestFor,
                                    response: e
                                }
                            });
                        }
                        break;
                    }
                    // Получить 4 публичных поста конкретного пользователя, начиная с n-го (пагинация) и отправить
                    case 'get user public posts': {
                        try {
                            console.log(`\n\x1b[33m User ${user.name} with ID=${user.id} is trying to get ${msg.data.options.username}'s posts`);
                            console.log(`\tHe already have ${msg.data.options.postIDs.length} posts`);
                            // Получаем посты
                            postGetter.getUserPublicPosts(msg.operation, msg.data.options.username, msg.data.options.postIDs)
                                .then(postsPattern => {
                                // Затем для каждого получаем лайки
                                console.log(`\t\x1b[32m Server is look for ${postsPattern.length} posts`);
                                console.log(`\t\t\x1b[33m Gettin likes to posts ${postsPattern.map((post) => post.idPost)}`);
                                return Promise.all(postsPattern.map((post) => postGetter.getLikes(post, user)));
                            })
                                .then(postsWithLikes => {
                                // Затем для каждого получаем дизлайки
                                console.log(`\t\t\x1b[33m Gettin dislikes to posts ${postsWithLikes.map(post => post.idPost)}`);
                                return Promise.all(postsWithLikes.map(post => postGetter.getDisLikes(post, user)));
                            })
                                .then(postsWithFullRating => {
                                // Затем для каждого получаем фотографии
                                console.log(`\t\t\x1b[33m Gettin photoes to posts ${postsWithFullRating.map(post => post.idPost)}`);
                                return Promise.all(postsWithFullRating.map(post => postGetter.getPhotoes(post)));
                            })
                                .then(compiledPosts => {
                                // Отправляем
                                console.log(`\t\x1b[32m Successful parsing, sending posts...`);
                                socket.emit('Get Posts Response', {
                                    operation: msg.operation,
                                    status: 'OK',
                                    data: {
                                        requestFor: msg.data.requestFor,
                                        response: compiledPosts
                                    }
                                });
                            });
                        }
                        catch (e) {
                            console.log(`\t\x1b[31m Parsing post Error: \n\t${e}`);
                            socket.emit('Get Posts Response', {
                                operation: msg.operation,
                                status: 'Server Error',
                                data: {
                                    requestFor: msg.data.requestFor,
                                    response: e
                                }
                            });
                        }
                        break;
                    }
                    // Получить 4 приватных поста конкретного пользователя, начиная с n-го (пагинация) и отправить
                    case 'get user private posts': {
                        try {
                            console.log(`\n\x1b[33m User ${user.name} with ID=${user.id} is trying to get ${msg.data.options.username}'s private posts`);
                            if (user.id !== msg.data.options.currentUser || user.name !== msg.data.options.username) {
                                console.log(`\x1b[0m Request Denied \x1b[31m '${msg.operation}'`);
                            }
                            else {
                                console.log(`\tHe already have ${msg.data.options.postIDs.length} posts`);
                                // Получаем посты
                                postGetter.getUserPrivatePosts(msg.operation, msg.data.options.username, msg.data.options.postIDs)
                                    .then(postsPattern => {
                                    // Затем для каждого получаем лайки
                                    console.log(`\t\x1b[32m Server is look for ${postsPattern.length} posts`);
                                    console.log(`\t\t\x1b[33m Gettin likes to posts ${postsPattern.map((post) => post.idPost)}`);
                                    return Promise.all(postsPattern.map((post) => postGetter.getLikes(post, user)));
                                })
                                    .then(postsWithLikes => {
                                    // Затем для каждого получаем дизлайки
                                    console.log(`\t\t\x1b[33m Gettin dislikes to posts ${postsWithLikes.map(post => post.idPost)}`);
                                    return Promise.all(postsWithLikes.map(post => postGetter.getDisLikes(post, user)));
                                })
                                    .then(postsWithFullRating => {
                                    // Затем для каждого получаем фотографии
                                    console.log(`\t\t\x1b[33m Gettin photoes to posts ${postsWithFullRating.map(post => post.idPost)}`);
                                    return Promise.all(postsWithFullRating.map(post => postGetter.getPhotoes(post)));
                                })
                                    .then(compiledPosts => {
                                    // Отправляем
                                    console.log(`\t\x1b[32m Successful parsing, sending posts...`);
                                    socket.emit('Get Posts Response', {
                                        operation: msg.operation,
                                        status: 'OK',
                                        data: {
                                            requestFor: msg.data.requestFor,
                                            response: compiledPosts
                                        }
                                    });
                                });
                            }
                        }
                        catch (e) {
                            console.log(`\t\x1b[31m Parsing post Error: \n\t${e}`);
                            socket.emit('Get Posts Response', {
                                operation: msg.operation,
                                status: 'Server Error',
                                data: {
                                    requestFor: msg.data.requestFor,
                                    response: e
                                }
                            });
                        }
                        break;
                    }
                    // Получить комментарии и отправить
                    case 'get comments': {
                        try {
                            console.log(`\n\x1b[33m User ${user.name} is trying to get comments to post #${msg.data.options.postIDs[0]}`);
                            postGetter.getComments(msg.data.options.postIDs[0])
                                .then((resolve) => {
                                console.log(`\t\x1b[32m Sending comments to post #${msg.data.options.postIDs[0]}...`);
                                const response = {
                                    operation: 'Post Editor Response',
                                    status: 'OK',
                                    data: {
                                        requestFor: msg.data.requestFor,
                                        response: resolve
                                    }
                                };
                                socket.emit('Get Posts Response', response);
                            });
                        }
                        catch (e) {
                            console.log(`\t\x1b[31m Get comments Error: \n\t${e}`);
                            socket.emit('Get Posts Response', { operation: msg.operation, status: 'Server Error', result: e });
                        }
                        break;
                    }
                    // Создать комментарий и отправить подтверждение/ошибку
                    case 'create comment': {
                        if (isCreateCommentData(msg.data.options)) {
                            try {
                                console.log(`\n\x1b[33m User ${user.name} is commenting post #${msg.data.options.postIDs[0]}`);
                                postSetter.createComment(msg.operation, msg.data.options)
                                    .then(resolve => {
                                    console.log(`\t\x1b[32m Comment to post #${msg.data.options.postIDs[0]} is created successful`);
                                    socket.emit('Get Posts Response', resolve);
                                })
                                    .catch(reject => {
                                    console.log(`\tComment to post #${msg.data.options.postIDs[0]} error!`);
                                    socket.emit('Get Posts Response', reject);
                                });
                            }
                            catch (e) {
                                console.log(`\t\x1b[31m Create post Error: \n\t${e}`);
                                socket.emit('Get Posts Response', {
                                    operation: msg.operation,
                                    status: 'Server Error',
                                    result: e
                                });
                            }
                        }
                        break;
                    }
                    // Если пришла неизвестная операция
                    default: {
                        console.log(`\x1b[0m Unknown operation \x1b[31m '${msg.operation}'`);
                        socket.emit('Get Posts Response', {
                            operation: msg.operation,
                            status: 'Unknown operation'
                        });
                    }
                }
            }));
            socket.on('Post Editor Request', (msg) => __awaiter(void 0, void 0, void 0, function* () {
                switch (msg.data.requestFor) {
                    case 'create post': {
                        console.log(`\n\x1b[33m User ${user.name} is trying to create new post...`);
                        postSetter.createPost(msg.operation, msg.data.options)
                            .then(() => {
                            console.log(`\t\x1b[32m Successful create post. Gettin ID post...`);
                            return postGetter
                                .getIDPost(msg.operation, msg.data.options.Name, msg.data.options.date, msg.data.options.idUser);
                        })
                            .then(idPost => {
                            console.log(`\t\x1b[32m Post ID is #${idPost}. \n Setting new photoes...`);
                            return postSetter
                                .settingPhotoes(msg.operation, idPost, msg.data.options);
                        })
                            .then(resolve => {
                            console.log(`\t\x1b[32m Success saved photoes on disk and DB...`);
                            socket.emit('Post Editor Response', resolve);
                        })
                            .catch(reject => {
                            console.log(`\t\x1b[31m Error when saving: ${reject}...`);
                            socket.emit('Post Editor Response', reject);
                        });
                        break;
                    }
                    case 'edit post': {
                        break;
                    }
                    // Если пришла неизвестная операция
                    default: {
                        console.log(`\x1b[0m Unknown operation \x1b[31m '${msg.operation}'`);
                        socket.emit('Post Editor Response', {
                            operation: msg.operation,
                            status: 'Unknown operation'
                        });
                    }
                }
            }));
            socket.on('disconnect', () => {
                console.log(`\t\x1b[36m User ${user.name} has been disconnected...`);
                socket.disconnect();
            });
        }
    }));
};
exports.default = Home;
//# sourceMappingURL=Home.js.map