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
class User {
    constructor(dbConnector) {
        this.dbConnector = dbConnector;
        this.userID = 0;
        this.username = 'Undefined';
        this.identificator = '';
    }
    get id() {
        return this.userID;
    }
    set id(id) {
        this.userID = id;
    }
    get name() {
        return this.username;
    }
    set name(name) {
        this.username = name;
    }
    get token() {
        return this.identificator;
    }
    set token(t) {
        this.identificator = t;
    }
    Login(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawGetUserQuery = `SELECT idUsers,
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
            return new Promise((resolve, reject) => {
                this.dbConnector.query(rawGetUserQuery, (err, userData) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        // Если ошибка подключения к бд
                        reject({
                            status: 'SQL Error',
                            operation: 'Client Login Response',
                            result: JSON.stringify(err)
                        });
                    }
                    else {
                        // Если подключился и запрос что-то вернул
                        const JSONuserData = JSON.parse(JSON.stringify(userData))[0];
                        // Если у пользователя есть аватарка, переводим её в base64
                        if (JSONuserData && JSONuserData.avatar !== null)
                            JSONuserData.avatar = Buffer.from(JSONuserData.avatar).toString();
                        if (JSONuserData) {
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
                }));
            });
        });
    }
}
exports.default = User;
//# sourceMappingURL=userGetter.js.map