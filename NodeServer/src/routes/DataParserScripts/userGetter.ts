import { Connection } from 'mysql2';
import { RowDataPacket } from 'mysql2/promise';
import { parseData, toApiSearchedUser } from './utils';
import fs from 'fs';
class User {
    protected userID: number;
    protected username: string;
    protected identificator: string;
    protected dbConnector: Connection;
    private userAvatarDirectory = '/srv/windows/dyploma/Photoes/All';

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

    public async editUser (
        userId: number,
        request: api.models.IUser
    ): Promise<socket.ISocketResponse<api.models.IUser, api.models.IAvailableUserActions>> {


        let updateUserQuery = `UPDATE Users SET `;

        return new Promise(async (
            resolve: (value: socket.ISocketResponse<api.models.IUser, api.models.IAvailableUserActions>) => void,
            reject: (reason: socket.ISocketErrorResponse<api.models.IAvailableUserActions>) => void
        ) => {
            const rawUser = await this.getUser(userId);

            if (!rawUser) {
                 reject({
                    status: 'Not Found',
                    operation: 'User Editor Response',
                        data: {
                        requestFor: 'Edit User',
                        response: 'Not Found'
                    }
                 });
                return null
            }

            if (request.username !== rawUser.username) updateUserQuery += `username = '${request.username}',`;
            if (request.FirstName !== rawUser.FirstName) updateUserQuery += ` FirstName = '${request.FirstName}',`;
            if (request.LastName !== rawUser.LastName) updateUserQuery += `LastName = '${request.LastName}',`;
            if (request.Status !== rawUser.Status) updateUserQuery += ` Status = '${request.Status}',`;
            if (request.Country !== rawUser.Country) updateUserQuery += ` Country = '${request.Country}',`;
            if (request.City !== rawUser.City) updateUserQuery += ` City = '${request.City}',`;
            if (request.email !== rawUser.email) updateUserQuery += ` email = '${request.email}',`;
            if (request.phone !== rawUser.phone) updateUserQuery += ` phone = '${request.phone}',`;
            if (request.password !== rawUser.password) updateUserQuery += ` crypt_pass = '${request.password}',`;
            if (request.avatar !== rawUser.avatar) {
                const newAvatar = request.avatar.replace(/^data:([A-Za-z-+\/]+);base64,/, '');
                if (!fs.existsSync(this.userAvatarDirectory)) {
                    fs.mkdirSync(this.userAvatarDirectory);
                }
                if (!fs.existsSync(`${this.userAvatarDirectory}/${rawUser.idUsers}`)) {
                    fs.mkdirSync(`${this.userAvatarDirectory}/${rawUser.idUsers}`);
                }
                fs.writeFileSync(`${this.userAvatarDirectory}/${rawUser.idUsers}/avatar.jpg`, newAvatar, 'base64');
                updateUserQuery += ` avatar = '${request.avatar}',`;
            };

            updateUserQuery += ` idUsers = ${userId} WHERE idUsers=${userId}`;

            this.dbConnector.query(updateUserQuery,
                async (err, userData) => {
                    if(err) {
                        // Если ошибка подключения к бд
                        reject({
                            status: 'SQL Error',
                            operation: 'User Editor Response',
                             data: {
                                requestFor: 'Edit User',
                                response: err.message
                            }
                        });
                    }
                    else{
                        // Сохраняем в объекте класса айди пользователя для дальнейших манипуляций
                        resolve({
                            status: 'OK',
                            operation: 'User Editor Response',
                            data: {
                                requestFor: 'Edit User',
                                response: rawUser
                            }
                        });
                    }
                })
        })
    }

    public async searchPeople (
        request: api.models.ISearchUserRequest,
        userId: number,
        pageSize = 10,
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
    				AND BlackList.black_one=${userId}
			) AND Users.idUsers NOT IN(
    				SELECT BlackList.black_one FROM Users JOIN BlackList
				    WHERE Users.idUsers=BlackList.black_two
    				AND BlackList.black_two=${userId}
			) LIMIT ${request.page},${pageSize}`;

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
                            JSONUsers.map(toApiSearchedUser)

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
    };

    public async searchFriends (
        request: api.models.ISearchUserRequest,
        pageSize = 10
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
				rating,
				avatar,
                true as 'isMyFriend'
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
            ` AND Users.idUsers IN(
    				SELECT FriendList.friend_two FROM Users JOIN FriendList
				WHERE Users.idUsers=FriendList.friend_one
				AND FriendList.status='good'
    				AND FriendList.friend_one=(SELECT idUsers from Users WHERE username='${request.searchedUser}')
			) OR Users.idUsers IN(
    				SELECT FriendList.friend_one FROM Users JOIN FriendList
				WHERE Users.idUsers=FriendList.friend_two
				AND FriendList.status='good'
    				AND FriendList.friend_two=(SELECT idUsers from Users WHERE username='${request.searchedUser}')
			) AND Users.idUsers NOT IN(
    				SELECT BlackList.black_two FROM Users JOIN BlackList
				WHERE Users.idUsers=BlackList.black_one
    				AND BlackList.black_one=(SELECT idUsers from Users WHERE username='${request.searchedUser}')
			) AND Users.idUsers NOT IN(
    				SELECT BlackList.black_one FROM Users JOIN BlackList
				WHERE Users.idUsers=BlackList.black_two
    				AND BlackList.black_two=(SELECT idUsers from Users WHERE username='${request.searchedUser}')
			) LIMIT ${request.page},${pageSize}`;

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
                                requestFor: 'Search Friends',
                                response: err.message
                            }
                        });
                    }
                    else {
                        const JSONUsers = parseData<data.ISearchedUser[]>(userData);

                        if (!JSONUsers.length) {
                            reject({
                                status: 'Not Found',
                                operation: 'User Searcher Request',
                                data: {
                                    requestFor: 'Search Friends',
                                    response: 'Not Found'
                                }
                            })
                        }

                        const searshResult: api.models.ISearchedUser[] =
                            JSONUsers.map(toApiSearchedUser)

                        resolve({
                            operation: 'User Searcher Response',
                            status: 'OK',
                            data: {
                                requestFor: 'Search Friends',
                                response: searshResult
                            }
                        })
                     }
                });
            })
    };

    public async searchInvites (
        request: api.models.ISearchUserRequest,
        userId: number,
        pageSize = 10
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
            ` AND Users.idUsers IN(
    				SELECT FriendList.friend_two FROM Users JOIN FriendList
				WHERE Users.idUsers=FriendList.friend_one
				AND FriendList.status='almost'
    				AND FriendList.friend_one=${userId}
			) OR Users.idUsers IN(
    				SELECT FriendList.friend_one FROM Users JOIN FriendList
				WHERE Users.idUsers=FriendList.friend_two
				AND FriendList.status='almost'
    				AND FriendList.friend_two=${userId}
			) AND Users.idUsers NOT IN(
    				SELECT BlackList.black_two FROM Users JOIN BlackList
				WHERE Users.idUsers=BlackList.black_one
    				AND BlackList.black_one=${userId}
			) AND Users.idUsers NOT IN(
    				SELECT BlackList.black_one FROM Users JOIN BlackList
				WHERE Users.idUsers=BlackList.black_two
    				AND BlackList.black_two=${userId}
			) LIMIT ${request.page},${pageSize}`;

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
                                requestFor: 'Search Invites',
                                response: err.message
                            }
                        });
                    }
                    else {
                        const JSONUsers = parseData<data.ISearchedUser[]>(userData);

                        if (!JSONUsers.length) {
                            reject({
                                status: 'Not Found',
                                operation: 'User Searcher Request',
                                data: {
                                    requestFor: 'Search Invites',
                                    response: 'Not Found'
                                }
                            })
                        }

                        const searshResult: api.models.ISearchedUser[] =
                            JSONUsers.map(toApiSearchedUser)

                        resolve({
                            operation: 'User Searcher Response',
                            status: 'OK',
                            data: {
                                requestFor: 'Search Invites',
                                response: searshResult
                            }
                        })
                     }
                });
            })
    };

    public async searchBlocked (
        request: api.models.ISearchUserRequest,
        userId: number,
        pageSize = 10
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
            ` AND Users.idUsers IN(
    				SELECT BlackList.black_two FROM Users JOIN BlackList
				WHERE Users.idUsers=BlackList.black_one
    				AND BlackList.black_one=${userId}
			) OR Users.idUsers IN(
    				SELECT BlackList.black_one FROM Users JOIN BlackList
				WHERE Users.idUsers=BlackList.black_two
    				AND BlackList.black_two=${userId}
			) LIMIT ${request.page},${pageSize}`;

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
                                requestFor: 'Search Blocked',
                                response: err.message
                            }
                        });
                    }
                    else {
                        const JSONUsers = parseData<data.ISearchedUser[]>(userData);

                        if (!JSONUsers.length) {
                            reject({
                                status: 'Not Found',
                                operation: 'User Searcher Request',
                                data: {
                                    requestFor: 'Search Blocked',
                                    response: 'Not Found'
                                }
                            })
                        }

                        const searshResult: api.models.ISearchedUser[] =
                            JSONUsers.map(toApiSearchedUser)

                        resolve({
                            operation: 'User Searcher Response',
                            status: 'OK',
                            data: {
                                requestFor: 'Search Blocked',
                                response: searshResult
                            }
                        })
                     }
                });
            })
    };

    public async loadUserProfile(
        request: api.models.ISearchUserRequest
    ): Promise<socket.ISocketResponse<api.models.ISearchedUser, api.models.IAvailableUserActions>> {
        let isMyFriend = false;
        let isBlocked = false;

        const loadUserProfileQuery = `SELECT idUsers,
				isOnline,
				isBanned,
				isConfirm,
				lastOnline,
				username,
				Country,
				City,
				FirstName,
				LastName,
				Birthday,
				Status,
				email,
				phone,
				rating,
				avatar
			FROM Users WHERE username='${request.searchedUser}'`;

        const checkIsMyFriendQuery = `SELECT idUsers
				FROM Users WHERE Users.idUsers IN(
	    				SELECT FriendList.friend_two FROM Users JOIN FriendList
					WHERE Users.idUsers=FriendList.friend_one
					AND FriendList.status='good'
	    				AND FriendList.friend_one=(SELECT idUsers from Users WHERE username='${request.currentUser}')
					AND FriendList.friend_two=(SELECT idUsers from Users WHERE username='${request.searchedUser}')
				) OR Users.idUsers IN(
	    				SELECT FriendList.friend_one FROM Users JOIN FriendList
					WHERE Users.idUsers=FriendList.friend_two
					AND FriendList.status='good'
					AND FriendList.friend_one=(SELECT idUsers from Users WHERE username='${request.searchedUser}')
	    				AND FriendList.friend_two=(SELECT idUsers from Users WHERE username='${request.currentUser}')
				)`;

        const checkIsBlockedUserQuery = `SELECT idUsers
				FROM Users WHERE Users.idUsers IN(
	    				SELECT BlackList.black_two FROM Users JOIN BlackList
					WHERE Users.idUsers=BlackList.black_one
	    				AND BlackList.black_one=(SELECT idUsers from Users WHERE username='${request.currentUser}')
					AND BlackList.black_two=(SELECT idUsers from Users WHERE username='${request.searchedUser}')
				) OR Users.idUsers IN(
	    				SELECT BlackList.black_one FROM Users JOIN BlackList
					WHERE Users.idUsers=BlackList.black_two
					AND BlackList.black_one=(SELECT idUsers from Users WHERE username='${request.searchedUser}')
	    				AND BlackList.black_two=(SELECT idUsers from Users WHERE username='${request.currentUser}')
				)`;

        const checkIsMyFriend = await this.dbConnector.promise().query(checkIsMyFriendQuery);
        const checkIsBlockedUser = await this.dbConnector.promise().query(checkIsBlockedUserQuery);

        if ((checkIsMyFriend[0] as RowDataPacket[])[0]) { isMyFriend = true };
        if ((checkIsBlockedUser[0] as RowDataPacket[])[0]) { isBlocked = true };

        return new Promise((
            resolve: (value: socket.ISocketResponse<api.models.ISearchedUser, api.models.IAvailableUserActions>) => void,
            reject: (reason: socket.ISocketErrorResponse<api.models.IAvailableUserActions>) => void
        ) => {
            this.dbConnector.query(loadUserProfileQuery,
                async (err, userData) => {
                    if (err) {
                        // Если ошибка подключения к бд
                        reject({
                            status: 'SQL Error',
                            operation: 'User Searcher Response',
                            data: {
                                requestFor: 'Search User',
                                response: err.message
                            }
                        });
                    }
                    else {
                        const JSONUser = parseData<api.models.ISearchedUser[]>(userData)[0];
                        if(JSONUser && JSONUser.avatar) JSONUser.avatar = Buffer.from(JSONUser.avatar).toString();
                        const fullUserData: api.models.ISearchedUser = { ...JSONUser, isMyFriend, isBlocked };
                        resolve({
                            operation: 'User Searcher Response',
                            status: 'OK',
                            data: {
                                requestFor: 'Search User',
                                response: fullUserData
                            }
                        })
                    }
                })
         })
    }

    public async getUser(userId: number): Promise<api.models.IUser> {
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
            WHERE idUsers=${userId}`;
        const dbUser = await this.dbConnector.promise().query(rawGetUserQuery);
        return parseData<api.models.IUser[]>(dbUser[0])[0]
    }
}


export default User