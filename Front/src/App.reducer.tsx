/* tslint:disable */
import {
  ILogInAction,
  IGetStateAction,
  ILogOutAction,
  IUpdateStateAction,
  IGetPostsAction,
  IAppState,
  IUser,
  IPhotoBuffer,
  ILoadPhotoesAction,
  ICreatePostAction
} from "./App.types";

import { httpGet, httpPost } from "../src/backend/httpGet";
import {
  saveStateInStorage,
  getStateFromStorage,
  deleteStateFromStorage
} from "./shared/storage/localStorage.actions";
import { Markers } from "./shared/storage/GoogleMap.Markers";

import Photo1 from "./assets/img/Space1.jpg";
import Photo2 from "./assets/img/Space2.jpg";
import Photo3 from "./assets/img/Space3.jpg";

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

type IAppActions =
  | ILogInAction
  | IGetStateAction
  | ILogOutAction
  | IUpdateStateAction
  | IGetPostsAction
  | ILoadPhotoesAction
  | ICreatePostAction;

const initialState: IAppState = {
  isLogin: false,
  posts: [
    {
      comment: "NoComment",
      date: "0000-00-00",
      Name: "noName",
      idPost: "0",
      lat: "00",
      lng: "00",
      photoes: nullPhoto,
      rating: "0",
      type: "0",
      username: "NoName"
    }
  ],
  user: {
    Birthday: "0000-00-00",
    FirstName: "NoName",
    LastName: "NoName",
    Status: "Empty",
    avatar: "null",
    email: "NoName@nomail.com",
    idUsers: 0,
    phone: 123455677888,
    rating: 0,
    username: "NoName"
  },
  photoBuffer: nullPhoto
};

const saveData = (res: JSON) => {
  saveStateInStorage(res);
};

export const sendData = (
  url: string,
  datatype: "string" | "json",
  data: string
) => {
  httpPost(url, datatype, data)
    .then(
      (response: any) => {
        const res: { operation: string; result: JSON } = JSON.parse(response);
        console.log(res);
        if (res.operation === "login") {
          if (JSON.stringify(res.result) === '"No Results Found"') {
            console.log("No such user found");
          } else {
            saveData(res.result);
          }
        } else if (res.operation === "createpost") {
          if (JSON.stringify(res.result) === '"Successful"') {
            alert("Successful. YeeeeY");
          } else {
            alert(res.result);
          }
        }
      },
      error => alert(`Rejected: ${error}`)
    )
    .catch(function(err) {
      console.error(err);
    });
};

export const getUserData = () => {
  let data: IUser = getStateFromStorage();
  return data;
};

const reducer = (state: IAppState, action: IAppActions) => {
  switch (action.type) {
    case "CreatePost": {
      console.log("Createing New Post", action.newPost);
      const postData =
        '{ "idUser": ' +
        state.user.idUsers +
        ', "json": ' +
        JSON.stringify(action.newPost) +
        "}";
      sendData("createpost.php", "json", postData);
      return {
        ...state
      };
    }
    case "loadPhotoes": {
      console.log("Reducer get this pic", action.buffer);
      console.log("Current photoBuffer", state.photoBuffer);
      if (state.photoBuffer === nullPhoto) {
        state.photoBuffer.splice(0, 3);
      }
      return {
        ...state,
        photoBuffer: [...state.photoBuffer, action.buffer]
      };
    }
    case "getPosts": {
      return {
        ...state,
        posts: Markers
      };
    }
    case "getState": {
      console.log("GetState is work");
      const data = getUserData();
      console.log(data);
      if (data === null || data.username === "NoName") {
        return {
          ...state,
          isLogin: false,
          user: data
        };
      } else {
        return {
          ...state,
          isLogin: true,
          user: data
        };
      }
    }
    case "login": {
      console.log("LogIn is work");
      const formData =
        "login=" +
        encodeURIComponent(action.bufLogin) +
        "&email=" +
        encodeURIComponent(action.bufEmail) +
        "&pass=" +
        encodeURIComponent(action.bufPass);
      sendData("login.php", "string", formData);
    }
    case "updateState": {
      console.log("Update is work");
      return { ...state };
    }
    case "logout": {
      console.log("LogOut is work");
      deleteStateFromStorage();
      return {
        ...state,
        isLogin: false
      };
    }
    default: {
      return state;
    }
  }
};

export { initialState, reducer };
