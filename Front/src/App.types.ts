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
  posts: api.models.IPost[];
  userName: string | undefined;
  type: "getPosts";
}

export interface IGetCountriesAndCitiesAction {
  countries: api.models.ICountriesAndCities;
  type: "getCountriesAndCities";
}

export interface ISetEditedPostAction {
  type: "CheckPost";
  searchedPost: api.models.IPost | "new" | "No Results Found.";
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
  country_city: api.models.ICountriesAndCities;
  user: IFullDataUser;
  searchedUserPosts: api.models.IPost[];
  editedPost: api.models.IPost | "new" | "No Results Found.";
}

export interface IFullDataUser {
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

export interface IComment {
  content: string;
  date: string;
  author: string;
  userAvatar?: string;
  userRating: number;
  rating?: number;
}
