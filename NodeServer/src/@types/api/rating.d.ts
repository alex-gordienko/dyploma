declare namespace api.models {
    type IAvailableRatingActions =
        | 'set post rating';
    
    interface ISetPostRatingRequest {
        idUser: number;
        idPost: number;
        setting: 'like' | 'dislike';
        type: 'new' | 'inversion' | 'from like' | 'from dislike'
    }

    interface ISetPostRatingResponse {
        rating: api.models.IPost['rating'];
    }
}
