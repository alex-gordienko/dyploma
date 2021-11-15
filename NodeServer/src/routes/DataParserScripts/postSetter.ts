import fs from 'fs';
import { Connection } from 'mysql2';
import { Socket } from 'socket.io';

class PostSetter {
    protected dbConnector: Connection;
    protected socket: Socket;
    // Директория с папками фотографий
    protected readonly photoDirectory = `/srv/windows/dyploma/Photoes/`;

    constructor(dbConnector: Connection, socket: Socket){
        this.dbConnector = dbConnector;
        this.socket = socket;
    }

    public async createPost(
        operation: string,
        post: data.IPost
    ): Promise<socket.ISocketErrorResponse>  {
        const con = this.dbConnector;

        const createPostQuery =
            `INSERT INTO
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

        return new Promise((resolve, reject)=>{
        // Запрос 1.
        con.query(createPostQuery,
        async (err, postsData) => {
            if(err) {
                // Если ошибка подключения к бд
                reject({operation, status: 'SQL Error', result: err});
            }
            else{
                resolve({operation, status: 'OK', result: 'Success'});
            }
        })
        })
    }

    public async settingPhotoes(
        operation: string,
        postID: string,
        post: data.IPost
    ): Promise<socket.ISocketErrorResponse> {
        const con = this.dbConnector;
        const directory = this.photoDirectory+`/${postID}/`;
        return new Promise((resolve,reject)=>{
            if(!fs.existsSync(directory)) fs.mkdirSync(directory);
            post.photoes.forEach(photo => {
                let photoName = new Date().toISOString().replace(/T/,' ').replace(/\..+/, '');
                photoName+='-'+photo.name;
                const base64Data = photo.blob.replace(/^data:([A-Za-z-+\/]+);base64,/,'');

                fs.writeFileSync(directory+`/${photoName}`, base64Data, 'base64');


                con.query(`INSERT INTO Photoes (fileName, Post_IdPost)
                VALUES('${photoName}',
                    '${postID}')`,
                async (err,postsData) => {
                    if(err) {
                        // Если ошибка подключения к бд
                        reject({operation, status: 'SQL Error', result: err});
                    }
                    else{
                        resolve({operation, status: 'OK', result: 'Success'});
                    }
                })
            });
        })
    }


    public async createComment(
        operation: string,
        data: api.models.ICreateCommentAction
    ): Promise<socket.ISocketErrorResponse> {
        const con = this.dbConnector;

        const createCommentQuery =
            `INSERT INTO Comments
            (Content, rating, date, Post_idPost, Users_idUsers)
            VALUES (
                '${data.content}',
                ${data.rating},
                '${data.date}',
                ${data.idPost},
                ${data.idUser})`;

        return new Promise((
            resolve: (value: socket.ISocketErrorResponse) => void,
            reject: (reason: socket.ISocketErrorResponse) => void
        ) => {
            con.query(createCommentQuery,
            async (err, result) => {
                    if(err) {
                        // Если ошибка подключения к бд
                        reject({operation, status: 'SQL Error', result: err.message});
                    }
                    else{
                        resolve({operation, status: 'OK', result: 'Success'});
                    }
                })
        })
    }
}


export default PostSetter