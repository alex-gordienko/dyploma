import { Connection } from 'mysql2';
declare class User {
    protected userID: number;
    protected username: string;
    protected identificator: string;
    protected dbConnector: Connection;
    constructor(dbConnector: Connection);
    get id(): number;
    set id(id: number);
    get name(): string;
    set name(name: string);
    get token(): string;
    set token(t: string);
    Login(user: api.models.ILoginRequest): Promise<socket.ISocketResponse<api.models.IUser, api.models.IAvailableUserActions>>;
    searchPeople(request: api.models.ISearchUserRequest): Promise<socket.ISocketResponse<api.models.ISearchedUser[], api.models.IAvailableUserActions>>;
}
export default User;
//# sourceMappingURL=userGetter.d.ts.map