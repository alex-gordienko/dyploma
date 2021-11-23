declare namespace api.models {
    type IAvailableUserActions =
        | 'Client Login Request'
        | 'Client Login Response'
        | 'Create User'
        | 'Edit User'
        | 'Search User'
        | 'Search Peoples'
        | 'Search Friends'
        | 'Search Invites'
        | 'Search Blocked';
    
    interface ILoginRequest {
        login: string;
        pass: string;
    }

    interface ISearchUserRequest {
        currentUser: string;
        searchedUser: string;
        filters: api.models.IFilter;
        page: number;
    }

    interface IUser {
        Country: string;
        City: string;
        Birthday: string;
        FirstName: string;
        LastName: string;
        Status: string | null;
        avatar: string | null;
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

    interface ISearchedUser {
        Country: string;
        City: string;
        Birthday: string;
        FirstName: string;
        LastName: string;
        Status: string;
        avatar: string | null;
        idUsers: number;
        regDate: string;
        isBanned: boolean;
        isConfirm: boolean;
        isOnline: boolean;
        isMyFriend?: boolean;
        isSubscribition?: boolean;
        isBlocked?: boolean;
        lastOnline: string;
        phone: number;
        rating: number;
        username: string;
    }
}