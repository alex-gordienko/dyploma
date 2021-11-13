const fs = require('fs');
import { Connection } from 'mysql';
import { Socket } from 'socket.io';

class PostSetter {
    protected dbConnector: Connection;
    protected socket: Socket;
    // Директория с папками фотографий
    protected readonly photoDirectory = `/srv/windows/dyploma/Photoes/`;

    constructor(dbConnector, socket){
        this.dbConnector = dbConnector;
        this.socket = socket;
    }

    createPost(operation, post){
        let con = this.dbConnector;
        return new Promise((resolve, reject)=>{
        //Запрос 1. 
        con.query(`INSERT INTO Post (Name, lat, lng, comment, date, Users_idUsers, type, isCheck, isPrivate) VALUES (
            '${post.Name}', 
            ${post.position.lat}, 
            ${post.position.lng},
            '${post.description}',
            '${post.date}',
            '${post.idUser}',
            1,
            0,
            ${post.isPrivate})`, 
        async function(err, postsData){
            if(err) {
                //Если ошибка подключения к бд
                reject({operation, status: 'SQL Error', result: err});
            }
            else{
                resolve({operation, status: 'OK', result: 'Success'});
            }
        })
        })
    }

    settingPhotoes(operation, postID, post){
        let con = this.dbConnector;
        let directory = this.photoDirectory+`/${postID}/`;
        return new Promise((resolve,reject)=>{
            if(!fs.existsSync(directory)) fs.mkdirSync(directory);
            post.photoes.forEach(photo => {
                let photoName = new Date().toISOString().replace(/T/,' ').replace(/\..+/, '');
                photoName+='-'+photo.name;
                let base64Data = photo.blob.replace(/^data:([A-Za-z-+\/]+);base64,/,'');

                fs.writeFileSync(directory+`/${photoName}`, base64Data, 'base64');

                
                con.query(`INSERT INTO Photoes (fileName, Post_IdPost)
                VALUES('${photoName}',
                    '${postID}')`, 
                async function(err,postsData){
                    if(err) {
                        //Если ошибка подключения к бд
                        reject({operation, status: 'SQL Error', result: err});
                    }
                    else{
                        resolve({operation, status: 'OK', result: 'Success'});
                    }
                })
            });
        })
    }


    createComment(operation, data){
        return new Promise((resolve, reject)=>{
            this.dbConnector.query(`INSERT INTO Comments (Content, rating, date, Post_idPost, Users_idUsers)
            VALUES ('${data.content}', ${data.rating}, '${data.date}', ${data.idPost}, ${data.idUser})`, 
            async function(err,result){
                    if(err) {
                        //Если ошибка подключения к бд
                        reject({operation, status: 'SQL Error', result: err});
                    }
                    else{
                        resolve({operation, status: 'OK', result: 'Success'});
                    }
                })
        })
    }
}


export default PostSetter