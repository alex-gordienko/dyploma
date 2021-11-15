import { Connection } from 'mysql2';
class User {
    protected userID: number;
    protected username: string;
    protected identificator: string;
    protected dbConnector: Connection;

    constructor(dbConnector: Connection){
        this.dbConnector = dbConnector;
        this.userID = 0;
        this.username= 'Undefined';
        this.identificator = '';
    }

    get id(){
        return this.userID;
    }

    set id(id){
        this.userID = id;
    }

    get name(){
        return this.username;
    }

    set name(name){
        this.username = name;
    }

    get token(){
        return this.identificator;
    }

    set token(t){
        this.identificator = t;
    }

    public async Login (
        user: api.models.ILoginRequest
    ): Promise<socket.ISocketResponse<api.models.IUser>> {
        const rawGetUserQuery =
            `SELECT idUsers,
                regDate,
                isConfirm,
                isBanned,
                username,
                FirstName,
                LastName,
                Birthday,
                Country,
                City,
                Status,
                email,
                phone,
                rating,
                avatar,
                crypt_pass AS password
            FROM Users
            WHERE username='${user.login}'
            AND crypt_pass='${user.pass}'
            OR email= '${user.login}'
            AND crypt_pass='${user.pass}'`;

        return new Promise((
            resolve: (value: socket.ISocketResponse<api.models.IUser>) => void,
            reject: (reason: socket.ISocketErrorResponse) => void
        ) => {
            this.dbConnector.query(rawGetUserQuery,
                async (err, userData) => {
                    if(err) {
                        // Если ошибка подключения к бд
                        reject({
                            status: 'SQL Error',
                            operation: 'Client Login Response',
                            result: JSON.stringify(err)
                        });
                    }
                    else{
                        // Если подключился и запрос что-то вернул
                        const JSONuserData = JSON.parse(JSON.stringify(userData))[0];
                        // Если у пользователя есть аватарка, переводим её в base64
                        if(JSONuserData && JSONuserData.avatar!==null) JSONuserData.avatar = Buffer.from(JSONuserData.avatar).toString();

                        if(JSONuserData){
                            // Сохраняем в объекте класса айди пользователя для дальнейших манипуляций
                            resolve({
                                status: 'OK',
                                operation: 'Client Login Response',
                                data: {
                                    requestFor: 'Client Login Response',
                                    response: JSONuserData
                                }
                            });
                        }
                        else {
                            reject({
                                status: 'Not Found',
                                operation: 'Client Login Request',
                                result: 'Not Found'
                            });
                        }
                    }
                })
        })
    }
}


export default User