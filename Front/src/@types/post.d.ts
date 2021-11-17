declare namespace api.models {
  type IAvailablePostActions =
    | "get all posts"
    | "get user public posts"
    | "get user private posts"
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
