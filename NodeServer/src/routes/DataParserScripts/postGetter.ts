import { Connection } from 'mysql2';
import { Socket } from 'socket.io';
import User from './userGetter';
import { getBaseFromFile, parseData, toDataPost } from './utils';

class PostGetter {
    protected dbConnector: Connection;
    protected socket: Socket;
    // Директория с папками фотографий
    protected readonly photoDirectory = `/srv/windows/dyploma/Photoes/`;

    constructor(dbConnector: Connection, socket: Socket){
        this.dbConnector = dbConnector;
        this.socket = socket;
    }

    public async getOnePost(
        requestedOperation: string,
        postID: number,
        userId: number
    ): Promise<data.IPost> {
        const con = this.dbConnector;
        const socket = this.socket;

        const getRawPostsQuery =
            `SELECT
                Post.comment AS description,
                Post.date,
                Post.Name,
                Post.idPost,
                Post.lat,
                Post.lng,
                Post.type,
                Post.isPrivate,
                Users.username,
                Users.idUsers AS 'idUser'
            FROM Post
            JOIN Users
            WHERE Post.Users_idUsers = Users.idUsers
            AND Post.idPost=${postID}`;

        return new Promise((
            resolve: (value: data.IPost) => void,
            reject: (reason: socket.ISocketErrorResponse<api.models.IAvailablePostActions>) => void
        ) => {
            con.query(getRawPostsQuery,
            async (err, postsData) => {
                if(err) {
                    reject({
                        operation: requestedOperation,
                        status: 'SQL Error',
                        data: {
                            requestFor: 'get one post',
                            response: err.message
                        }
                    })
                }
                else {
                    const JSONpost = parseData(postsData) as data.IRawPostData;
                    if (JSONpost.idUser !== userId) {

                    }
                    resolve(toDataPost(JSONpost))
                }
            })
        })
    }

    public async getAllPosts(
        requestedOperation: string,
        postIDs: number[],
        pageSize = 4
    ): Promise<data.IPost[]> {
        const con = this.dbConnector;
        const socket = this.socket;

        const getRawPostsQuery =
            `SELECT
                Post.comment AS description,
                Post.date,
                Post.Name,
                Post.idPost,
                Post.lat,
                Post.lng,
                Post.type,
                Post.isPrivate,
                Users.username,
                Users.idUsers AS 'idUser'
            FROM Post
            JOIN Users
            WHERE Post.Users_idUsers = Users.idUsers
            LIMIT ${postIDs.length}, ${pageSize}`;

        return new Promise((
            resolve: (value: data.IPost[]) => void,
            reject: (reason: socket.ISocketErrorResponse<api.models.IAvailablePostActions>) => void
        ) => {
            // Запрос 1. Получение списка постов
            con.query(getRawPostsQuery,
            async (err, postsData) => {
                if(err) {
                    reject({
                        operation: requestedOperation,
                        status: 'SQL Error',
                        data: {
                            requestFor: 'get all posts',
                            response: err.message
                        }
                    })
                }
                else {
                    const JSONpost = parseData(postsData) as data.IRawPostData[];
                    const result: data.IPost[] = JSONpost.map(toDataPost);
                    resolve(result)
                }
            })
        })
    }

    public async getUserPublicPosts(
        requestedOperation: string,
        username: string,
        postIDs: number[],
        pageSize = 4
    ): Promise<data.IPost[]> {
        const con = this.dbConnector;
        const socket = this.socket;

        const getRawPostsQuery =
            `SELECT
                Post.comment AS description,
                Post.date,
                Post.Name,
                Post.idPost,
                Post.lat,
                Post.lng,
                Post.type,
                Post.isPrivate,
                Users.username,
                Users.idUsers AS 'idUser'
            FROM Post
            JOIN Users
            WHERE Post.isPrivate=0
            AND Post.Users_idUsers=Users.idUsers
            AND Users.username='${username}'
            LIMIT ${postIDs.length}, ${pageSize}`;

        return new Promise((
            resolve: (value: data.IPost[]) => void,
            reject: (reason: socket.ISocketErrorResponse<api.models.IAvailablePostActions>) => void
        ) => {
            // Запрос 1. Получение списка постов
            con.query(getRawPostsQuery,
                async (err, postsData) => {
                if(err) {
                    reject({
                        operation: requestedOperation,
                        status: 'SQL Error',
                        data: {
                            requestFor: 'get user public posts',
                            response: err.message
                        }
                    });
                }
                else {
                    const JSONpost = parseData(postsData) as data.IRawPostData[];
                    const result: data.IPost[] = JSONpost.map(toDataPost)
                    resolve(result)
                }
            })
        })
    }

    public async getUserPrivatePosts(
        requestedOperation: string,
        username: string,
        postIDs: number[],
        pageSize = 4
    ): Promise<data.IPost[]> {
        const con = this.dbConnector;
        const socket = this.socket;

        const getRawPostsQuery =
            `SELECT
                Post.comment AS description,
                Post.date,
                Post.Name,
                Post.idPost,
                Post.lat,
                Post.lng,
                Post.type,
                Post.isPrivate,
                Users.username,
                Users.idUsers AS 'idUser'
            FROM Post
            JOIN Users
            WHERE Post.isPrivate=1
            AND Post.Users_idUsers = Users.idUsers
            AND Users.username='${username}'
            LIMIT ${postIDs.length}, ${pageSize}`;

        return new Promise((
            resolve: (value: data.IPost[]) => void,
            reject: (reason: socket.ISocketErrorResponse<api.models.IAvailablePostActions>) => void
        ) => {
            // Запрос 1. Получение списка постов
            con.query(getRawPostsQuery,
            async (err, postsData) => {
                if(err) {
                    reject({
                        operation: requestedOperation,
                        status: 'SQL Error',
                        data: {
                            requestFor: 'get user private posts',
                            response: err.message
                        }
                    })
                }
                else {
                    const JSONpost = parseData(postsData) as data.IRawPostData[];
                    const result: data.IPost[] = JSONpost.map(toDataPost)
                    resolve(result)
                }
            })
        })
    }

    public async getLikes(
        post: data.IPost,
        user: User,
    ): Promise<data.IPost> {
        const con = this.dbConnector;
        const getRawLikesQuery =
            `SELECT userId
            FROM Post_has_Rate
            JOIN Post
            WHERE Post.idPost = Post_has_Rate.postId
            AND Post_has_Rate.rating=1
            AND Post_has_Rate.postId='${post.idPost}'`
        return new Promise((
            resolve: (value: data.IPost) => void,
            reject: (reason: socket.ISocketErrorResponse<api.models.IAvailablePostActions>) => void
        ) => {
            // Запрос 2. Получаем лайки
            con.query(getRawLikesQuery,
            async (err,likes) => {
                if(err) {
                    reject({
                        operation: `Get Likes to post ${post.idPost}`,
                        status: 'SQL Error',
                        data: {
                            requestFor: 'get one post',
                            response: err.message
                        }
                    });
                }
                else{

                    let isLikedByMe = false;
                    const JSONlikes = parseData<{userId: number}[]>(likes);

                    if(JSONlikes.length>0){
                        isLikedByMe = JSONlikes.find(like => like.userId === user.id) ? true : false;
                        post.rating.likes = JSONlikes.length;
                        post.rating.isLikedByMe = isLikedByMe;
                    }
                    else {
                        post.rating.likes = 0;
                        post.rating.isLikedByMe = false;
                    }
                    resolve(post)
                }
            })
        })
    }

    public async getDisLikes(
        post: data.IPost,
        user: User
    ): Promise<data.IPost> {
        const con = this.dbConnector;
        const rawGetDislikesQuery =
            `SELECT userId
            FROM Post_has_Rate
            JOIN Post
            WHERE Post.idPost=Post_has_Rate.postId
            AND Post_has_Rate.rating=-1
            AND Post_has_Rate.postId='${post.idPost}'`;

        return new Promise((
            resolve: (value: data.IPost) => void,
            reject: (reason: socket.ISocketErrorResponse<api.models.IAvailablePostActions>) => void
        ) => {
            // Запрос 3. Получаем дизлайки
            con.query(rawGetDislikesQuery,
            async (err,disLikes) => {
                if(err) {
                    reject({
                        operation: `Get Dislikes to post ${post.idPost}`,
                        status: 'SQL Error',
                        data: {
                            requestFor: 'get one post',
                            response: err.message
                        }
                    })
                }
                else{
                    let isDislikedByMe = false;
                    const JSONdislikes = parseData<{userId: number}[]>(disLikes);

                    if(JSONdislikes.length > 0) {
                        isDislikedByMe = JSONdislikes.find(like => like.userId === user.id) ? true : false;
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

    public async getPhotoes (post: data.IPost): Promise<data.IPost> {
        const con = this.dbConnector;
        const directory = this.photoDirectory;

        const rawGetPhotoesQuery =
            `SELECT fileName AS 'name'
            FROM Photoes
            JOIN Post
            WHERE Post.idPost=Photoes.Post_idPost
            AND Post.idPost='${post.idPost}'`;

        return new Promise(
            (resolve: (value: data.IPost) => void,
            reject: (reason: socket.ISocketErrorResponse<api.models.IAvailablePostActions>) => void
        ) => {
            // Запрос 4. Получаем названия фотографий для поста
            con.query(rawGetPhotoesQuery,
            (err, photoes) => {
                if(err) {
                    reject({
                        operation: `Get Dislikes to post ${post.idPost}`,
                        status: 'SQL Error',
                        data: {
                            requestFor: 'get one post',
                            response: err.message
                        }
                    })
                }
                else{
                    const JSONphotoes = parseData<{name: string}[]>(photoes);
                    const postPhotoes = JSONphotoes.map((photo) => ({
                        name: photo.name,
                        blob: 'data:image/jpeg;base64,' + getBaseFromFile(directory+`${post.idPost}/`+photo.name)
                    }))

                    resolve({
                        ...post,
                        photoes: postPhotoes
                    })
                }
            })
        })
    }

    public async getComments(
        postID: number
    ): Promise<data.IPostComment[]> {
        const con = this.dbConnector;

        const getRawCommentsQuery =
        `SELECT	Comments.Content AS 'content',
            Users.avatar AS 'userAvatar',
            Users.username AS 'author',
            Users.rating AS 'userRating',
            Comments.date,
            Comments.rating
        FROM Comments JOIN Users JOIN Post
        WHERE Comments.Post_idPost=Post.idPost
        AND Comments.Users_idUsers=Users.idUsers
        AND Post.idPost='${postID}'`;

        return new Promise((resolve, reject)=>{
            con.query(getRawCommentsQuery,
            async (err, commentsArray) => {
                if(err) {
                    // Если ошибка подключения к бд
                    reject({
                        status: 'SQL Error',
                        result: err
                    });
                }
                else{
                    // Если подключился и запрос что-то вернул
                    const JSONcommentsArray = parseData<data.IPostComment[]>(commentsArray);
                    JSONcommentsArray.forEach((comment)=>{
                        // Если у пользователя есть аватарка, переводим её в base64
                        if (comment.userAvatar) {
                            comment.userAvatar = Buffer.from(comment.userAvatar).toString();
                        }
                    })
                    if(JSONcommentsArray){
                        resolve(JSONcommentsArray);
                    }
                    else {
                        reject({
                        status: 'Not Found',
                        result: err
                    });
                    }
                }
            })
        })
    }

    public async getIDPost(
        operation: string,
        postName: string,
        date: string,
        idUser: number
    ): Promise<string> {
        return new Promise((resolve, reject)=>{
            this.dbConnector.query(`SELECT idPost FROM Post WHERE Name ='${postName}'
            AND date='${date}'
            AND Users_idUsers='${idUser}'`, async (err,idPost) => {
                    if(err) {
                        // Если ошибка подключения к бд
                        reject({operation, status: 'SQL Error', result: err});
                    }
                    else{
                        resolve(parseData<{idPost: string}[]>(idPost)[0].idPost)
                    }
                })
        })
    }

}


export default PostGetter;