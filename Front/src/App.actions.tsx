/* tslint:disable */
import {
  ILogInAction,
  IGetStateAction,
  ILogOutAction,
  IUpdateStateAction,
  IGetPostsAction,
  ILoadPhotoesAction,
  IPhotoBuffer,
  INewPost,
  ICreatePostAction
} from "./App.types";

const logIn = (
  bufLogin: string,
  bufEmail: string,
  bufPass: string
): ILogInAction => ({
  bufEmail,
  bufLogin,
  bufPass,
  type: "login"
});

const getState = (): IGetStateAction => ({
  type: "getState"
});

const logOut = (): ILogOutAction => ({
  type: "logout"
});

const update = (): IUpdateStateAction => ({
  type: "updateState"
});

const getPosts = (): IGetPostsAction => ({
  type: "getPosts"
});

const loadPhotoes = (name: string, blob: string): ILoadPhotoesAction => {
  var d = new Date();
  var dateTime: string =
    d.getFullYear() +
    "-" +
    (d.getMonth() + 1) +
    "-" +
    d.getDate() +
    " " +
    d.getHours() +
    ":" +
    d.getMinutes() +
    ":" +
    d.getSeconds();
  return {
    type: "loadPhotoes",
    buffer: {
      name: name + "-" + dateTime,
      blob
    }
  };
};

const createPost = (newPost: INewPost): ICreatePostAction => ({
  type: "CreatePost",
  newPost
});

export { logIn, getState, logOut, update, getPosts, loadPhotoes, createPost };
