import {
  IIsLoadingAction,
  ISetProgressAction,
  ISetErrorMessageAction,
  ILogInAction,
  ISaveUserDataAction,
  ILogOutAction,
  ISetEditedPostAction,
  IProfileAction,
  IFullDataUser,
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
  countries: api.models.ICountriesAndCities
): IGetCountriesAndCitiesAction => ({
  countries,
  type: "getCountriesAndCities"
});

const setEditedPost = (
  searchedPost: api.models.IPost | "new" | "No Results Found."
): ISetEditedPostAction => ({
  searchedPost,
  type: "CheckPost"
});

const editProfile = (userData: IFullDataUser): IProfileAction => ({
  type: "EditUser",
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
  setEditedPost,
  editProfile
};
