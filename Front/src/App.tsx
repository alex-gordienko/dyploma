/* tslint:disable */
import React, { Component, useState, useEffect, useReducer } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "emotion-theming";
import lighten from "./styles/themes/lighten";
import Container from "./shared/components/Container";
import darken from "./styles/themes/darken";
// mine
import Header from "./shared/components/Header";
import BodyBlock from "./shared/components/BodyBlock";
import LoginForm from "./shared/components/LoginForm";

import { httpGet } from "../src/backend/httpGet";

import { initialState, reducer } from "./App.reducer";
import {
  logIn,
  getState,
  logOut,
  update,
  getPosts,
  loadPhotoes,
  createPost
} from "./App.actions";
import CreatePost from "./shared/components/CreatePost";
import { INewPost } from "./App.types";

const App = () => {
  const [{ isLogin, user, posts, photoBuffer }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    dispatch(getPosts());
    console.log("Getting state in useEffect");
    dispatch(getState());
  }, [user.idUsers]);

  async function getUserData(log: string, mail: string, pass: string) {
    await dispatch(logIn(log, mail, pass));
    console.log("Getting state after Login");
    await dispatch(update());
    await dispatch(getState());
  }

  const LogOut = () => {
    dispatch(logOut());
    console.log("Getting state after Log Out");
    dispatch(getState());
  };

  const MainPage = () => {
    if (isLogin) {
      return <BodyBlock posts={posts} />;
    } else return <LoginForm isLogin={getUserData} />;
  };

  const FriendList = () => {
    //////////////////////////TEST (DELETE NEXT TIME)
    const [userNameArray, setUserNameArray] = useState([""]);
    useEffect(() => {
      httpGet("testQuery.php")
        .then(
          (response: any) => {
            const data = JSON.parse(response);
            return data;
          },
          error => alert(`Rejected: ${error}`)
        )
        .then((data: any) => {
          var buf = [""];
          data.map((row: any) => {
            buf.push(row.username);
          });
          setUserNameArray(buf);
        });
    }, []);

    return (
      <div>
        <p>Result:</p>
        <div>
          {userNameArray.map((element: string, index: number) => {
            return <div key={index}> {element} </div>;
          })}
        </div>
      </div>
    );
    /////////////////////////////////////
  };

  const Chat = () => <p>Chat is here</p>;

  const CreateMarker = () => {
    const getPhoto = (name: string, photoUrl: string) => {
      dispatch(loadPhotoes(name, photoUrl));
    };

    const createNewPost = (newPost: INewPost) => {
      dispatch(createPost(newPost));
    };

    return (
      <CreatePost
        theme={lighten}
        rating={user.rating}
        photoesUrls={photoBuffer}
        pushUpUrl={getPhoto}
        createNewPost={createNewPost}
      />
    );
  };

  return (
    <BrowserRouter>
      <ThemeProvider theme={lighten}>
        <Container>
          <Header
            avatar={user.avatar}
            isLogin={isLogin}
            username={user.username}
            LogOut={LogOut}
          />
          <Switch>
            <Route exact={true} path="/" component={MainPage} />
            <Route path="/friendlist" component={FriendList} />
            <Route path="/chat" component={Chat} />
            <Route path="/login" component={MainPage} />
            <Route path="/create-marker" component={CreateMarker} />
          </Switch>
        </Container>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
