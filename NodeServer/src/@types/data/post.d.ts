declare namespace data {
    interface IPostTable {
        idPost: number;
        Name: string;
        lat: number;
        lng: number;
        comment: string;
        date: string;
        Users_idUsers: number;
        type: number;
        isCheck: boolean;
        isPrivate: boolean;
    }

    interface IPostRating {
        likes: number;
        dislikes: number;
        isLikedByMe: boolean;
        isDislikedByMe: boolean;
    }

    interface IPhotoBuffer {
        name: string;
        blob: string;
    }

    interface IPostComment {
        content: string;
        userAvatar?: string;
        author: string;
        userRating: number;
        date: string;
        rating: number;
    }

    interface IRawPostData extends
        Pick<data.IPostTable, 'idPost' | 'date' | 'Name' | 'lat' | 'lng' | 'type' | 'isPrivate'>,
        Pick<api.models.IUser, 'username'> {
            description: string;
            idUser: number;
    }

    interface IPost extends Omit<data.IRawPostData, 'lat' | 'lng'> {
        position: {
            lat: number;
            lng: number;
        };
        rating: data.IPostRating;
        photoes: IPhotoBuffer[];
    }
}