declare namespace api.models {
    interface IFilter {
        username: string;
        country: string;
        city: string;
        date: Date;
    }

    interface IGetPostsRequest {
        username: string;
        currentUser: number;
        filters: IFilter;
        postIDs: string[]
    }

    interface IPhotoBuffer {
        name: string;
        blob: string;
    }

    interface IPost {
        description: string;
        date: string;
        Name: string;
        idPost: number;
        isPrivate: number;
        position: {
            lat: number;
            lng: number;
        };
        rating: {
            likes: number;
            dislikes: number;
            isLikedByMe: boolean;
            isDislikedByMe: boolean;
        };
        type: number;
        username: string;
        idUser: number;
        photoes: IPhotoBuffer[];
    }
}