var mysql = require('mysql');
const fs = require('fs');
const ChatRoute = require('./ChatRoute');

const User = require('./DataParserScripts/userGetter');
const PostGetter = require('./DataParserScripts/postGetter');
const PostSetter = require('./DataParserScripts/postSetter');

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

const Home = (server)=>{
    const io = require('socket.io')(server, {serveClient: false, pingTimeout:60000});

    io.on('connection', async socket =>{
        console.log('\n\x1b[0m New connection');
        //Для каждого сокета создаётся экземпляр коннектора БД, пользователя и парсера 
        const con = await connectDB();
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

        //Подключаем кусок обработчиков для чата
        ChatRoute(socket, con);        

        //Обработчик запросов для авторизации
        socket.on('Client Login Request', async msg =>{
            if(msg.login && msg.login!==''){
                console.log(`\x1b[33m Client ${msg.login} is connecting...`);
                socket.join(msg.token);
                try{
                    user.Login(msg)
                        .then((result)=>{
                            console.log(`\t\x1b[32m Client ${msg.login} with token ${msg.token} is connected succesfully`);
                            socket.emit('Client Login Response', result);
                            user.id = result.result.idUsers;
                            user.name = result.result.username;
                            user.token = msg.token;
                        })
                        .catch((rejected)=>{
                            console.log(`\t\x1b[31m Client ${msg.login} connection Error: \n\t${rejected}`);
                            socket.emit('Client Login Response', {'status': 'Server Error', 'result': rejected})
                        });
                }
                catch(e){
                    console.log(`\t\x1b[31m Client ${msg.login} connection Error: \n\t${e}`);
                    socket.emit('Client Login Response', {'status': 'Server Error', 'result': e})
                }
            }            
        });

        //Обработчик запросов для работы с постами
        socket.on('Get Posts Request', async msg =>{
            switch (msg.operation) {
                //Получить 4 поста, начиная с n-го (пагинация) и отправить
                case 'get all posts':{
                    try{
                        console.log(`\n\x1b[33m User ${user.name} with ID=${user.id} is trying to get posts`);
                        console.log(`\tHe already have ${msg.postIDs.length} posts`);
                        // Получаем посты
                        postGetter.getAllPosts(msg.operation, msg.postIDs)
                            .then(postsPattern=>{
                                // Затем для каждого получаем лайки
                                console.log(`\t\x1b[32m Server is look for ${postsPattern.length} posts`);
                                console.log(`\t\t\x1b[33m Gettin likes to posts ${postsPattern.map(post=>post.idPost)}`)
                                return Promise.all(postsPattern.map(post=> postGetter.getLikes(post, user)))
                            })
                            .then(postsWithLikes=>{
                                // Затем для каждого получаем дизлайки
                                console.log(`\t\t\x1b[33m Gettin dislikes to posts ${postsWithLikes.map(post=>post.idPost)}`)
                                return Promise.all(postsWithLikes.map(post=> postGetter.getDisLikes(post, user)))
                            })
                            .then(postsWithFullRating=>{
                                // Затем для каждого получаем фотографии
                                console.log(`\t\t\x1b[33m Gettin photoes to posts ${postsWithFullRating.map(post=>post.idPost)}`)
                                return Promise.all(postsWithFullRating.map(post=> postGetter.getPhotoes(post)))
                            })
                            .then(compiledPosts=>{
                                // Отправляем
                                console.log(`\t\x1b[32m Successful parsing, sending posts...`);
                                socket.emit('Get Posts Response', {operation: msg.operation, status: 'OK', result: compiledPosts})
                            })
                    } catch(e){
                        console.log(`\t\x1b[31m Parsing post Error: \n\t${e}`);
                        socket.emit('Get Posts Response', {operation: msg.operation, status: 'Server Error', result: e})
                    }
                    break;
                }

                //Получить 4 публичных поста конкретного пользователя, начиная с n-го (пагинация) и отправить
                case 'get user public posts':{
                    try{
                        console.log(`\n\x1b[33m User ${user.name} with ID=${user.id} is trying to get ${msg.json.username}'s posts`);
                        console.log(`\tHe already have ${msg.json.postIDs.length} posts`);
                        // Получаем посты
                        postGetter.getUserPublicPosts(msg.operation, msg.json.username, msg.json.postIDs)
                            .then(postsPattern=>{
                                // Затем для каждого получаем лайки
                                console.log(`\t\x1b[32m Server is look for ${postsPattern.length} posts`);
                                console.log(`\t\t\x1b[33m Gettin likes to posts ${postsPattern.map(post=>post.idPost)}`)
                                return Promise.all(postsPattern.map(post=> postGetter.getLikes(post, user)))
                            })
                            .then(postsWithLikes=>{
                                // Затем для каждого получаем дизлайки
                                console.log(`\t\t\x1b[33m Gettin dislikes to posts ${postsWithLikes.map(post=>post.idPost)}`)
                                return Promise.all(postsWithLikes.map(post=> postGetter.getDisLikes(post, user)))
                            })
                            .then(postsWithFullRating=>{
                                // Затем для каждого получаем фотографии
                                console.log(`\t\t\x1b[33m Gettin photoes to posts ${postsWithFullRating.map(post=>post.idPost)}`)
                                return Promise.all(postsWithFullRating.map(post=> postGetter.getPhotoes(post)))
                            })
                            .then(compiledPosts=>{
                                // Отправляем
                                console.log(`\t\x1b[32m Successful parsing, sending posts...`);
                                socket.emit('Get Posts Response', {operation: msg.operation, status: 'OK', result: compiledPosts})
                            })
                    } catch(e){
                        console.log(`\t\x1b[31m Parsing post Error: \n\t${e}`);
                        socket.emit('Get Posts Response', {operation: msg.operation, status: 'Server Error', result: e})
                    }
                    break;

                }

                //Получить 4 приватных поста конкретного пользователя, начиная с n-го (пагинация) и отправить
                case 'get user private posts':{
                    try{
                        console.log(`\n\x1b[33m User ${user.name} with ID=${user.id} is trying to get ${msg.json.username}'s private posts`);
                        if(user.id!==msg.json.currentUser || user.name!==msg.json.username){
                            console.log(`\x1b[0m Request Denied \x1b[31m '${msg.operation}'`)
                        }
                        else{
                            console.log(`\tHe already have ${msg.json.postIDs.length} posts`);
                            // Получаем посты
                            postGetter.getUserPrivatePosts(msg.operation, msg.json.username, msg.json.postIDs)
                                .then(postsPattern=>{
                                    // Затем для каждого получаем лайки
                                    console.log(`\t\x1b[32m Server is look for ${postsPattern.length} posts`);
                                    console.log(`\t\t\x1b[33m Gettin likes to posts ${postsPattern.map(post=>post.idPost)}`)
                                    return Promise.all(postsPattern.map(post=> postGetter.getLikes(post, user)))
                                })
                                .then(postsWithLikes=>{
                                    // Затем для каждого получаем дизлайки
                                    console.log(`\t\t\x1b[33m Gettin dislikes to posts ${postsWithLikes.map(post=>post.idPost)}`)
                                    return Promise.all(postsWithLikes.map(post=> postGetter.getDisLikes(post, user)))
                                })
                                .then(postsWithFullRating=>{
                                    // Затем для каждого получаем фотографии
                                    console.log(`\t\t\x1b[33m Gettin photoes to posts ${postsWithFullRating.map(post=>post.idPost)}`)
                                    return Promise.all(postsWithFullRating.map(post=> postGetter.getPhotoes(post)))
                                })
                                .then(compiledPosts=>{
                                    // Отправляем
                                    console.log(`\t\x1b[32m Successful parsing, sending posts...`);
                                    socket.emit('Get Posts Response', {operation: msg.operation, status: 'OK', result: compiledPosts})
                                })
                        }
                    } catch(e){
                        console.log(`\t\x1b[31m Parsing post Error: \n\t${e}`);
                        socket.emit('Get Posts Response', {operation: msg.operation, status: 'Server Error', result: e})
                    }
                    break;
                }

                //Получить комментарии и отправить
                case 'get comments':{
                    try{
                        console.log(`\n\x1b[33m User ${user.name} is trying to get comments to post #${msg.postID}`);
                        postGetter.getComments(msg.operation,msg.postID)
                            .then((resolve)=>{
                                console.log(`\t\x1b[32m Sending comments to post #${msg.postID}...`)
                                socket.emit('Get Posts Response', resolve)
                            })
                    }
                    catch(e){
                        console.log(`\t\x1b[31m Get comments Error: \n\t${e}`);
                        socket.emit('Get Posts Response', {operation: msg.operation, status: 'Server Error', result: e})
                    }
                    break;
                }
                //Создать комментарий и отправить подтверждение/ошибку
                case 'create comment':{
                    try{
                        console.log(`\n\x1b[33m User ${user.name} is commenting post #${msg.json.idPost}`);
                        postSetter.createComment(msg.operation,msg.json)
                            .then(resolve=>{
                                console.log(`\t\x1b[32m Comment to post #${msg.json.idPost} is created successful`);
                                socket.emit('Get Posts Response', resolve)
                            })
                            .catch(reject=>{
                                console.log(`\tComment to post #${msg.json.idPost} error!`);
                                socket.emit('Get Posts Response', reject)
                            })
                    }
                    catch(e){
                        console.log(`\t\x1b[31m Create post Error: \n\t${e}`);
                        socket.emit('Get Posts Response', {operation: msg.operation, status: 'Server Error', result: e})
                    }
                    break;
                }
                
                //Если пришла неизвестная операция
                default:{
                    console.log(`\x1b[0m Unknown operation \x1b[31m '${msg.operation}'`)
                    socket.emit('Get Posts Response', {operation: msg.operation, status: 'Unknown operation'})
                }
            }

        })

        socket.on('Post Editor Request', async msg=>{
            switch (msg.operation){
                case 'create post':{
                    console.log(`\n\x1b[33m User ${user.name} is trying to create new post...`);
                    postSetter.createPost(msg.operation, msg.json)
                        .then(()=>{
                            console.log(`\t\x1b[32m Successful create post. Gettin ID post...`);
                            return postGetter.getIDPost(msg.json.Name, msg.json.date, msg.json.idUser)
                        })
                        .then(idPost=>{
                            console.log(`\t\x1b[32m Post ID is #${idPost}. \n Setting new photoes...`);
                            return postSetter.settingPhotoes(msg.operation, idPost, msg.json)
                        })
                        .then(resolve=>{
                            console.log(`\t\x1b[32m Success saved photoes on disk and DB...`);
                            socket.emit('Post Editor Response', resolve)
                        })
                        .catch(reject=>{
                            console.log(`\t\x1b[31m Error when saving: ${reject}...`);
                            socket.emit('Post Editor Response', reject)
                        })
                    break;
                }
                case 'edit post':{

                    break;
                }
                //Если пришла неизвестная операция
                default:{
                    console.log(`\x1b[0m Unknown operation \x1b[31m '${msg.operation}'`)
                    socket.emit('Post Editor Response', {operation: msg.operation, status: 'Unknown operation'})
                }
            }
        })

        socket.on('typing', msg =>{
            console.log(msg.user+' is typing in room '+msg.room);
            socket.broadcast.to(msg.room).emit('onTyping', {'room':msg.room, 'typing':msg.user});
        });

        socket.on('edit chat', async msg=>{
            
        })

        socket.on('disconnect', ()=>{
            console.log(`\t\x1b[36m User ${user.name} has been disconnected...`)
            socket.disconnect();
        })
    })
};

module.exports = Home;