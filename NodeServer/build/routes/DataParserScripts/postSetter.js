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
const fs_1 = __importDefault(require("fs"));
class PostSetter {
    constructor(dbConnector, socket) {
        // Директория с папками фотографий
        this.photoDirectory = `/srv/windows/dyploma/Photoes/`;
        this.dbConnector = dbConnector;
        this.socket = socket;
    }
    createPost(operation, post) {
        return __awaiter(this, void 0, void 0, function* () {
            const con = this.dbConnector;
            const createPostQuery = `INSERT INTO
            Post (Name,
                lat, lng, comment, date,
                Users_idUsers, type, isCheck, isPrivate)
            VALUES (
            '${post.Name}',
            ${post.position.lat},
            ${post.position.lng},
            '${post.description}',
            '${post.date}',
            '${post.idUser}',
            1,
            0,
            ${post.isPrivate})`;
            return new Promise((resolve, reject) => {
                // Запрос 1.
                con.query(createPostQuery, (err, postsData) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        // Если ошибка подключения к бд
                        reject({ operation, status: 'SQL Error', result: err });
                    }
                    else {
                        resolve({ operation, status: 'OK', result: 'Success' });
                    }
                }));
            });
        });
    }
    settingPhotoes(operation, postID, post) {
        return __awaiter(this, void 0, void 0, function* () {
            const con = this.dbConnector;
            const directory = this.photoDirectory + `/${postID}/`;
            return new Promise((resolve, reject) => {
                if (!fs_1.default.existsSync(directory))
                    fs_1.default.mkdirSync(directory);
                post.photoes.forEach(photo => {
                    let photoName = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                    photoName += '-' + photo.name;
                    const base64Data = photo.blob.replace(/^data:([A-Za-z-+\/]+);base64,/, '');
                    fs_1.default.writeFileSync(directory + `/${photoName}`, base64Data, 'base64');
                    con.query(`INSERT INTO Photoes (fileName, Post_IdPost)
                VALUES('${photoName}',
                    '${postID}')`, (err, postsData) => __awaiter(this, void 0, void 0, function* () {
                        if (err) {
                            // Если ошибка подключения к бд
                            reject({ operation, status: 'SQL Error', result: err });
                        }
                        else {
                            resolve({ operation, status: 'OK', result: 'Success' });
                        }
                    }));
                });
            });
        });
    }
    createComment(operation, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const con = this.dbConnector;
            const createCommentQuery = `INSERT INTO Comments
            (Content, rating, date, Post_idPost, Users_idUsers)
            VALUES (
                '${data.content}',
                ${data.rating},
                '${data.date}',
                ${data.idPost},
                ${data.idUser})`;
            return new Promise((resolve, reject) => {
                con.query(createCommentQuery, (err, result) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        // Если ошибка подключения к бд
                        reject({ operation, status: 'SQL Error', result: err.message });
                    }
                    else {
                        resolve({ operation, status: 'OK', result: 'Success' });
                    }
                }));
            });
        });
    }
}
exports.default = PostSetter;
//# sourceMappingURL=postSetter.js.map