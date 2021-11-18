import React, { useEffect, useReducer, useCallback, useRef } from "react";
import { useParams, Redirect } from "react-router";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "emotion-theming";
import lighten from "./styles/themes/lighten";
import Preloader from "./shared/components/Preloader";
import Container from "./shared/components/Container";
import darken from "./styles/themes/darken";
// mine
import Header from "./shared/components/Header";
import BodyBlock from "./shared/components/BodyBlock";
import LoginForm from "./shared/components/LoginForm";
import ProfileEditor from "./shared/components/ProfileEditor";
import ProfileView from "./shared/components/ProfileViewer";
import PeopleComponent from "./shared/components/PeopleComponent";
import ChatsFeed from "./shared/components/ChatsBlock";

import ErrorPage from "./shared/Pages/ErrorPage";
import io from "socket.io-client";

import { ServerAdress, sendToSocket } from "../src/backend/httpGet";

import { initialState, reducer } from "./App.reducer";
import {
  isLoading,
  setProgress,
  setErrorMessage,
  logIn,
  saveUserDataToCookie,
  logOut,
  createPost,
  editPost,
  setEditedPost,
  createProfile,
  editProfile,
  getCountriesAndCities
} from "./App.actions";
import CreatePost from "./shared/components/PostEditor";
import { IFullDataUser, IPost, ISavedUser } from "./App.types";
import { getStateFromStorage } from "./shared/storage/localStorage.actions";

const App = () => {
  const [
    {
      socket,
      token,
      isReady,
      progressMessage,
      errorMessage,
      isLogin,
      user,
      country_city,
      editedPost
    },
    dispatch
  ] = useReducer(reducer, initialState);

  const timeHandler = useRef<any>();

  socket.on(
    "Client Login Response",
    (
      res: socket.ISocketResponse<
        IFullDataUser,
        api.models.IAvailableUserActions
      >
    ) => {
      dispatch(isLoading(false));
      dispatch(setProgress("Loading Your info..."));
      clearTimeout(timeHandler.current);

      try {
        if (res.status === "Not Found") {
          alert("Authorization error. Please, log in");
          dispatch(logIn(user));
        } else if (res.status === "OK") {
          timeHandler.current = setTimeout(() => {
            // console.log(res.data.response)
            dispatch(logIn(res.data.response));
            setTimeout(() => {
              dispatch(isLoading(true));
            }, 1000);
          }, 100);
        } else {
          // console.log(res)
          dispatch(
            setErrorMessage(
              "Incorrect Server Answer. Please, contact with admin with this Error: \n" +
                JSON.stringify(res)
            )
          );
        }
      } catch (e) {
        dispatch(setErrorMessage("Connection Error. Is server online?"));
      }
    }
  );

  socket.on("Get Countries Response", (res: any) => {
    dispatch(getCountriesAndCities(res.result));
  });

  socket.on("Get One Post Response", (res: any) => {
    // console.log("searched post", res.result);
    dispatch(setEditedPost(res.result));
  });

  // error => )

  const login = (bufLogin: string, bufPass: string) => {
    sendToSocket<api.models.ILoginRequest, api.models.IAvailableUserActions>(
      socket,
      {
        data: {
          options: {
            login: bufLogin,
            pass: bufPass
          },
          requestFor: "Client Login Request"
        },
        operation: "Client Login Request",
        token
      }
    );
  };
  async function startProject() {
    await dispatch(isLoading(false));
    await dispatch(setProgress("Reconnect to server..."));
    const data: ISavedUser = await getStateFromStorage("savedUser");
    await login(data.username, data.password);
    await dispatch(setProgress("Update info about you..."));
    sendToSocket(socket, {
      data: {
        options: {},
        requestFor: "Get contries request"
      },
      operation: "Get contries request",
      token
    });
    await dispatch(setProgress("Ready..."));
    await dispatch(isLoading(true));
  }
  useEffect(() => {
    startProject();
    navigator.geolocation.getCurrentPosition(
      position => {
        // console.log(position)
      }
      // error => console.log(error)
    );
    // setInterval(async function(){
    // console.log("Tick");
    // dispatch(saveUserDataToCookie());
    // }, 5*60*1000);
  }, [socket]);
  window.onbeforeunload = (e: Event) => {
    // const formData = "logout=" + encodeURIComponent(user.username);
    // sendToSocket(socket, "login.php", formData);
    dispatch(saveUserDataToCookie());
  };

  async function getUserData(log: string, pass: string) {
    await dispatch(isLoading(false));
    await dispatch(setProgress("Login in..."));
    await login(log, pass);
    await dispatch(setProgress("Update info about you..."));
    await dispatch(setProgress("Ready..."));
    await dispatch(isLoading(true));
  }

  const LogOut = () => {
    dispatch(isLoading(false));
    dispatch(setProgress("Log out..."));
    // const formData = "logout=" + encodeURIComponent(user.username);
    // sendToServer(socket, "login.php", formData);
    dispatch(logOut());
    dispatch(setProgress("Update info about you..."));
    dispatch(isLoading(true));
  };

  const MainPage = useCallback(() => {
    return isReady ? (
      isLogin ? (
        <BodyBlock
          mode="Main Page"
          socket={socket}
          token={token}
          currentUser={user}
          onError={e => {
            dispatch(setErrorMessage(e));
          }}
        />
      ) : (
        <Redirect to={"/login"} />
      )
    ) : (
      <Preloader message={progressMessage} />
    );
  }, [isReady, isLogin]);

  const FriendList = () => {
    const { username } = useParams<{ username: string }>();
    return isReady && country_city ? (
      isLogin ? (
        <PeopleComponent
          socket={socket}
          token={token}
          currentUser={user}
          userNameToSearchFriends={username}
          contries={country_city.country}
          cities={country_city.city}
          onError={e => {
            dispatch(setErrorMessage(e));
          }}
        />
      ) : (
        <Redirect to={"/login"} />
      )
    ) : (
      <Preloader message={progressMessage} />
    );
  };

  const Chat = () => {
    return isReady && country_city ? (
      isLogin ? (
        <ChatsFeed
          socket={socket}
          currentUser={user}
          onError={e => {
            dispatch(setErrorMessage(e));
          }}
        />
      ) : (
        <Redirect to={"/login"} />
      )
    ) : (
      <Preloader message={progressMessage} />
    );
  };

  const PostEditor = () => {
    const { postID } = useParams<{ postID: string }>();

    const loadData = () => {
      if (postID === "new") {
        dispatch(setEditedPost("new"));
        dispatch(isLoading(false));
        dispatch(setProgress("Gettin info about post..."));
      } else {
        sendToSocket<
          api.models.IGetPostToEditRequest,
          api.models.IAvailablePostActions
        >(socket, {
          data: {
            options: { postID: Number(postID) },
            requestFor: "get one post"
          },
          operation: "Post Editor Request",
          token
        });
      }
    };

    async function createNewPost(newPost: IPost) {
      await dispatch(isLoading(false));
      await dispatch(createPost(newPost));
      await dispatch(isLoading(true));
    }

    async function EditPost(editedPost: IPost) {
      await dispatch(isLoading(false));
      await dispatch(editPost(editedPost));
      await dispatch(isLoading(true));
    }

    return isReady ? (
      isLogin ? (
        editedPost === "new" ||
        editedPost === "No Results Found." ||
        editedPost.idUser === 0 ? (
          <CreatePost
            type="Create"
            loadData={loadData}
            currentUser={user}
            createNewPost={createNewPost}
          />
        ) : (
          <CreatePost
            type="Edit"
            currentUser={user}
            loadData={loadData}
            existPost={editedPost}
            saveChanges={EditPost}
          />
        )
      ) : (
        <Redirect to={"/login"} />
      )
    ) : (
      <Preloader message={progressMessage} />
    );
  };

  const ProfileViewer = (props: any) => {
    const { username } = useParams<{ username: string }>();

    return isReady ? (
      isLogin ? (
        <ProfileView
          socket={socket}
          token={token}
          username={username}
          editable={username === user.username ? true : false}
          currentUser={user}
          onError={e => {
            dispatch(setErrorMessage(e));
          }}
        />
      ) : (
        <Redirect to={"/login"} />
      )
    ) : (
      <Preloader message={progressMessage} />
    );
  };
  const ProfileEdit = () => {
    const handleEditUserChange = (user: IFullDataUser) => {
      dispatch(isLoading(false));
      dispatch(editProfile(user));
      dispatch(isLoading(true));
    };
    const handleCreateUserChange = (user: IFullDataUser) => {
      dispatch(isLoading(false));
      dispatch(createProfile(user));
      dispatch(isLoading(true));
    };

    return isReady ? (
      isLogin ? (
        <ProfileEditor
          contries={country_city.country}
          cities={country_city.city}
          userData={user}
          onUserUpdate={handleEditUserChange}
        />
      ) : (
        <ProfileEditor
          contries={country_city.country}
          cities={country_city.city}
          onUserCreate={handleCreateUserChange}
        />
      )
    ) : (
      <Preloader message={progressMessage} />
    );
  };

  const loginPage = () => {
    return isLogin ? (
      <Redirect to={"/"} />
    ) : (
      <LoginForm isLogin={getUserData} />
    );
  };

  const renderMain = () => {
    if (errorMessage.length) {
      return <ErrorPage type="serverError" message={errorMessage} />;
    }
    if (!user.isConfirm) {
      return <ErrorPage type="nonValid" user={user} />;
    }
    if (user.isBanned) {
      return <ErrorPage type="banned" user={user} reason={"Test"} />;
    }
    return (
      <Switch>
        <Route exact={true} path="/" component={MainPage} />
        <Route path="/friendlist/:username" component={FriendList} />
        <Route path="/friendlist/" component={FriendList} />
        <Route path="/chatlist" component={Chat} />
        <Route path="/profile/:username" component={ProfileViewer} />
        <Route path="/edit" component={ProfileEdit} />
        <Route path="/postEditor/:postID" component={PostEditor} />
        <Route path="/login" component={loginPage} />
        <Route path="/registration" component={ProfileEdit} />
      </Switch>
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
          {renderMain()}
        </Container>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
