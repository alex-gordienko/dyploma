const fs = require('fs');

class PostGetter{
    constructor(dbConnector, socket){
        this.dbConnector=dbConnector;
        this.socket = socket;
        // Директория с папками фотографий
        this.photoDirectory = `/srv/windows/dyploma/Photoes/`;
    }

    getAllPosts(requestedOperation, postIDs){
        let con = this.dbConnector;
        let socket = this.socket;
        return new Promise((resolve, reject)=>{
        //Запрос 1. Получение списка постов
        con.query(`SELECT Post.comment AS description, Post.date, Post.Name, Post.idPost, Post.lat, Post.lng, Post.type, Post.isPrivate, Users.username, Users.idUsers AS 'idUser' FROM Post JOIN Users WHERE Post.Users_idUsers=Users.idUsers LIMIT ${postIDs.length}, 4`, 
        async function(err,postsData){
            if(err) {
                socket.emit('Get Posts Response', {operation: requestedOperation, status: 'SQL Error', result: err})
            }
            else{
                let JSONpost = JSON.parse(JSON.stringify(postsData));
                await JSONpost.forEach(async(post,id)=>{
                    //Для каждого поста...
                    //Перевод координат в отдельный объект и удаление старых параметров
                    post.position = {lat:0,lng:0};
                    post.rating = {likes:0, dislikes: 0, isLikedByMe:false, isDislikedByMe:false};
                    post.photoes = [];
                    post.position.lat = post.lat;
                    post.position.lng = post.lng;
                    delete post.lat; delete post.lng;
                })
                resolve(JSONpost)
            }
        })
        })
    }

    getUserPublicPosts(requestedOperation, username, postIDs){
        let con = this.dbConnector;
        let socket = this.socket;
        return new Promise((resolve, reject)=>{
        //Запрос 1. Получение списка постов
        con.query(`SELECT Post.comment AS description, Post.date, Post.Name, Post.idPost, Post.lat, Post.lng, Post.type, Post.isPrivate, Users.username, Users.idUsers AS 'idUser' FROM Post JOIN Users WHERE Post.isPrivate=0 AND Post.Users_idUsers=Users.idUsers AND Users.username='${username}' LIMIT ${postIDs.length}, 4`, 
        async function(err,postsData){
            if(err) {
                socket.emit('Get Posts Response', {operation: requestedOperation, status: 'SQL Error', result: err})
            }
            else{
                let JSONpost = JSON.parse(JSON.stringify(postsData));
                await JSONpost.forEach(async(post,id)=>{
                    //Для каждого поста...
                    //Перевод координат в отдельный объект и удаление старых параметров
                    post.position = {lat:0,lng:0};
                    post.rating = {likes:0, dislikes: 0, isLikedByMe:false, isDislikedByMe:false};
                    post.photoes = [];
                    post.position.lat = post.lat;
                    post.position.lng = post.lng;
                    delete post.lat; delete post.lng;
                })
                resolve(JSONpost)
            }
        })
        })
    }

    getUserPrivatePosts(requestedOperation, username, postIDs){
        let con = this.dbConnector;
        let socket = this.socket;
        return new Promise((resolve, reject)=>{
        //Запрос 1. Получение списка постов
        con.query(`SELECT Post.comment AS description, Post.date, Post.Name, Post.idPost, Post.lat, Post.lng, Post.type, Post.isPrivate, Users.username, Users.idUsers AS 'idUser' FROM Post JOIN Users WHERE Post.isPrivate=1 AND Post.Users_idUsers=Users.idUsers AND Users.username='${username}' LIMIT ${postIDs.length}, 4`, 
        async function(err,postsData){
            if(err) {
                socket.emit('Get Posts Response', {operation: requestedOperation, status: 'SQL Error', result: err})
            }
            else{
                let JSONpost = JSON.parse(JSON.stringify(postsData));
                await JSONpost.forEach(async(post,id)=>{
                    //Для каждого поста...
                    //Перевод координат в отдельный объект и удаление старых параметров
                    post.position = {lat:0,lng:0};
                    post.rating = {likes:0, dislikes: 0, isLikedByMe:false, isDislikedByMe:false};
                    post.photoes = [];
                    post.position.lat = post.lat;
                    post.position.lng = post.lng;
                    delete post.lat; delete post.lng;
                })
                resolve(JSONpost)
            }
        })
        })
    }

    getLikes(post, user){
        let con = this.dbConnector;
        return new Promise((resolve, reject)=>{
            //Запрос 2. Получаем лайки
            con.query(`SELECT userId FROM Post_has_Rate JOIN Post WHERE Post.idPost=Post_has_Rate.postId AND Post_has_Rate.rating=1 AND Post_has_Rate.postId='${post.idPost}'`, 
            async function(err,likes){
                if(err) {
                    reject({operation: `Get Likes to post ${post.idPost}`, status: 'SQL Error', result: err})
                }
                else{
                    
                    let isLikedByMe = false;
                    let JSONlikes = JSON.parse(JSON.stringify(likes));

                    if(JSONlikes.length>0){
                        isLikedByMe = JSONlikes.find(like=> like.userId===user.id)!==undefined? true:false;
                        post.rating.likes=JSONlikes.length;
                        post.rating.isLikedByMe=isLikedByMe;
                    }
                    else {
                        post.rating.likes=0;
                        post.rating.isLikedByMe=false;
                    }
                    resolve(post)
                }
            })
        })
    }

    getDisLikes(post, user){
        let con = this.dbConnector;
        return new Promise((resolve, reject)=>{
            //Запрос 3. Получаем дизлайки
            con.query(`SELECT userId FROM Post_has_Rate JOIN Post WHERE Post.idPost=Post_has_Rate.postId AND Post_has_Rate.rating=-1 AND Post_has_Rate.postId='${post.idPost}'`, 
            async function(err,disLikes){
                if(err) {
                    reject({operation: `Get Dislikes to post ${post.idPost}`, status: 'SQL Error', result: err})
                }
                else{
                    let isDislikedByMe = false;
                    let JSONdislikes = JSON.parse(JSON.stringify(disLikes));

                    if(JSONdislikes.length>0){
                        isDislikedByMe = JSONdislikes.find(like=> like.userId===user.id)!==undefined? true:false;
                        post.rating.dislikes=JSONdislikes.length;
                        post.rating.isDislikedByMe=isDislikedByMe;
                    }
                    else {
                        post.rating.dislikes=0;
                        post.rating.isDislikedByMe=false;
                    }
                    resolve(post)
                }
            })
        })
    }

    getPhotoes (post){
        let con = this.dbConnector;
        let directory = this.photoDirectory;
        //Получаем base64 из файла
        const getBaseFromFile=(file)=>{
            var bitmap = fs.readFileSync(file);
            return new Buffer.from(bitmap).toString('base64');
        }

        return new Promise((resolve, reject)=>{
            //Запрос 4. Получаем названия фотографий для поста
            con.query(`SELECT fileName AS 'name' FROM Photoes JOIN Post 
            WHERE Post.idPost=Photoes.Post_idPost 
            AND Post.idPost='${post.idPost}'`, 
            async function(err,photoes){
                if(err) {
                    reject({operation: `Get Dislikes to post ${post.idPost}`, status: 'SQL Error', result: err})
                }
                else{                    
                    let JSONphotoes = JSON.parse(JSON.stringify(photoes));
                    await JSONphotoes.forEach((photo)=>{
                        post.photoes.push({
                            name: photo.name,
                            blob: 'data:image/jpeg;base64,'+getBaseFromFile(directory+`${post.idPost}/`+photo.name)
                        })
                    })

                    //Отправка результата наверх
                    resolve(post)
                }
            })
        })
    }

    getComments(operation, postID){
        return new Promise((resolve, reject)=>{
            this.dbConnector.query(`SELECT	Comments.Content AS 'content',
            Users.avatar AS 'userAvatar', 
            Users.username AS 'author',
            Users.rating AS 'userRating', 
            Comments.date,
            Comments.rating 
        FROM Comments JOIN Users JOIN Post 
        WHERE Comments.Post_idPost=Post.idPost 
        AND Comments.Users_idUsers=Users.idUsers 
        AND Post.idPost='${postID}'`, async function(err,commentsArray){
                    if(err) {
                        //Если ошибка подключения к бд
                        reject({operation, status: 'SQL Error', result: err});
                    }
                    else{
                        //Если подключился и запрос что-то вернул
                        let JSONcommentsArray = JSON.parse(JSON.stringify(commentsArray));
                        JSONcommentsArray.forEach((comment)=>{
                            //Если у пользователя есть аватарка, переводим её в base64
                            if(comment.userAvatar!==null) comment.userAvatar = Buffer.from(comment.userAvatar).toString();
                        })
                        if(JSONcommentsArray){
                            resolve({operation, status: 'OK', result: JSONcommentsArray});
                        }
                        else {
                            resolve({operation, status: 'Not Found', result: 'Not Found'});
                        }
                    }
                })
        })
    }

    getIDPost(postName, date, idUser){
        return new Promise((resolve, reject)=>{
            this.dbConnector.query(`SELECT idPost FROM Post WHERE Name ='${postName}' 
            AND date='${date}' 
            AND Users_idUsers='${idUser}'`, async function(err,idPost){
                    if(err) {
                        //Если ошибка подключения к бд
                        reject({operation, status: 'SQL Error', result: err});
                    }
                    else{
                        resolve(JSON.parse(JSON.stringify(idPost))[0].idPost)
                    }
                })
        })
    }

}


module.exports = PostGetter