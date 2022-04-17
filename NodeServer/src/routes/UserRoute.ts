import { Socket } from 'socket.io';
import UserGetter from './DataParserScripts/userGetter';
import UserSetter from './DataParserScripts/userSetter';

const UserRoute = (userGetter: UserGetter, userSetter: UserSetter, socket: Socket ) => {
 socket.on<socket.AvailableRequestRoutes>('User Editor Request',
                async (msg: socket.ISocketRequest<api.models.IUser, api.models.IAvailableUserActions>) => {
                    try {
                        switch (msg.data.requestFor) {
                            case 'Create User': {
                                console.log(`\n\x1b[33m User ${msg.data.options.username} registration`);
                                userSetter.createUser(msg.data.options)
                                    .then(resolved => {
                                        console.log(`\t\x1b[32m Successful registered...`);
                                        socket.emit<socket.AvailableResponseRoutes>(
                                            'User Editor Response', resolved
                                        )
                                    })
                                    .catch(error => {
                                        console.log(`\t\x1b[31m Client Error: \n\t${JSON.stringify(error)}`);
                                        socket.emit<socket.AvailableResponseRoutes>(
                                            'User Editor Response', error)
                                    });
                                break;
                            }
                            case 'Edit User': {
                                console.log(`\n\x1b[33m User ${userGetter.name} want's to change info about himself`);
                                userSetter.editUser(userGetter.id, msg.data.options)
                                    .then(resolve => {
                                        return userSetter.getUser(resolve.data.response.idUsers)
                                    })
                                    .then(updatedUserData => {
                                        const response: socket.ISocketResponse<api.models.IUser, api.models.IAvailableUserActions> = {
                                            operation: 'User Editor Response',
                                            status: 'OK',
                                            data: {
                                                requestFor: 'Edit User',
                                                response: updatedUserData!
                                            }
                                        }
                                        socket.emit<socket.AvailableResponseRoutes>(
                                            'User Editor Response', response
                                        )
                                    }).catch(rejected => {
                                        console.log(`\t\x1b[31m User Creating Error: \n\t${rejected}`);
                                        socket.emit<socket.AvailableResponseRoutes>(
                                            'User Editor Response', rejected)
                                    });
                                break;
                            }
                            default: {
                                console.log(`\x1b[0m Unknown operation \x1b[31m '${msg.operation}'`)
                                socket.emit<socket.AvailableResponseRoutes>(
                                    'User Editor Response',
                                    {
                                        operation: msg.operation,
                                        status: 'Unknown operation',
                                        data: msg.data
                                    })
                            }
                        }
                    }
                    catch (e) {
                        console.log(`\t\x1b[31m Client ${msg.data.options.username} connection Error: \n\t${e}`);
                        socket.emit<socket.AvailableResponseRoutes>(
                            'User Editor Response',
                            {
                                status: 'Server Error',
                                data: {
                                    requestFor: msg.data.requestFor,
                                    response: e
                                }
                            })
                    }
            })

            socket.on<socket.AvailableRequestRoutes>('User Searcher Request',
                async (msg: socket.ISocketRequest<api.models.ISearchUserRequest, api.models.IAvailableUserActions>
                ) => {
                    switch (msg.data.requestFor) {
                        case 'Search Peoples': {
                            console.log(`\n\x1b[33m User ${userGetter.name} is trying to search users...`);
                            userGetter.searchPeople(msg.data.options, userGetter.id)
                                .then(result => {
                                    console.log(`\t\x1b[32m Found ${result.data.response.length} results...`);
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'User Searcher Response',
                                        result
                                    )
                                })
                                .catch(rejected => {
                                    console.log(`\t\x1b[31m Error when search: ${rejected.data.response}...`);
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'User Searcher Response',
                                        rejected
                                    )
                                })
                            break;
                        }
                        case 'Search User': {
                            console.log(`\n\x1b[33m User ${userGetter.name} is trying to load ${msg.data.options.searchedUser}'s profile...`);
                            userGetter.loadUserProfile(msg.data.options)
                                .then(searchResult => {
                                    console.log(`\t\x1b[32m Found userGetter. Sending result...`);
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'User Searcher Response',
                                        searchResult
                                    )
                                })
                                .catch(rejected => {
                                    console.log(`\t\x1b[31m Error when search: ${JSON.stringify(rejected)}...`);
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'User Searcher Response',
                                        rejected
                                    )
                                });
                            break;
                        }
                        case 'Search Friends': {
                            console.log(`\n\x1b[33m User ${userGetter.name} is trying to load ${msg.data.options.searchedUser}'s friendList...`);
                            userGetter.searchFriends(msg.data.options)
                                .then(searchResult => {
                                    console.log(`\t\x1b[32m Found user. Sending result...`);
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'User Searcher Response',
                                        searchResult
                                    )
                                })
                                .catch(rejected => {
                                    console.log(`\t\x1b[31m Error when search: ${JSON.stringify(rejected)}...`);
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'User Searcher Response',
                                        rejected
                                    )
                                });
                            break;
                        }
                        case 'Search Invites': {
                            console.log(`\n\x1b[33m User ${userGetter.name} is trying to load inviteList...`);
                            userGetter.searchInvites(msg.data.options, userGetter.id)
                                .then(searchResult => {
                                    console.log(`\t\x1b[32m Found users. Sending result...`);
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'User Searcher Response',
                                        searchResult
                                    )
                                })
                                .catch(rejected => {
                                    console.log(`\t\x1b[31m Error when search: ${JSON.stringify(rejected)}...`);
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'User Searcher Response',
                                        rejected
                                    )
                                });
                            break;
                        }
                        case 'Search Blocked': {
                           console.log(`\n\x1b[33m User ${userGetter.name} is trying to load blockList...`);
                            userGetter.searchBlocked(msg.data.options, userGetter.id)
                                .then(searchResult => {
                                    console.log(`\t\x1b[32m Found users. Sending result...`);
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'User Searcher Response',
                                        searchResult
                                    )
                                })
                                .catch(rejected => {
                                    console.log(`\t\x1b[31m Error when search: ${JSON.stringify(rejected)}...`);
                                    socket.emit<socket.AvailableResponseRoutes>(
                                        'User Searcher Response',
                                        rejected
                                    )
                                });
                            break;
                        }
                        default: {
                            console.log(`\x1b[0m Unknown operation \x1b[31m '${msg.operation}'`);
                            socket.emit<socket.AvailableResponseRoutes>(
                                'User Searcher Response',
                                {
                                    operation: msg.operation,
                                    status: 'Unknown operation'
                                })
                        }
                    }
                })
};

export default UserRoute;