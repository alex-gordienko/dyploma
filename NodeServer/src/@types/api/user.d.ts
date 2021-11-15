declare namespace api.models {
    interface ILoginRequest {
        login: string;
        pass: string;
    }
    interface IUser {
        Country: string;
        City: string;
        Birthday: string;
        FirstName: string;
        LastName: string;
        Status: string;
        avatar: string;
        email: string;
        regDate: string;
        isBanned: boolean;
        isConfirm: boolean;
        idUsers: number;
        phone: number;
        rating: number;
        username: string;
        password: string;
    }

}