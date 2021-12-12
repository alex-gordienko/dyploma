import React, { useEffect, useReducer, useRef } from "react";
import { useParams, Redirect } from "react-router";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "emotion-theming";
import lighten from "./styles/themes/lighten";
import Container from "./shared/components/Container";
import darken from "./styles/themes/darken";
import Header from "./shared/components/Header";
import LoginForm from "./shared/components/LoginForm";
import ProfileEditor from "./shared/components/ProfileEditor";
import ErrorPage from "./shared/Pages/ErrorPage";
import { sendToSocket } from "../src/backend/httpGet";

import { initialState, reducer } from "./App.reducer";
import {
  isLoading,
  setProgress,
  setErrorMessage,
  logIn,
  saveUserDataToCookie,
  logOut,
  editProfile,
  getCountriesAndCities
} from "./App.actions";
import CreatePost from "./shared/components/PostEditor";
import { IFullDataUser, ISavedUser } from "./App.types";
import {
  checkIfUserHasCookies,
  getStateFromStorage
} from "./shared/storage/localStorage.actions";
import MainPageComponent from "./shared/Pages/Main/Main.component";
import FriendListComponent from "./shared/Pages/FriendList/FriendList.component";
import ChatComponent from "./shared/Pages/Chat/ChatPage.component";
import ProfileViewComponent from "./shared/Pages/ProfileView/ProfileView.component";

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
            dispatch(logIn(res.data.response));
            if (!checkIfUserHasCookies()) {
              dispatch(saveUserDataToCookie());
            }
            setTimeout(() => {
              dispatch(isLoading(true));
            }, 1000);
          }, 100);
        } else {
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

  socket.on(
    "Get Countries Response",
    (
      res: socket.ISocketResponse<
        api.models.ICountriesAndCities | string,
        api.models.IAvailableCountriesActions
      >
    ) => {
      socket.removeEventListener("Get Countries Response");
      if (res.data.requestFor === "Get Countries") {
        if (res.status === "OK") {
          dispatch(
            getCountriesAndCities(
              res.data.response as api.models.ICountriesAndCities
            )
          );
        } else {
          dispatch(setErrorMessage(res.data.response as string));
        }
      }
    }
  );

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
    await login(data.email, data.password);
    await dispatch(setProgress("Update info about you..."));
    sendToSocket<{}, api.models.IAvailableCountriesActions>(socket, {
      data: {
        options: {},
        requestFor: "Get Countries"
      },
      operation: "Get Countries Request",
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
    setInterval(async () => {
      dispatch(saveUserDataToCookie());
    }, 5 * 60 * 1000);
  }, [socket]);
  window.onbeforeunload = (e: Event) => {
    // const formData = "logout=" + encodeURIComponent(user.username);
    // sendToSocket(socket, "login.php", formData);
    // dispatch(saveUserDataToCookie());
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

  const MainPage = () => (
    <MainPageComponent
      socket={socket}
      token={token}
      currentUser={user}
      mode="Main Page"
      isLogin={isLogin}
      isReady={isReady}
      progressMessage={progressMessage}
      onError={e => {
        dispatch(setErrorMessage(e));
      }}
    />
  );

  const FriendList = () => (
    <FriendListComponent
      socket={socket}
      token={token}
      currentUser={user}
      country_city={country_city}
      isLogin={isLogin}
      isReady={isReady}
      progressMessage={progressMessage}
      onError={e => {
        dispatch(setErrorMessage(e));
      }}
    />
  );

  const Chat = () => (
    <ChatComponent
      socket={socket}
      currentUser={user}
      isLogin={isLogin}
      isReady={isReady}
      progressMessage={progressMessage}
      onError={e => {
        dispatch(setErrorMessage(e));
      }}
    />
  );

  const PostEditor = () => {
    const { postID } = useParams<{ postID: string }>();

    return isLogin ? (
      <CreatePost
        socket={socket}
        token={token}
        postId={postID === "new" ? "new" : Number(postID)}
        currentUser={user}
        onError={e => {
          dispatch(setErrorMessage(e));
        }}
      />
    ) : (
      <Redirect to={"/login"} />
    );
  };

  const ProfileViewer = () => (
    <ProfileViewComponent
      socket={socket}
      token={token}
      currentUser={user}
      mode="Main Page"
      isLogin={isLogin}
      isReady={isReady}
      progressMessage={progressMessage}
      onError={e => {
        dispatch(setErrorMessage(e));
      }}
    />
  );

  const ProfileEdit = () => {
    return isLogin ? (
      <ProfileEditor
        socket={socket}
        token={token}
        contries={country_city.country}
        cities={country_city.city}
        currentUser={user}
        onUpdateUserData={user => dispatch(editProfile(user))}
        onError={e => {
          dispatch(setErrorMessage(e));
        }}
      />
    ) : (
      <ProfileEditor
        socket={socket}
        token={token}
        contries={country_city.country}
        cities={country_city.city}
        onUpdateUserData={user => dispatch(editProfile(user))}
        onError={e => {
          dispatch(setErrorMessage(e));
        }}
      />
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
