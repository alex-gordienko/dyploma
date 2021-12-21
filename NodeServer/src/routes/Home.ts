import UserGetter from './DataParserScripts/userGetter';
import UserSetter from './DataParserScripts/userSetter';
import PostGetter from './DataParserScripts/postGetter';
import PostSetter from './DataParserScripts/postSetter';
import CountriesGetter from './DataParserScripts/countriesGetter';
import { Connection } from 'mysql2';
import http from 'http';
import https from 'https';
import { Server, Socket } from 'socket.io';
import { connectDB, connectCountriesDB } from '..';
import ChatRoute from './ChatRoute';
import PostRoute from './PostRoute';
import UserRoute from './UserRoute';

const isConnectedToDb = (con: any): con is Connection =>
    con.config !== undefined;

const Home = (server: https.Server | http.Server) => {
    const io = new Server(server, {
        serveClient: false,
        allowEIO3: true,
        pingTimeout: 60000,
        cors: {
            origin: '*',
            credentials: true
        }
    });

    io.sockets.on('connection', async (socket: Socket) => {
        console.log('\n\x1b[0m New connection');
        // Для каждого сокета создаётся экземпляр коннектора БД, пользователя и парсера
        const con = await connectDB();
        const countriesCon = await connectCountriesDB();

        if (!con) {
            console.error('Error connection to db');
            socket.emit('Client Login Response',
                {
                    status: 'Server Error',
                    data: {
                        requestFor: 'Connection',
                        response: 'Can\'t connect to db'
                     }
                });
            socket.disconnect();
        }

        if (isConnectedToDb(con) && isConnectedToDb(countriesCon)) {
            const countryCity = new CountriesGetter(countriesCon);
            const userGetter = new UserGetter(con);
            const userSetter = new UserSetter(con);
            const postGetter = new PostGetter(con);
            const postSetter = new PostSetter(con);

            // Listeners to chat messaging
            ChatRoute(con, socket, userGetter);

            // Listeners to process post actions
            PostRoute(userGetter, postGetter, postSetter, socket);

            // Listeners to process user data actions
            UserRoute(userGetter, userSetter, socket);

            socket.on<socket.AvailableRequestRoutes>('Get Countries Request',
                async (msg: socket.ISocketRequest<{}, api.models.IAvailableCountriesActions>) => {
                    switch (msg.data.requestFor) {
                        case 'Get Countries': {
                            countryCity.getCountriesAndCities()
                                .then(resolved => {
                                    console.log(`\t\x1b[32m Successful parsing countries...`);
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'Get Countries Response',
                                        resolved
                                    );
                                })
                                .catch(rejected => {
                                    console.log(`\t\x1b[31m Client connection Error: \n\t${rejected}`);
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'Get Countries Response',
                                        rejected
                                    );
                                });
                            break;
                        }
                        default: {
                            console.log(`\x1b[0m Unknown operation \x1b[31m '${msg.operation}'`)
                            socket.emit<socket.AvailableResponseRoutes>(
                                'Get Countries Response',
                                {
                                    operation: msg.operation,
                                    status: 'Unknown operation',
                                    data: msg.data
                                })
                        }
                    }
            })

            socket.on<socket.AvailableRequestRoutes>('Client Login Request',
                async (msg: socket.ISocketRequest<api.models.ILoginRequest, api.models.IAvailableUserActions>) => {
                    if (msg.data.options.login && msg.data.options.login !== '') {
                        console.log(`\x1b[33m Client ${msg.data.options.login} is connecting...`);
                        socket.join(msg.token);
                        try {
                            userGetter.Login(msg.data.options)
                                .then((result: socket.ISocketResponse<api.models.IUser, api.models.IAvailableUserActions>) => {
                                    console.log(`\t\x1b[32m Client ${msg.data.options.login} with token ${msg.token} is connected succesfully`);
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'Client Login Response',
                                        result
                                    );
                                    userGetter.id = result.data.response.idUsers;
                                    userGetter.name = result.data.response.username;
                                    userGetter.token = msg.token;
                                })
                                .catch((rejected) => {
                                    console.log(`\t\x1b[31m Client ${msg.data.options.login} connection Error: \n\t${rejected}`);
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'Client Login Response', rejected
                                    )
                                });
                        }
                        catch (e) {
                            console.log(`\t\x1b[31m Client ${msg.data.options.login} connection Error: \n\t${e}`);
                            socket.emit<socket.AvailableResponseRoutes>(
                                'Client Login Response',
                                {
                                    status: 'Server Error',
                                    data: {
                                        requestFor: msg.data.requestFor,
                                        response: e
                                    }
                                })
                        }
                    }
                });

            socket.on('disconnect', () => {
                console.log(`\t\x1b[36m User ${userGetter.name} has been disconnected...`)
                socket.disconnect();
            })
        }
    })
};

export default Home;