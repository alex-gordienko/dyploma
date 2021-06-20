export interface ILogInAction {
  type: "login";
  userData: IFullDataUser;
}

export interface IIsLoadingAction {
  status: boolean;
  type: "isLoading";
}

export interface ISetProgressAction {
  message: string;
  type: "setProgress";
}

export interface ISetErrorMessageAction {
  message: string;
  type: "setError";
}

export interface ISaveUserDataAction {
  type: "SaveUserData" | "GetSavedUserData";
}

export interface ILogOutAction {
  type: "logout";
}

export interface IGetPostsAction {
  posts: IPost[];
  userName: string | undefined;
  type: "getPosts";
}

export interface IGetCountriesAndCitiesAction {
  countries: ICountriesAndCities;
  type: "getCountriesAndCities";
}

export interface ICreatePostAction {
  type: "CreatePost";
  newPost: IPost;
}

export interface IEditPostAction {
  type: "EditExistPost";
  editedPost: IPost;
}
export interface ISetEditedPostAction {
  type: "CheckPost";
  searchedPost: IPost | "new" | "No Results Found.";
}

export interface IProfileAction {
  type: "CreateUser" | "EditUser";
  userData: IFullDataUser;
}

export interface IAppState {
  token: string;
  socket: SocketIOClient.Socket;
  isReady: boolean;
  progressMessage: string;
  errorMessage: string;
  isLogin: boolean;
  country_city: ICountriesAndCities;
  user: IFullDataUser;
  searchedUserPosts: IPost[];
  editedPost: IPost | "new" | "No Results Found.";
}

export interface IFullDataUser {
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

export interface ISavedUser {
  username: string;
  email: string;
  password: string;
}

export interface IUserPosition {
  idUser: number;
  position: {
    lat: number;
    lng: number;
  };
}

export interface ICountriesAndCities {
  country: Array<{
    id: number;
    name_en: string;
  }>;
  city: Array<{
    id: number;
    country_id: number;
    name_en: string;
  }>;
}

export interface IFilterProperties {
  username: string;
  contry: string;
  city: string;
  date: string;
}

export interface ISearchedUser {
  Country: string;
  City: string;
  Birthday: string;
  FirstName: string;
  LastName: string;
  Status: string;
  avatar: string;
  idUsers: number;
  regDate: string;
  isBanned: boolean;
  isConfirm: boolean;
  isOnline: boolean;
  isMyFriend: boolean;
  isSubscribition: boolean;
  isBlocked: boolean;
  lastOnline: string;
  phone: number;
  rating: number;
  username: string;
}

export interface IPost {
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

export interface IComment {
  content: string;
  date: string;
  author: string;
  userAvatar?: string;
  userRating: number;
  rating?: number;
}

export interface IPhotoBuffer {
  name: string;
  blob: string;
}

export interface IChat {
  chatID: string;
  avatar: string;
  type: string;
  name: string;
  messages: IMessage[];
  members: IMember[];
}

export interface IMember {
  idUsers: number;
  username: string;
  rating: number;
  avatar: string;
}

export interface IMessage {
  id: number;
  id_author: number;
  isHiddenFromAuthor: boolean;
  time: string;
  type: "text" | "postredirect";
  message: string | IPost;
}

export interface IPreviewChat {
  avatar: string;
  chatID: string;
  type: string;
  name: string;
  lastMessage: IMessage;
  members: IMember[];
}
