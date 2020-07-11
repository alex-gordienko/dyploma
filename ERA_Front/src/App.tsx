/* tslint:disable */
import React, { useEffect, useReducer, useCallback } from "react";
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
import PeopleComponent from './shared/components/PeopleComponent';
import ChatsFeed from './shared/components/ChatsBlock';

import ErrorPage from "./shared/Pages/ErrorPage";

import { httpPost } from "../src/backend/httpGet";

import { initialState, reducer } from "./App.reducer";
import {
  isLoading,
  setProgress,
  setErrorMessage,
  logIn,
  saveUserDataToCookie,
  logOut,
  SaveProgressOnLoadingPosts,
  createPost,
  editPost,
  setEditedPost,
  createProfile,
  editProfile,
  getCountriesAndCities
} from "./App.actions";
import CreatePost from "./shared/components/PostEditor";
import { INewPost, IFullDataUser, IPost, ISavedUser } from "./App.types";
import { getStateFromStorage } from "./shared/storage/localStorage.actions";


const nullUser: IFullDataUser = JSON.parse(
  '{ "Country": "", '+
  '"City": "",' +
  '"Birthday": "0000-00-00",' +
  '"FirstName": "NoName",' +
  '"LastName": "NoName",' +
  '"Status": "Empty",' +
  '"avatar": "null",' +
  '"email": "NoName@nomail.com",' +
  '"isBanned": false,' +
  '"isValid": true,' +
  '"regDate": "0000-00-00",' +
  '"Birthday": "0000-00-00",' +
  '"idUsers": 0,' +
  '"phone": 123455677888,' +
  '"rating": 0,' +
  '"username": "NoName",'+
  '"password": "NoPass" }'
);

const App = () => {
  const [
    { isReady, 
      progressMessage,
      errorMessage, 
      isLogin, 
      user,
      country_city,
      searchedUserPosts, 
      allPosts,
      editedPost 
    }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const sendToServer = (
    url: string,
    datatype: "string" | "json",
    data: string
  ) => {
  httpPost(url, datatype, data)
      .then(
        (response: any) => {
          const res: { operation: string; result: any } = JSON.parse(response);
          console.log(res);
          switch (res.operation){
            case "login":{
              if (JSON.stringify(res.result) === '"No Results Found"') {
                alert("Authorization error. Please, log in");
                dispatch(logIn(user));
              } else {
                dispatch(logIn(res.result));
              }
              return;
            };
            case "get contries":{
              dispatch(getCountriesAndCities(res.result));
              return;
            };
            case "get one post":{
              console.log("searched post", res.result);
              dispatch(setEditedPost(res.result));
              return
            }
          }
        },
        error => dispatch(setErrorMessage("Connection Error. Is server online?"))
      )
      .catch(function(err) {
        console.error(err);
      });
  };
  const login = (bufLogin: string, bufPass:string) => {
    const formData ="login=" +encodeURIComponent(bufLogin) +"&pass=" +encodeURIComponent(bufPass);
    sendToServer("login.php", "string", formData);
  }
  async function startProject(){
    await dispatch(isLoading(false));
    await dispatch(setProgress("Reconnect to server..."));
    let data: ISavedUser = await getStateFromStorage("savedUser");
    await login(data.username, data.password);
    await dispatch(setProgress("Update info about you..."));
    const postData1 ='{ "operation": "get contries" }';
    sendToServer("getCountries.php", "json", postData1);
    await dispatch(setProgress("Ready..."));
    await dispatch(isLoading(true));
  }
  useEffect(() => {
    startProject();
    navigator.geolocation.getCurrentPosition(
        position=>{
          console.log(position)
        },
        error => console.log(error)
      );
    //setInterval(async function(){
     // console.log("Tick");
     // dispatch(saveUserDataToCookie());
    //}, 5*60*1000);
  }, [1]);
  window.onbeforeunload = ((e: Event)=>{
    const formData ="logout=" +encodeURIComponent(user.username);
    sendToServer("login.php", "string", formData);
    dispatch(saveUserDataToCookie());
  })
  

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
    const formData ="logout=" +encodeURIComponent(user.username);
    sendToServer("login.php", "string", formData);
    dispatch(logOut());
    dispatch(setProgress("Update info about you..."));
    dispatch(isLoading(true));
  };

  const MainPage = useCallback(() => {
    return isReady?
        isLogin?
          <BodyBlock 
            mode="Main Page"
            currentUser={user} 
            posts={allPosts} 
            onSaveProgressOnLoadingPosts={(posts:IPost[])=>{
              dispatch(SaveProgressOnLoadingPosts(posts));
            }}
            onError={(e)=>{dispatch(setErrorMessage(e))}}
          />
        :<Redirect to={"/login"}/>
      :<Preloader message={progressMessage}/>
  },[isReady, isLogin, allPosts]);

  const FriendList = () => {
    let { username } = useParams();
    return isReady && country_city?
      isLogin?
        <PeopleComponent 
          currentUser={user}
          userNameToSearchFriends={username}
          contries={country_city.country}
          cities={country_city.city}
          onError={(e)=>{dispatch(setErrorMessage(e))}}
        />
      :<Redirect to={"/login"}/>
    :<Preloader message={progressMessage}/>
  };

  const Chat = () => {
    return isReady && country_city?
      isLogin?
        <ChatsFeed
          currentUser={user}
          onError={(e)=>{dispatch(setErrorMessage(e))}}
        />
      :<Redirect to={"/login"}/>
    :<Preloader message={progressMessage}/>
  };

  const PostEditor = () => {
    let { postID } = useParams();
    const loadData =async() =>{
      console.log(postID);
      await dispatch(isLoading(false));
      await dispatch(setProgress("Gettin info about post..."));
      const postData ='{ "operation": "get one post", "postID": '+postID+' }';
      if(postID==="new") dispatch(setEditedPost("new"));
      else await sendToServer("getPosts.php", "json", postData);
      await dispatch(setProgress("Almost done..."));
      await dispatch(isLoading(true));
    }

    async function createNewPost(newPost: INewPost){
      await dispatch(isLoading(false));
      await dispatch(createPost(newPost));
      await dispatch(isLoading(true));
    };

    async function EditPost(editedPost: IPost){
      await dispatch(isLoading(false));
      await dispatch(editPost(editedPost));
      await dispatch(isLoading(true));
    };
    
    return isReady?
        isLogin?
          editedPost==="new" || editedPost==="No Results Found."?(
            <CreatePost
            type="Create"
            rating={user.rating}
            createNewPost={createNewPost}
          />
          ):(
            <CreatePost
            type="Edit"
            currentUser={user.idUsers}
            rating={user.rating}
            loadData={loadData}
            existPost={editedPost}
            saveChanges={EditPost}
          />
          )
      :<Redirect to={"/login"}/>
    : <Preloader message={progressMessage}/>
  };



  const ProfileViewer = (props: any) =>{
    let { username } = useParams();

    return isReady?
      isLogin?
        <ProfileView
          username={username}
          editable={username===user.username? true: false}
          currentUser={user}
          savedPosts={searchedUserPosts}
          onError={(e)=>{dispatch(setErrorMessage(e))}}
          onSaveProgressOnLoadingPosts={(posts:IPost[])=>{
            dispatch(SaveProgressOnLoadingPosts(posts, username))}}
        />  
      :<Redirect to={"/login"}/>
    : <Preloader message={progressMessage}/>
  }
  const ProfileEdit =() =>{
    const handleEditUserChange=(user:IFullDataUser)=>{
      dispatch(isLoading(false));
      dispatch(editProfile(user));
      dispatch(isLoading(true));
    }
    const handleCreateUserChange=(user:IFullDataUser)=>{
      dispatch(isLoading(false));
      dispatch(createProfile(user));
      dispatch(isLoading(true));
    }

    return isReady? 
      isLogin? (
        <ProfileEditor
          contries={country_city.country}
          cities={country_city.city}
          userData={user} 
          onUserUpdate={handleEditUserChange}
          />
      ):(
        <ProfileEditor 
          contries={country_city.country}
          cities={country_city.city}
          onUserCreate={handleCreateUserChange}
          />
      )
    : <Preloader message={progressMessage}/>
  }

  const loginPage = ()=>{
    return isLogin?
      <Redirect to={"/"}/>
    :<LoginForm isLogin={getUserData}/>
  }

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
            {
              errorMessage===""?
                user.isConfirm?
                  !user.isBanned?
                    <Switch>
                      <Route exact={true} path="/" component={MainPage} />
                      <Route path="/friendlist/:username" component={FriendList} />
                      <Route path="/friendlist/" component={FriendList} />
                      <Route path="/chatlist" component={Chat} />
                      <Route path="/profile/:username" component={ProfileViewer}/>
                      <Route path="/edit" component={ProfileEdit}/>
                      <Route path="/postEditor/:postID" component={PostEditor} />
                      <Route path="/login" component={loginPage}/>
                      <Route path="/registration" component={ProfileEdit}/>
                    </Switch>
                  :<ErrorPage type="banned" user={user} reason={"Test"}/>
                :<ErrorPage type="nonValid" user={user}/>            
              :<ErrorPage type="serverError" message={errorMessage}/>
            
            }
        </Container>
      </ThemeProvider>
    </BrowserRouter>
  )
};

export default App;