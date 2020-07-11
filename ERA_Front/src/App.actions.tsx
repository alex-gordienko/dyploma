/* tslint:disable */
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

const isLoading =(status: boolean):IIsLoadingAction=>({
  status,
  type: "isLoading"
});

const setProgress = ( message: string ):ISetProgressAction=>({
  type: "setProgress",
  message
})

const setErrorMessage = ( message: string ):ISetErrorMessageAction=>({
  type: "setError",
  message
})

const logIn = ( userData:IFullDataUser ): ILogInAction => ({
  userData,
  type: "login"
});

const logOut = (): ILogOutAction => ({
  type: "logout"
});

const SaveProgressOnLoadingPosts = (posts:IPost[], userName?:string): IGetPostsAction => ({
  userName,
  posts,
  type: "getPosts"
});

const getCountriesAndCities = ( countries: ICountriesAndCities): IGetCountriesAndCitiesAction=>({
  countries,
  type: "getCountriesAndCities"
});

const createPost = (newPost: INewPost): ICreatePostAction => ({
  type: "CreatePost",
  newPost
});

const editPost = (editedPost: IPost): IEditPostAction =>({
  type: "EditExistPost",
  editedPost
})

const setEditedPost = (searchedPost: IPost | "new" | "No Results Found."): ISetEditedPostAction =>({
  type: "CheckPost",
  searchedPost
})

const editProfile = (userData: IFullDataUser): IProfileAction =>({
  type: "EditUser",
  userData
});

const createProfile = (userData: IFullDataUser): IProfileAction =>({
  type: "CreateUser",
  userData
});

const saveUserDataToCookie = ():ISaveUserDataAction =>({
  type: "SaveUserData"
})

export { 
  isLoading,
  setProgress,
  setErrorMessage,
  logIn, 
  saveUserDataToCookie,
  logOut,  
  SaveProgressOnLoadingPosts,
  getCountriesAndCities, 
  createPost,
  editPost,
  setEditedPost, 
  editProfile,
  createProfile
};
