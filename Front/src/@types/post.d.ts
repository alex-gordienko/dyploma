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
    postIDs: number[];
  }

  interface ICreateCommentAction {
    content: string;
    rating: number;
    date: string;
    idPost: number;
    idUser: number;
  }

  interface IPhotoBuffer {
    name: string;
    blob: string;
  }
}
