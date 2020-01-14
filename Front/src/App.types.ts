/* tslint:disable */
export interface ILogInAction {
  type: "login";
  bufLogin: string;
  bufEmail: string;
  bufPass: string;
}

export interface IGetStateAction {
  type: "getState";
}

export interface ILogOutAction {
  type: "logout";
}

export interface IUpdateStateAction {
  type: "updateState";
}

export interface IGetPostsAction {
  type: "getPosts";
}

export interface ILoadPhotoesAction {
  type: "loadPhotoes";
  buffer: IPhotoBuffer;
}

export interface ICreatePostAction {
  type: "CreatePost";
  newPost: INewPost;
}

export interface IAppState {
  isLogin: boolean;
  user: IUser;
  posts: IPost[];
  photoBuffer: IPhotoBuffer[];
}

export interface IUser {
  Birthday: string;
  FirstName: string;
  LastName: string;
  Status: string;
  avatar: string;
  email: string;
  idUsers: number;
  phone: number;
  rating: number;
  username: string;
}

export interface IPost {
  comment: string;
  date: string;
  Name: string;
  idPost: string;
  lat: string;
  lng: string;
  rating: string;
  type: string;
  username: string;
  photoes: IPhotoBuffer[];
}

export interface INewPost {
  name: string;
  isPrivate: boolean;
  description: string;
  photoes: IPhotoBuffer[];
  position: {
    lat: number;
    lng: number;
  };
  dateTime: string;
}

export interface IPhotoBuffer {
  name: string;
  blob: string;
}
