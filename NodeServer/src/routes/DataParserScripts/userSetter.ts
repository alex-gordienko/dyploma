import { Connection } from 'mysql2';
import nodemailer from 'nodemailer';
import { parseData, tokenGen } from './utils';
import http from 'http';
import fs from 'fs';
import Mail from 'nodemailer/lib/mailer';


class UserSetter {
    protected dbConnector: Connection;
    private userAvatarDirectory = '/srv/windows/dyploma/Photoes/All';

    constructor(dbConnector: Connection){
        this.dbConnector = dbConnector;
    }

    public async createUser(
        request: api.models.IUser
    ): Promise<socket.ISocketErrorResponse<api.models.IAvailableUserActions>> {
        const isUserExist = await this.getUser(request.email);
        const registrationToken = tokenGen(12);

        let createUserQuery =
        `INSERT INTO Users
			(username, regToken, crypt_pass, FirstName, LastName, Country, City, Birthday, `;
        
        if (request.Status) {
            createUserQuery += `Status, `
        }

        createUserQuery += `email, phone, rating`;

        if (request.avatar) {
            createUserQuery += `, avatar`;
        }
        createUserQuery += `) 
        VALUES (
            '${request.username}',
            '${registrationToken}',
            '${request.password}',
            '${request.FirstName}',
            '${request.LastName}',
            '${request.Country}',
            '${request.City}',
            '${request.Birthday}'`;
        
        if (request.Status) {
            createUserQuery += `, '${request.Status}'`;
        }

        createUserQuery += `, '${request.email}', '${request.phone}', 80`;

        if (request.avatar) {
            createUserQuery += `, '${request.avatar}'`;
        }

        createUserQuery += `)`;

        return new Promise(async (
            resolve: (value: socket.ISocketErrorResponse<api.models.IAvailableUserActions>) => void,
            reject: (reason: socket.ISocketErrorResponse<api.models.IAvailableUserActions>) => void
        ) => {

            if (Boolean(isUserExist)) {
                return reject({
                    status: 'Server Error',
                    operation: 'User Editor Response',
                    data: {
                        requestFor: 'Create User',
                        response: 'User with this email is already exist'
                    }
                });
            };
            this.dbConnector.query(createUserQuery,
                async (err, userData) => {
                    if (err) {
                        // Если ошибка подключения к бд
                        return reject({
                            status: 'SQL Error',
                            operation: 'User Editor Response',
                            data: {
                                requestFor: 'Create User',
                                response: err.message
                            }
                        });
                    }
                    else {
                        const rawUser = await this.getUser(request.email);
                        if (rawUser) {
                            if (request.avatar) {
                                this.saveUserAvatar(rawUser.idUsers, request.avatar);
                            }
                            await this.sendVerificationEmail(rawUser.email, rawUser.username, registrationToken)
                                .then(() => {
                                    resolve({
                                        status: 'OK',
                                        operation: 'User Editor Response',
                                        data: {
                                            requestFor: 'Create User',
                                            response: 'Success'
                                        }
                                    });
                                })
                                .catch(error => {
                                return reject({
                                        status: 'Server Error',
                                        operation: 'User Editor Response',
                                        data: {
                                            requestFor: 'Create User',
                                            response: error
                                        }
                                    });
                                })
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
                if (request.avatar) {
                    this.saveUserAvatar(request.idUsers, request.avatar);
                }
                updateUserQuery += ` avatar = '${request.avatar}',`;
            };

            updateUserQuery += ` idUsers = ${userId} WHERE idUsers=${userId}`;

            this.dbConnector.query(updateUserQuery,
                async (err, userData) => {
                    if(err) {
                        // Если ошибка подключения к бд
                        return reject({
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

    public async getUser(userSearchData: number | string): Promise<api.models.IUser | undefined> {
        let rawGetUserQuery =
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
            FROM Users `;
            
        if (typeof userSearchData === 'number') {
            rawGetUserQuery += `WHERE idUsers=${userSearchData}`;
        }
        if (typeof userSearchData === 'string') {
            rawGetUserQuery +=
                `WHERE email='${userSearchData}'
                 OR username='${userSearchData}'`;
        }
        const dbUser = await this.dbConnector.promise().query(rawGetUserQuery);
        return parseData<api.models.IUser[]>(dbUser[0])[0]
    }

    private saveUserAvatar(userId: number, avatar: string) {
        const newAvatar = avatar.replace(/^data:([A-Za-z-+\/]+);base64,/, '');
            if (!fs.existsSync(this.userAvatarDirectory)) {
                fs.mkdirSync(this.userAvatarDirectory);
            }
            if (!fs.existsSync(`${this.userAvatarDirectory}/${userId}`)) {
                fs.mkdirSync(`${this.userAvatarDirectory}/${userId}`);
            }
            fs.writeFileSync(`${this.userAvatarDirectory}/${userId}/avatar.jpg`, newAvatar, 'base64');
    }

    private async sendVerificationEmail(toEmail: string, toUser: string, token: string): Promise<'OK' | string> {
        let ip = '10.15.0.96:5001';
        await http.get('https://api.ipify.org', (res) => {
            res.on('data',(body)=> ip = body)
        });


        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            auth: {
                user: 'alexoid1999@gmail.com',
                pass: 'maypxwvnrxtovkjd',
            }
        });

        const htmlEmail =
            `<div>
				<h1>Welcome, ${toUser} </h1>
				<p>If you see this message, <br/>
					your e-mail was used to registration in new social network 'Eternal Radiance'
				</p>
				<p>If that was really you, please 
					<a href='http://${ip}/dyploma/userEditor.php?token=${token}&user=${toUser}'>confirm this</a>
				</p>
			</div>`;

        const emailOptions: Mail.Options = {
            from: 'alexoid1999@gmail.com',
            to: toEmail,
            subject: 'ERA Email confirmation',
            html: htmlEmail
        }

        return new Promise((resolve, reject) => {
            transporter.sendMail(emailOptions, (err, info) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve('OK')
                }
            })
        })
    }
}


export default UserSetter;