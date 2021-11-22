// import ChatRoute from './ChatRoute';
import User from './DataParserScripts/userGetter';
import PostGetter from './DataParserScripts/postGetter';
import PostSetter from './DataParserScripts/postSetter';
import { Connection } from 'mysql2';
import http from 'http';
import https from 'https';
import { Server, Socket } from 'socket.io';
import { connectDB } from '..';

const isConnectedToDb = (con: any): con is Connection =>
    con.config !== undefined;

const isCreateCommentData = (data: any): data is api.models.ICreateCommentRequest =>
    data.content !== undefined

const Home = (server: https.Server | http.Server) => {
    const io = new Server(server, {
        serveClient: false,
        allowEIO3: true,
        pingTimeout: 60000,
        cors: {
            origin: '*',
            credentials: true
        }
    });

    io.sockets.on('connection', async (socket: Socket) => {
        console.log('\n\x1b[0m New connection');
        // Для каждого сокета создаётся экземпляр коннектора БД, пользователя и парсера
        const con = await connectDB();

        if (!con) {
            socket.emit('Client Login Response',
                {
                    status: 'Server Error',
                    data: {
                        requestFor: 'Connection',
                        response: 'Can\'t connect to db'
                     }
                });
            socket.disconnect();
        }

        if (isConnectedToDb(con)) {
            const user = new User(con);
            const postGetter = new PostGetter(con, socket);
            const postSetter = new PostSetter(con, socket);
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
            socket.on<socket.AvailableRequestRoutes>('Client Login Request',
                async (msg: socket.ISocketRequest<api.models.ILoginRequest, api.models.IAvailableUserActions>) => {
                    if (msg.data.options.login && msg.data.options.login !== '') {
                        console.log(`\x1b[33m Client ${msg.data.options.login} is connecting...`);
                        socket.join(msg.token);
                        try {
                            user.Login(msg.data.options)
                                .then((result: socket.ISocketResponse<api.models.IUser, api.models.IAvailableUserActions>) => {
                                    console.log(`\t\x1b[32m Client ${msg.data.options.login} with token ${msg.token} is connected succesfully`);
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'Client Login Response',
                                        result
                                    );
                                    user.id = result.data.response.idUsers;
                                    user.name = result.data.response.username;
                                    user.token = msg.token;
                                })
                                .catch((rejected) => {
                                    console.log(`\t\x1b[31m Client ${msg.data.options.login} connection Error: \n\t${rejected}`);
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'Client Login Response', rejected
                                    )
                                });
                        }
                        catch (e) {
                            console.log(`\t\x1b[31m Client ${msg.data.options.login} connection Error: \n\t${e}`);
                            socket.emit<socket.AvailableResponseRoutes>(
                                'Client Login Response',
                                {
                                    status: 'Server Error',
                                    data: {
                                        requestFor: msg.data.requestFor,
                                        response: e
                                    }
                                })
                        }
                    }
                });

            socket.on<socket.AvailableRequestRoutes>('User Editor Request',
                async (msg: socket.ISocketRequest<api.models.IUser, api.models.IAvailableUserActions>) => {
                    switch (msg.data.requestFor) {
                        case 'Edit User': {
                            console.log(`\n\x1b[33m User ${user.name} want's to change info about himself`);
                            user.editUser(user.id, msg.data.options)
                                .then(resolve => {
                                    return user.getUser(resolve.data.response.idUsers)
                                })
                                .then(updatedUserData => {
                                    const response: socket.ISocketResponse<api.models.IUser, api.models.IAvailableUserActions> = {
                                        operation: 'User Editor Response',
                                        status: 'OK',
                                        data: {
                                            requestFor: 'Edit User',
                                            response: updatedUserData
                                        }
                                    }
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'User Editor Response', response
                                    )
                                }).catch(rejected => {
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'User Editor Response', rejected)
                                })
                        }
                    }
            })

            // Обработчик запросов для работы с постами
            socket.on<socket.AvailableRequestRoutes>('Get Posts Request',
                async (msg: socket.ISocketRequest<api.models.IGetPostsRequest, api.models.IAvailablePostActions>) => {
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
                                        console.log(`\t\t\x1b[33m Gettin likes to posts ${postsPattern.map((post: data.IPost) => post.idPost)}`)
                                        return Promise.all(postsPattern.map((post: any) => postGetter.getLikes(post, user)))
                                    })
                                    .then(postsWithLikes => {
                                        // Затем для каждого получаем дизлайки
                                        console.log(`\t\t\x1b[33m Gettin dislikes to posts ${postsWithLikes.map(post => post.idPost)}`)
                                        return Promise.all(postsWithLikes.map(post => postGetter.getDisLikes(post, user)))
                                    })
                                    .then(postsWithFullRating => {
                                        // Затем для каждого получаем фотографии
                                        console.log(`\t\t\x1b[33m Gettin photoes to posts ${postsWithFullRating.map(post => post.idPost)}`)
                                        return Promise.all(postsWithFullRating.map(post => postGetter.getPhotoes(post)))
                                    })
                                    .then(compiledPosts => {
                                        // Отправляем
                                        console.log(`\t\x1b[32m Successful parsing, sending posts...`);
                                        socket.emit<socket.AvailableResponseRoutes>(
                                            'Get Posts Response',
                                            {
                                                operation: msg.operation,
                                                status: 'OK',
                                                data: {
                                                    requestFor: msg.data.requestFor,
                                                    response: compiledPosts
                                                }
                                            })
                                    })
                            } catch (e) {
                                console.log(`\t\x1b[31m Parsing post Error: \n\t${e}`);
                                socket.emit<socket.AvailableResponseRoutes>(
                                    'Get Posts Response',
                                    {
                                        operation: msg.operation,
                                        status: 'Server Error',
                                        data: {
                                            requestFor: msg.data.requestFor,
                                            response: e
                                        }
                                    })
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
                                        console.log(`\t\t\x1b[33m Gettin likes to posts ${postsPattern.map((post: { idPost: any; }) => post.idPost)}`)
                                        return Promise.all(postsPattern.map((post: any) => postGetter.getLikes(post, user)))
                                    })
                                    .then(postsWithLikes => {
                                        // Затем для каждого получаем дизлайки
                                        console.log(`\t\t\x1b[33m Gettin dislikes to posts ${postsWithLikes.map(post => post.idPost)}`)
                                        return Promise.all(postsWithLikes.map(post => postGetter.getDisLikes(post, user)))
                                    })
                                    .then(postsWithFullRating => {
                                        // Затем для каждого получаем фотографии
                                        console.log(`\t\t\x1b[33m Gettin photoes to posts ${postsWithFullRating.map(post => post.idPost)}`)
                                        return Promise.all(postsWithFullRating.map(post => postGetter.getPhotoes(post)))
                                    })
                                    .then(compiledPosts => {
                                        // Отправляем
                                        console.log(`\t\x1b[32m Successful parsing, sending posts...`);
                                        socket.emit<socket.AvailableResponseRoutes>(
                                            'Get Posts Response',
                                            {
                                                operation: msg.operation,
                                                status: 'OK',
                                                data: {
                                                    requestFor: msg.data.requestFor,
                                                    response: compiledPosts
                                                }
                                            })
                                    })
                            } catch (e) {
                                console.log(`\t\x1b[31m Parsing post Error: \n\t${e}`);
                                socket.emit<socket.AvailableResponseRoutes>(
                                    'Get Posts Response',
                                    {
                                        operation: msg.operation,
                                        status: 'Server Error',
                                        data: {
                                            requestFor: msg.data.requestFor,
                                            response: e
                                        }
                                    })
                            }
                            break;

                        }

                        // Получить 4 приватных поста конкретного пользователя, начиная с n-го (пагинация) и отправить
                        case 'get user private posts': {
                            try {
                                console.log(`\n\x1b[33m User ${user.name} with ID=${user.id} is trying to get ${msg.data.options.username}'s private posts`);
                                if (user.id !== msg.data.options.currentUser || user.name !== msg.data.options.username) {
                                    console.log(`\x1b[0m Request Denied \x1b[31m '${msg.operation}'`)
                                }
                                else {
                                    console.log(`\tHe already have ${msg.data.options.postIDs.length} posts`);
                                    // Получаем посты
                                    postGetter.getUserPrivatePosts(msg.operation, msg.data.options.username, msg.data.options.postIDs)
                                        .then(postsPattern => {
                                            // Затем для каждого получаем лайки
                                            console.log(`\t\x1b[32m Server is look for ${postsPattern.length} posts`);
                                            console.log(`\t\t\x1b[33m Gettin likes to posts ${postsPattern.map((post: { idPost: any; }) => post.idPost)}`)
                                            return Promise.all(postsPattern.map((post: any) => postGetter.getLikes(post, user)))
                                        })
                                        .then(postsWithLikes => {
                                            // Затем для каждого получаем дизлайки
                                            console.log(`\t\t\x1b[33m Gettin dislikes to posts ${postsWithLikes.map(post => post.idPost)}`)
                                            return Promise.all(postsWithLikes.map(post => postGetter.getDisLikes(post, user)))
                                        })
                                        .then(postsWithFullRating => {
                                            // Затем для каждого получаем фотографии
                                            console.log(`\t\t\x1b[33m Gettin photoes to posts ${postsWithFullRating.map(post => post.idPost)}`)
                                            return Promise.all(postsWithFullRating.map(post => postGetter.getPhotoes(post)))
                                        })
                                        .then(compiledPosts => {
                                            // Отправляем
                                            console.log(`\t\x1b[32m Successful parsing, sending posts...`);
                                            socket.emit<socket.AvailableResponseRoutes>(
                                                'Get Posts Response',
                                                {
                                                    operation: msg.operation,
                                                    status: 'OK',
                                                    data: {
                                                        requestFor: msg.data.requestFor,
                                                        response: compiledPosts
                                                    }
                                                })
                                        })
                                }
                            } catch (e) {
                                console.log(`\t\x1b[31m Parsing post Error: \n\t${e}`);
                                socket.emit<socket.AvailableResponseRoutes>(
                                    'Get Posts Response',
                                    {
                                        operation: msg.operation,
                                        status: 'Server Error',
                                        data: {
                                            requestFor: msg.data.requestFor,
                                            response: e
                                        }
                                    })
                            }
                            break;
                        }

                        // Если пришла неизвестная операция
                        default: {
                            console.log(`\x1b[0m Unknown operation \x1b[31m '${msg.operation}'`)
                            socket.emit<socket.AvailableResponseRoutes>(
                                'Get Posts Response',
                                {
                                    operation: msg.operation,
                                    status: 'Unknown operation'
                                })
                        }
                    }

                });

            socket.on<socket.AvailableRequestRoutes>('Comments Request',
                async (msg: socket.ISocketRequest<api.models.IGetPostsRequest, api.models.IAvailablePostActions>) => {
                    switch (msg.data.requestFor) {
                        // Получить комментарии и отправить
                        case 'get comments': {
                            try {
                                console.log(`\n\x1b[33m User ${user.name} is trying to get comments to post #${msg.data.options.postIDs[0]}`);
                                postGetter.getComments(msg.data.options.postIDs[0])
                                    .then((resolve) => {
                                        console.log(`\t\x1b[32m Sending comments to post #${msg.data.options.postIDs[0]}...`);
                                        const response: socket.ISocketResponse<data.IPostComment[], api.models.IAvailablePostActions> = {
                                            operation: 'Post Editor Response',
                                            status: 'OK',
                                            data: {
                                                requestFor: msg.data.requestFor,
                                                response: resolve
                                            }
                                        };
                                        socket.emit<socket.AvailableResponseRoutes>(
                                            'Comments Response',
                                            response
                                        )
                                    })
                            }
                            catch (e) {
                                console.log(`\t\x1b[31m Get comments Error: \n\t${e}`);
                                socket.emit<socket.AvailableResponseRoutes>(
                                    'Comments Response',
                                    {
                                        operation: msg.operation,
                                        status: 'Server Error',
                                        result: e
                                    })
                            }
                            break;
                        }
                        // Создать комментарий и отправить подтверждение/ошибку
                        case 'create comment': {
                            if (isCreateCommentData(msg.data.options)) {
                                try {
                                    console.log(`\n\x1b[33m User ${user.name} is commenting post #${msg.data.options.idPost}`);
                                    postSetter.createComment(msg.operation, msg.data.options)
                                        .then(resolve => {
                                            if (isCreateCommentData(msg.data.options))
                                                console.log(`\t\x1b[32m Comment to post #${msg.data.options.idPost} is created successful`);
                                            const response: socket.ISocketResponse<null, api.models.IAvailablePostActions> = {
                                                operation: 'Comments Response',
                                                status: resolve.status,
                                                data: {
                                                    requestFor: msg.data.requestFor,
                                                    response: null
                                                }
                                            };
                                            socket.emit<socket.AvailableResponseRoutes>(
                                                'Comments Response',
                                                response
                                            );
                                        })
                                        .catch(reject => {
                                            if (isCreateCommentData(msg.data.options))
                                                console.log(`\tComment to post #${msg.data.options.idPost} error!`);
                                            socket.emit<socket.AvailableResponseRoutes>(
                                                'Comments Response',
                                                reject
                                            )
                                        })
                                }
                                catch (e) {
                                    console.log(`\t\x1b[31m Create post Error: \n\t${e}`);
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'Comments Response',
                                        {
                                            operation: msg.operation,
                                            status: 'Server Error',
                                            result: e
                                        })
                                }
                            }
                            break;
                        }
                        default: {
                            console.log(`\x1b[0m Unknown operation \x1b[31m '${msg.operation}'`)
                            socket.emit<socket.AvailableResponseRoutes>(
                                'Comments Response',
                                {
                                    operation: msg.operation,
                                    status: 'Unknown operation'
                                })
                        }
                    }
                });

            socket.on<socket.AvailableRequestRoutes>('Post Editor Request',
                async (msg: socket.ISocketRequest<
                    api.models.IPost | api.models.IGetPostToEditRequest,
                    api.models.IAvailablePostActions
                >
                ) => {
                    switch (msg.data.requestFor) {
                        case 'get one post': {
                            const typedMessage = msg as socket.ISocketRequest<
                                api.models.IGetPostToEditRequest,
                                api.models.IAvailablePostActions>
                            try {
                                console.log(`\n\x1b[33m User ${user.name} with ID=${user.id} is trying to get post to edit`);
                                // Получаем посты
                                postGetter.getOnePost(msg.operation, typedMessage.data.options.postID, Number(user.id))
                                    .then(postPattern => {
                                        console.log(postPattern);
                                        // Затем для каждого получаем лайки
                                        console.log(`\t\t\x1b[33m Gettin likes to post ${postPattern.idPost}`)
                                        return postGetter.getLikes(postPattern, user)
                                    })
                                    .then(postWithLikes => {
                                        // Затем для каждого получаем дизлайки
                                        console.log(`\t\t\x1b[33m Gettin dislikes to post ${postWithLikes.idPost}`)
                                        return postGetter.getDisLikes(postWithLikes, user)
                                    })
                                    .then(postWithFullRating => {
                                        // Затем для каждого получаем фотографии
                                        console.log(`\t\t\x1b[33m Gettin photoes to post ${postWithFullRating.idPost}`)
                                        return postGetter.getPhotoes(postWithFullRating)
                                    })
                                    .then(compiledPost => {
                                        // Отправляем
                                        console.log(`\t\x1b[32m Successful parsing, sending posts...`);
                                        socket.emit<socket.AvailableResponseRoutes>(
                                            'Post Editor Response',
                                            {
                                                operation: typedMessage.operation,
                                                status: 'OK',
                                                data: {
                                                    requestFor: typedMessage.data.requestFor,
                                                    response: compiledPost
                                                }
                                            })
                                    })
                            } catch (e) {
                                console.log(`\t\x1b[31m Parsing post Error: \n\t${e}`);
                                socket.emit<socket.AvailableResponseRoutes>(
                                    'Post Editor Response',
                                    {
                                        operation: msg.operation,
                                        status: 'Server Error',
                                        data: {
                                            requestFor: msg.data.requestFor,
                                            response: e
                                        }
                                    })
                            }
                            break;
                        }
                        case 'create post': {
                            const typedMessage = msg as socket.ISocketRequest<
                                api.models.IPost,
                                api.models.IAvailablePostActions>
                            console.log(`\n\x1b[33m User ${user.name} is trying to create new post...`);
                            postSetter.createPost(typedMessage.operation, typedMessage.data.options)
                                .then(() => {
                                    console.log(`\t\x1b[32m Successful create post. Gettin ID post...`);
                                    return postGetter
                                        .getIDPost(
                                            typedMessage.operation,
                                            typedMessage.data.options.Name,
                                            typedMessage.data.options.date,
                                            typedMessage.data.options.idUser
                                        )
                                })
                                .then(idPost => {
                                    console.log(`\t\x1b[32m Post ID is #${idPost}. \n Setting new photoes...`);
                                    return postSetter
                                        .settingPhotoes(
                                            typedMessage.operation,
                                            idPost,
                                            typedMessage.data.options
                                        )
                                })
                                .then(resolve => {
                                    console.log(`\t\x1b[32m Success saved photoes on disk and DB...`);
                                    const response: socket.ISocketResponse<null, api.models.IAvailablePostActions> = {
                                        operation: 'Post Editor Response',
                                        status: resolve.status,
                                        data: {
                                            requestFor: msg.data.requestFor,
                                            response: null
                                        }
                                    };
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'Post Editor Response',
                                        response
                                    )
                                })
                                .catch(reject => {
                                    console.log(`\t\x1b[31m Error when saving: ${reject}...`);
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'Post Editor Response',
                                        reject
                                    )
                                })
                            break;
                        }
                        case 'edit post': {

                            break;
                        }
                        // Если пришла неизвестная операция
                        default: {
                            console.log(`\x1b[0m Unknown operation \x1b[31m '${msg.operation}'`)
                            socket.emit<socket.AvailableResponseRoutes>(
                                'Post Editor Response',
                                {
                                    operation: msg.operation,
                                    status: 'Unknown operation'
                                })
                        }
                    }
                });

            socket.on<socket.AvailableRequestRoutes>('Rating Request',
                async (msg: socket.ISocketRequest<api.models.ISetPostRatingRequest, api.models.IAvailableRatingActions>
                ) => {
                    switch (msg.data.requestFor) {
                        case 'set post rating': {
                            console.log(`\n\x1b[33m User ${user.name} is trying to set ${msg.data.options.setting}...`);
                            postSetter.setPostRating(msg.operation, msg.data.options)
                                .then(_setRatingResponse => {
                                    return postGetter.getLikes(
                                            { idPost: msg.data.options.idPost },
                                            user)
                                })
                                .then(postLikes => {
                                    return postGetter.getDisLikes(
                                        {
                                            idPost: msg.data.options.idPost,
                                            rating: postLikes.rating
                                        },
                                        user
                                    )
                                }).then(postRating => {
                                    const response = {
                                        operation: msg.operation,
                                        status: 'OK',
                                        data: {
                                            requestFor: msg.data.requestFor,
                                            response: postRating,
                                        }
                                    };
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'Rating Response',
                                        response
                                    )
                                }).catch(err => {
                                    console.log(`\t\x1b[31m Error when set post rating: ${JSON.stringify(err)}...`);
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'Rating Response',
                                        err
                                    )
                                });
                            break;
                        }
                        default: {
                            console.log(`\x1b[0m Unknown operation \x1b[31m '${msg.operation}'`);
                            socket.emit<socket.AvailableResponseRoutes>(
                                'Rating Response',
                                {
                                    operation: msg.operation,
                                    status: 'Unknown operation',
                                    data: {
                                        requestFor: msg.data.requestFor,
                                        response: 'unknown operation'
                                    }
                                })
                        }
                    }
                })

            socket.on<socket.AvailableRequestRoutes>('User Searcher Request',
                async (msg: socket.ISocketRequest<api.models.ISearchUserRequest, api.models.IAvailableUserActions>
                ) => {
                    switch (msg.data.requestFor) {
                        case 'Search Peoples': {
                            console.log(`\n\x1b[33m User ${user.name} is trying to search users...`);
                            user.searchPeople(msg.data.options, user.id)
                                .then(result => {
                                    console.log(`\t\x1b[32m Found ${result.data.response.length} results...`);
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'User Searcher Response',
                                        result
                                    )
                                })
                                .catch(rejected => {
                                    console.log(`\t\x1b[31m Error when search: ${rejected.data.response}...`);
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'User Searcher Response',
                                        rejected
                                    )
                                })
                            break;
                        }
                        case 'Search User': {
                            console.log(`\n\x1b[33m User ${user.name} is trying to load ${msg.data.options.searchedUser}'s profile...`);
                            user.loadUserProfile(msg.data.options)
                                .then(searchResult => {
                                    console.log(`\t\x1b[32m Found user. Sending result...`);
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'User Searcher Response',
                                        searchResult
                                    )
                                })
                                .catch(rejected => {
                                    console.log(`\t\x1b[31m Error when search: ${JSON.stringify(rejected)}...`);
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'User Searcher Response',
                                        rejected
                                    )
                                });
                            break;
                        }
                        case 'Search Friends': {
                            console.log(`\n\x1b[33m User ${user.name} is trying to load ${msg.data.options.searchedUser}'s friendList...`);
                            user.searchFriends(msg.data.options)
                                .then(searchResult => {
                                    console.log(`\t\x1b[32m Found user. Sending result...`);
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'User Searcher Response',
                                        searchResult
                                    )
                                })
                                .catch(rejected => {
                                    console.log(`\t\x1b[31m Error when search: ${JSON.stringify(rejected)}...`);
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'User Searcher Response',
                                        rejected
                                    )
                                });
                            break;
                        }
                        case 'Search Invites': {
                            console.log(`\n\x1b[33m User ${user.name} is trying to load inviteList...`);
                            user.searchInvites(msg.data.options, user.id)
                                .then(searchResult => {
                                    console.log(`\t\x1b[32m Found users. Sending result...`);
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'User Searcher Response',
                                        searchResult
                                    )
                                })
                                .catch(rejected => {
                                    console.log(`\t\x1b[31m Error when search: ${JSON.stringify(rejected)}...`);
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'User Searcher Response',
                                        rejected
                                    )
                                });
                            break;
                        }
                        case 'Search Blocked': {
                           console.log(`\n\x1b[33m User ${user.name} is trying to load blockList...`);
                            user.searchBlocked(msg.data.options, user.id)
                                .then(searchResult => {
                                    console.log(`\t\x1b[32m Found users. Sending result...`);
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'User Searcher Response',
                                        searchResult
                                    )
                                })
                                .catch(rejected => {
                                    console.log(`\t\x1b[31m Error when search: ${JSON.stringify(rejected)}...`);
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'User Searcher Response',
                                        rejected
                                    )
                                });
                            break;
                        }
                        default: {
                            console.log(`\x1b[0m Unknown operation \x1b[31m '${msg.operation}'`);
                            socket.emit<socket.AvailableResponseRoutes>(
                                'User Searcher Response',
                                {
                                    operation: msg.operation,
                                    status: 'Unknown operation'
                                })
                        }
                    }
                })

            socket.on('disconnect', () => {
                console.log(`\t\x1b[36m User ${user.name} has been disconnected...`)
                socket.disconnect();
            })
        }
    })
};

export default Home;