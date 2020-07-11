/* tslint:disable */
import {
  IIsLoadingAction,
  ISetProgressAction,
  ISetErrorMessageAction,
  ILogInAction,
  ISaveUserDataAction,
  ILogOutAction,
  IGetPostsAction,
  IAppState,
  IPhotoBuffer,
  ICreatePostAction,
  IEditPostAction,
  IProfileAction,
  ISetEditedPostAction,
  IGetCountriesAndCitiesAction,
  IFullDataUser
} from "./App.types";

import { httpPost } from "../src/backend/httpGet";

import { 
  saveStateInStorage, 
  getStateFromStorage, 
  deleteStateFromStorage} from "./shared/storage/localStorage.actions";

import Photo1 from "./assets/img/Space1.jpg";
import Photo2 from "./assets/img/Space2.jpg";
import Photo3 from "./assets/img/Space3.jpg";
import defaultAvatar from './assets/img/DefaultPhoto.jpg'

const defaultUser:IFullDataUser= {
  Country: "",
  City: "",
  Birthday: "",
  FirstName: "",
  LastName: "",
  Status: "",
  avatar: defaultAvatar,
  email: "",
  idUsers: 0,
  regDate: "",
  isBanned: false,
  isConfirm: true,
  phone: 0,
  rating: 0,
  username: "",
  password: ""
}

export const nullPhoto: IPhotoBuffer[] = [
  {
    name: "Example1",
    blob: Photo1
  },
  {
    name: "Example2",
    blob: Photo2
  },
  {
    name: "Example3",
    blob: Photo3
  }
];

export type IAppActions =
  | IIsLoadingAction
  | ISetProgressAction
  | ISetErrorMessageAction
  | ILogInAction
  | ISaveUserDataAction
  | ILogOutAction
  | IGetPostsAction
  | IGetCountriesAndCitiesAction
  | ICreatePostAction
  | IEditPostAction
  | ISetEditedPostAction
  | IProfileAction;

const initialState: IAppState = {
  isReady: false,
  isLogin: false,
  progressMessage: "Loading...",
  errorMessage: "",
  allPosts: [],
  country_city:{
    country:[{
      id:0,
      name_en:""
    }],
    city:[{
      id:0,
      country_id:0,
      name_en:""
    }]
  },
  user: defaultUser,
  searchedUserPosts:[],
  editedPost: null
};

const saveData = (name: "savedUser", res: string) => {
  saveStateInStorage(name, 60, res);
};

export const getData = (name: "savedUser") => {
  let data = getStateFromStorage(name);
  return data;
};


const reducer = (state: IAppState, action: IAppActions) => {
  const sendData = (
    url: string,
    datatype: "string" | "json",
    data: string
  ) => {
  httpPost(url, datatype, data)
      .then(
        (response: any) => {
          const res: { operation: string; result: string } = JSON.parse(response);
          console.log(res);
          if(res.operation==="createpost"){
            if (JSON.stringify(res.result) === '"Successful"') {
              alert("Successful! Please, wait until your post will accept");
            } else {
              state.errorMessage=res.result;
            }
          }
          else if(res.operation==="Edit User"){
            if (JSON.stringify(res.result) === '"Successful"') {
              alert("Successful. Profile data has changed");
            } else {
              state.errorMessage=res.result;
            }
          }
          else if(res.operation==="Create User"){
            if (JSON.stringify(res.result) === '"Successful"') {
              alert("Successful. User has been created. Please, Log In");
            } else {
              state.errorMessage=res.result;
            }
          }
        },
        error => state.errorMessage="Connection Error. Is server online?"
      )
      .catch(function(err) {
        state.errorMessage="Connection Error. Is server online?"
      });
  };
  switch (action.type) {
    case "EditUser":{
      //console.log("Edit Existing user", action.userData);
      const postData =
        '{ "operation": "Edit User"' +
        ', "json": ' +
        JSON.stringify(action.userData) +
        "}";
      sendData("userEditor.php", "json", postData);
      return {
        ...state,
        user: action.userData
      };
    }
    case "CreateUser":{
      //console.log("Creating New user", action.userData);
      if(action.userData.avatar === defaultAvatar) action.userData.avatar = "";
      const postData =
        '{ "operation": "Create User"' +
        ', "json": ' +
        JSON.stringify(action.userData) +
        "}";
      sendData("userEditor.php", "json", postData);
      return {
        ...state
      };
    }
    case "CreatePost": {
      //console.log("Createing New Post", action.newPost);
      const postData ='{ "operation": "create post"'+
        ', "json": {' +
        ' "idUser": ' +
        state.user.idUsers +
        ', "data": ' +
        JSON.stringify(action.newPost) +
        "}}";
      sendData("createpost.php", "json", postData);
      return {
        ...state
      };
    }
    case "EditExistPost":{
      //console.log("Edited info about post ",action.editedPost.idPost);
      console.log(action.editedPost);
      if(action.editedPost !== state.editedPost){
        if(state.user.idUsers === action.editedPost.idUser){
          const postData ='{ "operation": "edit post"'+
          ', "json": {' +
          ' "idUser": ' +
          state.user.idUsers +
          ', "data": ' +
          JSON.stringify(action.editedPost) +
          "}}";
          sendData("createpost.php", "json", postData);
        }
      }
      else alert("There is no changes");
      return { ...state };
    }
    case "getPosts":{
      console.log("Reducer gettin "+action.posts.length+" posts");
      if(action.userName){
        return {
          ...state,
          searchedUserPosts: action.posts
          }
      }
      else {
        state.allPosts = action.posts;
        return {...state}
      }
      
    }
    case "getCountriesAndCities":{
      return {...state, country_city: action.countries}
    }
    case "CheckPost":{
      if(action.searchedPost){
        return {
          ...state,
            editedPost: action.searchedPost
        }
      }
      else return {...state}     
    }
    case "login": {
      //console.log("LogIn is work");
      return {
        ...state,
        user: action.userData,
        isLogin: action.userData.idUsers===0? false: true
      };
    }
    case "SaveUserData":{
      const postData ='{"username": "'+state.user.username+'",'+
                      ' "password": "'+state.user.password+'"'+
                      '}';
      saveData("savedUser", postData);
      return { ...state }
    }
    case "isLoading":{
      return{
        ...state,
        isReady: action.status
      }
    }
    case "setProgress":{
      return{
        ...state,
        progressMessage: action.message
      }
    }
    case "setError":{
      return{
        ...state, 
        errorMessage: action.message
      }
    }
    case "logout": {
      //console.log("LogOut is work");
      deleteStateFromStorage("savedUser");
      return {
        ...state,
        isLogin: false,
        user: defaultUser
      };
    }
    default: {
      return state;
    }
  }
};

export { initialState, reducer };
