declare namespace api.models {
  type IAvailablePostActions =
    | "get all posts"
    | "get user public posts"
    | "get user private posts"
    | "get one post"
    | "create post"
    | "edit post"
    | "get comments"
    | "create comment";
  interface IFilter {
    username: string;
    country: string;
    city: string;
    date: string;
  }

  interface IGetPostToEditRequest {
    postID: number;
  }

  interface IGetPostsRequest {
    username: string;
    currentUser: number;
    filters: IFilter;
    postIDs: number[];
  }

  interface ICreateCommentRequest {
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
