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
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class PostGetter {
    constructor(dbConnector, socket) {
        // Директория с папками фотографий
        this.photoDirectory = `/srv/windows/dyploma/Photoes/`;
        this.dbConnector = dbConnector;
        this.socket = socket;
    }
    getAllPosts(requestedOperation, postIDs, pageSize = 4) {
        return __awaiter(this, void 0, void 0, function* () {
            const con = this.dbConnector;
            const socket = this.socket;
            const getRawPostsQuery = `SELECT
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
            return new Promise((resolve, reject) => {
                // Запрос 1. Получение списка постов
                con.query(getRawPostsQuery, (err, postsData) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        socket.emit('Get Posts Response', {
                            operation: requestedOperation,
                            status: 'SQL Error',
                            result: err
                        });
                    }
                    else {
                        const JSONpost = (0, utils_1.parseData)(postsData);
                        const result = JSONpost.map(utils_1.toDataPost);
                        resolve(result);
                    }
                }));
            });
        });
    }
    getUserPublicPosts(requestedOperation, username, postIDs, pageSize = 4) {
        return __awaiter(this, void 0, void 0, function* () {
            const con = this.dbConnector;
            const socket = this.socket;
            const getRawPostsQuery = `SELECT
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
            return new Promise((resolve, reject) => {
                // Запрос 1. Получение списка постов
                con.query(getRawPostsQuery, (err, postsData) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        socket.emit('Get Posts Response', {
                            operation: requestedOperation,
                            status: 'SQL Error',
                            result: err
                        });
                    }
                    else {
                        const JSONpost = (0, utils_1.parseData)(postsData);
                        const result = JSONpost.map(utils_1.toDataPost);
                        resolve(result);
                    }
                }));
            });
        });
    }
    getUserPrivatePosts(requestedOperation, username, postIDs, pageSize = 4) {
        return __awaiter(this, void 0, void 0, function* () {
            const con = this.dbConnector;
            const socket = this.socket;
            const getRawPostsQuery = `SELECT
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
            return new Promise((resolve, reject) => {
                // Запрос 1. Получение списка постов
                con.query(getRawPostsQuery, (err, postsData) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        socket.emit('Get Posts Response', {
                            operation: requestedOperation,
                            status: 'SQL Error',
                            result: err
                        });
                    }
                    else {
                        const JSONpost = (0, utils_1.parseData)(postsData);
                        const result = JSONpost.map(utils_1.toDataPost);
                        resolve(result);
                    }
                }));
            });
        });
    }
    getLikes(post, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const con = this.dbConnector;
            const getRawLikesQuery = `SELECT userId
            FROM Post_has_Rate
            JOIN Post
            WHERE Post.idPost = Post_has_Rate.postId
            AND Post_has_Rate.rating=1
            AND Post_has_Rate.postId='${post.idPost}'`;
            return new Promise((resolve, reject) => {
                // Запрос 2. Получаем лайки
                con.query(getRawLikesQuery, (err, likes) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        reject({
                            operation: `Get Likes to post ${post.idPost}`,
                            status: 'SQL Error',
                            result: err
                        });
                    }
                    else {
                        let isLikedByMe = false;
                        const JSONlikes = (0, utils_1.parseData)(likes);
                        if (JSONlikes.length > 0) {
                            isLikedByMe = JSONlikes.find(like => like.userId === user.id) ? true : false;
                            post.rating.likes = JSONlikes.length;
                            post.rating.isLikedByMe = isLikedByMe;
                        }
                        else {
                            post.rating.likes = 0;
                            post.rating.isLikedByMe = false;
                        }
                        resolve(post);
                    }
                }));
            });
        });
    }
    getDisLikes(post, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const con = this.dbConnector;
            const rawGetDislikesQuery = `SELECT userId
            FROM Post_has_Rate
            JOIN Post
            WHERE Post.idPost=Post_has_Rate.postId
            AND Post_has_Rate.rating=-1
            AND Post_has_Rate.postId='${post.idPost}'`;
            return new Promise((resolve, reject) => {
                // Запрос 3. Получаем дизлайки
                con.query(rawGetDislikesQuery, (err, disLikes) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        reject({
                            operation: `Get Dislikes to post ${post.idPost}`,
                            status: 'SQL Error',
                            result: err
                        });
                    }
                    else {
                        let isDislikedByMe = false;
                        const JSONdislikes = (0, utils_1.parseData)(disLikes);
                        if (JSONdislikes.length > 0) {
                            isDislikedByMe = JSONdislikes.find(like => like.userId === user.id) ? true : false;
                            post.rating.dislikes = JSONdislikes.length;
                            post.rating.isDislikedByMe = isDislikedByMe;
                        }
                        else {
                            post.rating.dislikes = 0;
                            post.rating.isDislikedByMe = false;
                        }
                        resolve(post);
                    }
                }));
            });
        });
    }
    getPhotoes(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const con = this.dbConnector;
            const directory = this.photoDirectory;
            const rawGetPhotoesQuery = `SELECT fileName AS 'name'
            FROM Photoes
            JOIN Post
            WHERE Post.idPost=Photoes.Post_idPost
            AND Post.idPost='${post.idPost}'`;
            return new Promise((resolve, reject) => {
                // Запрос 4. Получаем названия фотографий для поста
                con.query(rawGetPhotoesQuery, (err, photoes) => {
                    if (err) {
                        reject({
                            operation: `Get Dislikes to post ${post.idPost}`,
                            status: 'SQL Error',
                            result: err
                        });
                    }
                    else {
                        const JSONphotoes = (0, utils_1.parseData)(photoes);
                        const postPhotoes = JSONphotoes.map((photo) => ({
                            name: photo.name,
                            blob: 'data:image/jpeg;base64,' + (0, utils_1.getBaseFromFile)(directory + `${post.idPost}/` + photo.name)
                        }));
                        resolve(Object.assign(Object.assign({}, post), { photoes: postPhotoes }));
                    }
                });
            });
        });
    }
    getComments(postID) {
        return __awaiter(this, void 0, void 0, function* () {
            const con = this.dbConnector;
            const getRawCommentsQuery = `SELECT	Comments.Content AS 'content',
            Users.avatar AS 'userAvatar',
            Users.username AS 'author',
            Users.rating AS 'userRating',
            Comments.date,
            Comments.rating
        FROM Comments JOIN Users JOIN Post
        WHERE Comments.Post_idPost=Post.idPost
        AND Comments.Users_idUsers=Users.idUsers
        AND Post.idPost='${postID}'`;
            return new Promise((resolve, reject) => {
                con.query(getRawCommentsQuery, (err, commentsArray) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        // Если ошибка подключения к бд
                        reject({
                            status: 'SQL Error',
                            result: err
                        });
                    }
                    else {
                        // Если подключился и запрос что-то вернул
                        const JSONcommentsArray = (0, utils_1.parseData)(commentsArray);
                        JSONcommentsArray.forEach((comment) => {
                            // Если у пользователя есть аватарка, переводим её в base64
                            if (comment.userAvatar) {
                                comment.userAvatar = Buffer.from(comment.userAvatar).toString();
                            }
                        });
                        if (JSONcommentsArray) {
                            resolve(JSONcommentsArray);
                        }
                        else {
                            reject({
                                status: 'Not Found',
                                result: err
                            });
                        }
                    }
                }));
            });
        });
    }
    getIDPost(operation, postName, date, idUser) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.dbConnector.query(`SELECT idPost FROM Post WHERE Name ='${postName}'
            AND date='${date}'
            AND Users_idUsers='${idUser}'`, (err, idPost) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        // Если ошибка подключения к бд
                        reject({ operation, status: 'SQL Error', result: err });
                    }
                    else {
                        resolve((0, utils_1.parseData)(idPost)[0].idPost);
                    }
                }));
            });
        });
    }
}
exports.default = PostGetter;
//# sourceMappingURL=postGetter.js.map