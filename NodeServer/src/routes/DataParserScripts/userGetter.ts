import { Connection } from 'mysql2';
import { parseData } from './utils';
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
    ): Promise<socket.ISocketResponse<api.models.IUser, api.models.IAvailableUserActions>> {
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
            resolve: (value: socket.ISocketResponse<api.models.IUser, api.models.IAvailableUserActions>) => void,
            reject: (reason: socket.ISocketErrorResponse<api.models.IAvailableUserActions>) => void
        ) => {
            this.dbConnector.query(rawGetUserQuery,
                async (err, userData) => {
                    if(err) {
                        // Если ошибка подключения к бд
                        reject({
                            status: 'SQL Error',
                            operation: 'Client Login Response',
                             data: {
                                requestFor: 'Client Login Request',
                                response: err.message
                            }
                        });
                    }
                    else{
                        // Если подключился и запрос что-то вернул
                        const JSONuserData = parseData<api.models.IUser[]>(userData)[0];
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
                                 data: {
                                    requestFor: 'Client Login Request',
                                    response: 'Not Found'
                                }
                            });
                        }
                    }
                })
        })
    }

    public async searchPeople (
        request: api.models.ISearchUserRequest
    ): Promise<socket.ISocketResponse<api.models.ISearchedUser[], api.models.IAvailableUserActions>> {
        let rawSearchUserQuery = `SELECT idUsers,
				Country,
				City,
				isOnline,
				isBanned,
				isConfirm,
				lastOnline,
				username,
				FirstName,
				LastName,
				Birthday,
				Status,
				email,
				phone,
				rating,
				avatar
			FROM Users WHERE`;

        if (request.filters.username.length) {
            rawSearchUserQuery += ` username LIKE '%${request.filters.username}%'`;
        }
        if (request.filters.country.length) {
            rawSearchUserQuery += ` Country='${request.filters.country}'`;
        }
        if (request.filters.city.length) {
            rawSearchUserQuery += ` City='${request.filters.city}'`;
        }
        if (request.filters.date.length) {
            rawSearchUserQuery += ` Birthday='${request.filters.date}'`;
        }
        const isEmptyFilter =
            !request.filters.username.length &&
            !request.filters.country.length &&
            !request.filters.city.length &&
            !request.filters.date.length;
        if (isEmptyFilter) {
            rawSearchUserQuery += ' 1';
        }
        rawSearchUserQuery +=
            ` AND Users.idUsers NOT IN(
    				SELECT BlackList.black_two FROM Users JOIN BlackList 
				    WHERE Users.idUsers=BlackList.black_one
    				AND BlackList.black_one=(SELECT idUsers from Users WHERE username='${request.currentUser}')
			) AND Users.idUsers NOT IN(
    				SELECT BlackList.black_one FROM Users JOIN BlackList 
				    WHERE Users.idUsers=BlackList.black_two
    				AND BlackList.black_two=(SELECT idUsers from Users WHERE username='${request.currentUser}')
			) LIMIT ${request.page},10`;

        return new Promise((
            resolve: (value: socket.ISocketResponse<api.models.ISearchedUser[], api.models.IAvailableUserActions>) => void,
            reject: (reason: socket.ISocketErrorResponse<api.models.IAvailableUserActions>) => void
        ) => {
            this.dbConnector.query(rawSearchUserQuery,
                async (err, userData) => {
                    if (err) {
                        // Если ошибка подключения к бд
                        reject({
                            status: 'SQL Error',
                            operation: 'User Searcher Request',
                            data: {
                                requestFor: 'Search Peoples',
                                response: err.message
                            }
                        });
                    }
                    else {
                        const JSONUsers = parseData<data.ISearchedUser[]>(userData);

                        console.log(JSONUsers);

                        if (!JSONUsers.length) {
                            reject({
                                status: 'Not Found',
                                operation: 'User Searcher Request',
                                data: {
                                    requestFor: 'Search Peoples',
                                    response: 'Not Found'
                                }
                            })
                        }

                        const searshResult: api.models.ISearchedUser[] =
                            JSONUsers.map((rawUser: data.ISearchedUser) => ({
                                ...rawUser,
                                rating: Number(rawUser.rating),
                                idUsers: Number(rawUser.idUsers),
                                isBanned: Boolean(rawUser.isBanned),
                                isConfirm: Boolean(rawUser.isConfirm),
                                isOnline: Boolean(rawUser.isOnline),
                                isMyFriend: rawUser.isMyFriend ? Boolean(rawUser.isMyFriend) : undefined,
                                isSubscribition: rawUser.isSubscribition ? Boolean(rawUser.isSubscribition) : undefined,
                                isBlocked: rawUser.isBlocked ? Boolean(rawUser.isBlocked) : undefined,
                        }))

                        resolve({
                            operation: 'User Searcher Response',
                            status: 'OK',
                            data: {
                                requestFor: 'Search Peoples',
                                response: searshResult
                            }
                        })
                     }
                });
            })
    }
}


export default User