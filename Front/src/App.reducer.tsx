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
  IProfileAction,
  ISetEditedPostAction,
  IGetCountriesAndCitiesAction,
  IFullDataUser,
  IPost
} from "./App.types";

import { sendToSocket, ServerAdress } from "../src/backend/httpGet";
import io from "socket.io-client";

import {
  saveStateInStorage,
  getStateFromStorage,
  deleteStateFromStorage
} from "./shared/storage/localStorage.actions";

import Photo1 from "./assets/img/Space1.jpg";
import Photo2 from "./assets/img/Space2.jpg";
import Photo3 from "./assets/img/Space3.jpg";
import defaultAvatar from "./assets/img/DefaultPhoto.jpg";

const defaultUser: IFullDataUser = {
  Birthday: "",
  City: "",
  Country: "",
  FirstName: "",
  LastName: "",
  Status: "",
  avatar: defaultAvatar,
  email: "",
  idUsers: 0,
  isBanned: false,
  isConfirm: true,
  password: "",
  phone: 0,
  rating: 0,
  regDate: "",
  username: ""
};

export const nullPhoto: IPhotoBuffer[] = [
  { name: "Example1", blob: Photo1 },
  { name: "Example2", blob: Photo2 },
  { name: "Example3", blob: Photo3 }
];
export const nullPost: IPost = {
  Name: "",
  date: "",
  description: "",
  idPost: 0,
  idUser: 0,
  isPrivate: 0,
  photoes: nullPhoto,
  position: { lat: 0, lng: 0 },
  rating: { likes: 0, dislikes: 0, isLikedByMe: false, isDislikedByMe: false },
  type: 0,
  username: ""
};

export type IAppActions =
  | IIsLoadingAction
  | ISetProgressAction
  | ISetErrorMessageAction
  | ILogInAction
  | ISaveUserDataAction
  | ILogOutAction
  | IGetPostsAction
  | IGetCountriesAndCitiesAction
  | ISetEditedPostAction
  | IProfileAction;

const saveData = (name: "savedUser", res: string) => {
  saveStateInStorage(name, 60, res);
};

export const getData = (name: "savedUser") => {
  const data = getStateFromStorage(name);
  return data;
};

const tokenGen = (length: number) => {
  let rnd = "";
  while (rnd.length < length) {
    rnd += Math.random()
      .toString(36)
      .substring(2);
  }
  return rnd.substring(0, length);
};

const initialState: IAppState = {
  country_city: {
    city: [
      {
        country_id: 0,
        id: 0,
        name_en: ""
      }
    ],
    country: [
      {
        id: 0,
        name_en: ""
      }
    ]
  },
  editedPost: nullPost,
  errorMessage: "",
  isLogin: false,
  isReady: false,
  progressMessage: "Loading...",
  searchedUserPosts: [],
  socket: io.connect(ServerAdress),
  token: tokenGen(12),
  user: defaultUser
};

const reducer = (state: IAppState, action: IAppActions) => {
  state.socket.on("Create User", (res: any) => {
    if (res.operation === "Create User") {
      if (JSON.stringify(res.result) === '"Successful"') {
        alert("Successful. User has been created. Please, Log In");
      } else {
        state.errorMessage = res.result;
      }
    }
  });

  // error => state.errorMessage="Connection Error. Is server online?"

  switch (action.type) {
    case "EditUser": {
      return {
        ...state,
        user: action.userData
      };
    }
    case "getCountriesAndCities": {
      return { ...state, country_city: action.countries };
    }
    case "CheckPost": {
      if (action.searchedPost) {
        return {
          ...state,
          editedPost: action.searchedPost
        };
      } else {
        return { ...state };
      }
    }
    case "login": {
      // console.log("LogIn is work");
      return {
        ...state,
        isLogin: action.userData.idUsers === 0 ? false : true,
        user: action.userData
      };
    }
    case "SaveUserData": {
      const postData =
        '{"username": "' +
        state.user.username +
        '",' +
        ' "password": "' +
        state.user.password +
        '"' +
        "}";
      saveData("savedUser", postData);
      return { ...state };
    }
    case "isLoading": {
      return {
        ...state,
        isReady: action.status
      };
    }
    case "setProgress": {
      return {
        ...state,
        progressMessage: action.message
      };
    }
    case "setError": {
      return {
        ...state,
        errorMessage: action.message
      };
    }
    case "logout": {
      // console.log("LogOut is work");
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
