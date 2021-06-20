import {
  IIsLoadingAction,
  ISetProgressAction,
  ISetErrorMessageAction,
  ILogInAction,
  ISaveUserDataAction,
  ILogOutAction,
  IGetPostsAction,
  INewPost,
  ICreatePostAction,
  IEditPostAction,
  ISetEditedPostAction,
  IProfileAction,
  IFullDataUser,
  IPost,
  ICountriesAndCities,
  IGetCountriesAndCitiesAction,
  ISearchedUser
} from "./App.types";

const isLoading = (status: boolean): IIsLoadingAction => ({
  status,
  type: "isLoading"
});

const setProgress = (message: string): ISetProgressAction => ({
  message,
  type: "setProgress"
});

const setErrorMessage = (message: string): ISetErrorMessageAction => ({
  message,
  type: "setError"
});

const logIn = (userData: IFullDataUser): ILogInAction => ({
  type: "login",
  userData
});

const logOut = (): ILogOutAction => ({
  type: "logout"
});

const getCountriesAndCities = (
  countries: ICountriesAndCities
): IGetCountriesAndCitiesAction => ({
  countries,
  type: "getCountriesAndCities"
});

const createPost = (newPost: IPost): ICreatePostAction => ({
  newPost,
  type: "CreatePost"
});

const editPost = (editedPost: IPost): IEditPostAction => ({
  editedPost,
  type: "EditExistPost"
});

const setEditedPost = (
  searchedPost: IPost | "new" | "No Results Found."
): ISetEditedPostAction => ({
  searchedPost,
  type: "CheckPost"
});

const editProfile = (userData: IFullDataUser): IProfileAction => ({
  type: "EditUser",
  userData
});

const createProfile = (userData: IFullDataUser): IProfileAction => ({
  type: "CreateUser",
  userData
});

const saveUserDataToCookie = (): ISaveUserDataAction => ({
  type: "SaveUserData"
});

export {
  isLoading,
  setProgress,
  setErrorMessage,
  logIn,
  saveUserDataToCookie,
  logOut,
  getCountriesAndCities,
  createPost,
  editPost,
  setEditedPost,
  editProfile,
  createProfile
};
