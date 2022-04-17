declare namespace data {
    interface ISearchedUser {
        Country: string;
        City: string;
        Birthday: string;
        FirstName: string;
        LastName: string;
        Status: string;
        avatar: string;
        idUsers: string;
        regDate: string;
        isBanned: number;
        isConfirm: number;
        isOnline: string;
        isMyFriend?: string;
        isSubscribition?: string;
        isBlocked?: string;
        lastOnline: string;
        phone: number;
        rating: string;
        username: string;
    }
}