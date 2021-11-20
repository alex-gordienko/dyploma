import fs from 'fs';
import { Connection } from 'mysql2';
import { RowDataPacket } from 'mysql2/promise';
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
    ): Promise<socket.ISocketErrorResponse<api.models.IAvailablePostActions>>  {
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

        return new Promise((
            resolve: (value: socket.ISocketErrorResponse<api.models.IAvailablePostActions>) => void,
            reject: (reason: socket.ISocketErrorResponse<api.models.IAvailablePostActions>) => void
        ) => {
        // Запрос 1.
        con.query(createPostQuery,
        async (err, postsData) => {
            if(err) {
                // Если ошибка подключения к бд
                reject({
                    operation,
                    status: 'SQL Error',
                     data: {
                        requestFor: 'create post',
                        response: err.message
                    }
                });
            }
            else{
                resolve({
                    operation,
                    status: 'OK',
                    data: {
                        requestFor: 'create post',
                        response: 'Success'
                    }
                });
            }
        })
        })
    }

    public async settingPhotoes(
        operation: string,
        postID: string,
        post: data.IPost
    ): Promise<socket.ISocketErrorResponse<api.models.IAvailablePostActions>> {
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
                        reject({
                            operation,
                            status: 'SQL Error',
                            data: {
                                requestFor: 'edit post',
                                response: err.message
                            }
                        });
                    }
                    else{
                        resolve({
                            operation,
                            status: 'OK',
                            data: {
                                requestFor: 'edit post',
                                response: 'Success updated Photoes'
                            }
                        });
                    }
                })
            });
        })
    }

    public async createComment(
        operation: string,
        data: api.models.ICreateCommentRequest
    ): Promise<socket.ISocketErrorResponse<api.models.IAvailablePostActions>> {
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
            resolve: (value: socket.ISocketErrorResponse<api.models.IAvailablePostActions>) => void,
            reject: (reason: socket.ISocketErrorResponse<api.models.IAvailablePostActions>) => void
        ) => {
            con.query(createCommentQuery,
            async (err, result) => {
                    if(err) {
                        // Если ошибка подключения к бд
                        reject({
                            operation,
                            status: 'SQL Error',
                            data: {
                                response: err.message,
                                requestFor: 'create comment'
                            }
                        });
                    }
                    else{
                        resolve({
                            operation,
                            status: 'OK',
                            data: {
                                requestFor: 'create comment',
                                response: 'Success'
                            }
                        });
                    }
                })
        })
    }

    public async setPostRating(
        requestedOperation: string,
        data: api.models.ISetPostRatingRequest
    ): Promise<socket.ISocketErrorResponse<api.models.IAvailableRatingActions>> {
        const con = this.dbConnector;
        let rate = 1; // like or dislike
        let query = '';

        if (data.setting === 'like') rate = 1; else rate = -1;
        
        const checkRateByMe =
            `SELECT rating FROM Post_has_Rate
				WHERE Post_has_Rate.postId=${data.idPost}
				AND Post_has_Rate.userId=${data.idUser}`;
			
		const getMyPostsRate = await con.promise().query(checkRateByMe);

        if ((getMyPostsRate[0] as RowDataPacket[])[0]) {
            // if user is already liked/disliked this post
            if (data.type === 'inversion') {
                // if user want to remove his rate
                query = `DELETE FROM Post_has_Rate WHERE postId=${data.idPost} AND userId=${data.idUser}`;
            }
            else {
                // if user wants to change like to dislike or same
                query = `UPDATE Post_has_Rate SET rating=${rate} WHERE postId=${data.idPost} AND userId=${data.idUser}`;
            }
        }
        else {
            query = `INSERT INTO Post_has_Rate VALUES(${data.idPost},${data.idUser},${rate})`;
        }

        return new Promise((
            resolve: (value: socket.ISocketErrorResponse<api.models.IAvailableRatingActions>) => void,
            reject: (reason: socket.ISocketErrorResponse<api.models.IAvailableRatingActions>) => void
        ) => {
            con.query(query,
            async (err, result) => {
                    if(err) {
                        // Если ошибка подключения к бд
                        reject({
                            operation: requestedOperation,
                            status: 'SQL Error',
                            data: {
                                response: err.message,
                                requestFor: 'set post rating'
                            }
                        });
                    }
                    else{
                        resolve({
                            operation: requestedOperation,
                            status: 'OK',
                            data: {
                                requestFor: 'set post rating',
                                response: 'Success'
                            }
                        });
                    }
                })
        })
    }
}


export default PostSetter