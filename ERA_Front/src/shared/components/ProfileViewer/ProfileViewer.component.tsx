/* tslint:disable */
import React, { useState, useRef, useEffect } from "react";
import Label from "./PageLabel";
import PostsController from './Label';
import UserDataBlock from './UserDataBlock';
import UserFriends from "./UserFriends";
import SubContainer from '../Container/Container.Pages.styled';

import { StyledEditorBlock } from './ProfileViewer.styled';
import { SubHeader } from '../EditorComponents/EditorComponents.styled';
import { IFullDataUser, ISearchedUser, IPost } from "../../../App.types";
import { Redirect, NavLink } from "react-router-dom";
import BodyBlock from "../BodyBlock";
import { httpPost } from "../../../backend/httpGet";
import defaultAvatar from '../../../assets/img/DefaultPhoto.jpg'

interface IProfileViewerProps {
  username: string| undefined;
  editable: boolean;
  currentUser: IFullDataUser;
  savedPosts: IPost[];
  onSaveProgressOnLoadingPosts:(posts:IPost[])=>void;
  onError:(message:string)=>void;
}

const ProfileViewer = ({
  username,
  editable,
  currentUser,
  savedPosts,
  onSaveProgressOnLoadingPosts,
  onError
}: IProfileViewerProps) => {
  const [redirect, setRedirect] = useState(false);
  var user:ISearchedUser={
    Country: "",
    City: "",
    Birthday: "",
    FirstName: "",
    LastName: "",
    Status: "",
    avatar: defaultAvatar,
    idUsers: 0,
    lastOnline: "",
    regDate: "",
    isBanned: false,
    isConfirm: false,
    isOnline: false,
    isMyFriend: false,
    isSubscribition: false,
    isBlocked: false,
    phone: 0,
    rating: 0,
    username: ""
  };
  var nullFilter = {username:"",country:"",city:"", date:""};
  const nullPosts: IPost[]= [];
  const [userProfile, setUserProfile]= useState(user);
  const [friends, setFriends] = useState([user]);
  const [userPost, setUserPost] = useState(nullPosts);
  const [privatePosts, setPrivatePosts] = useState(nullPosts);
  const [feed, setFeed] = useState(nullPosts);
  const [selectedTab, setSelectedTab] = useState(1);


  

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
          if(res.operation==="Search User"){
              if(res.result=== "User not found. Try again"){
              }
              else setUserProfile(res.result);
          }
          if(res.operation==="Search Friends"){
            if(res.result=== "Friends not found"){
            }
            else setFriends(res.result);
          }
          if(res.operation==="get user public posts"){
            if(res.result==="No Results Found."){
              if(userPost.length>0 
                 && userPost[0].username!==username){
                   setUserPost([]);
                   setFeed([]);
                  }
            }
            else{
              if(userPost.length>0){
                if(userPost[0].username!==username){
                  setUserPost(res.result);
                  setFeed(res.result);
                }
              }
              else{
                let newFeed = userPost.concat(res.result);
                setUserPost(newFeed);
                setFeed(newFeed);
              }
              
            }
          }
          if(res.operation==="get user private posts"){
            if(res.result==="No Results Found."){
              if(privatePosts.length>1)setPrivatePosts([]);
            }
            else{
              let newFeed = privatePosts.concat(res.result);
              setPrivatePosts(newFeed);
            }
          }
        },
        error => onError("Error connection to the server")
      )
  };

  const searchProfile =(username=currentUser.username)=>{
    //console.log("Searching: ", username);
    const postData =
      '{ "operation": "Search User"' +
      ', "json": {' +
        '"currentUser": "'+currentUser.username+'",'+
        '"searchedUser": "'+username+'"'+
      "}}";
      sendToServer("userSearcher.php", "json", postData);
  }

  const searchFriends = (username= currentUser.username) =>{
    let postData ='{ "operation": "Search Friends", '+
      '"json": {'+
        '"username": "'+username+'",'+
        '"filters": '+JSON.stringify(nullFilter)+','+
        '"page": 0 '+
      '}}';
      sendToServer("userSearcher.php", "json", postData);
  }

  const getUserPublicPosts = (username= currentUser.username, postcount=userPost.length) =>{
    let postData ='{ "operation": "get user public posts", '+
      '"json": {'+
        '"username": "'+username+'",'+
        '"currentUser": '+currentUser.idUsers+','+
        '"filters": '+JSON.stringify(nullFilter)+','+
        '"postnumber": '+ postcount +
      '}}';
      sendToServer("getPosts.php", "json",postData);
  }

  const getUserPrivatePosts = (username= currentUser.username) =>{
    let postData ='{ "operation": "get user private posts", '+
      '"json": {'+
        '"username": "'+username+'",'+
        '"currentUser": '+currentUser.idUsers+','+
        '"filters": '+JSON.stringify(nullFilter)+','+
        '"postnumber": '+ privatePosts.length +
      '}}';
      sendToServer("getPosts.php", "json",postData);
  }

  useEffect(()=>{
    if(username){
      console.log("UserData is null. Call function");
      searchProfile(username);
      searchFriends(username);
      getUserPublicPosts(username,0);
      if(username===currentUser.username) getUserPrivatePosts();
    }
    else{ 
      console.log("Username Error. Loading your profile");
      searchProfile();
      searchFriends();
      getUserPublicPosts();
      getUserPrivatePosts();
    }
  },[username]);

  useEffect(()=>{
    if(selectedTab===1) setFeed(userPost)
    else if(selectedTab===2) setFeed(privatePosts)
  },[selectedTab])

  const getRedirect=()=>{
    if(redirect){
      return <Redirect to={"/edit"}/>
    }
  }

  const TabSelection = (mode: "public"|"private")=>{
    console.log(mode);
    setSelectedTab(mode==="public"? 1: mode==="private"? 2:0)
  }

  const handleLabelCommand = () => {
      setRedirect(true);
  };
  return userProfile?(
      <SubContainer>
        {getRedirect()}
        <Label 
          rating={userProfile.rating}
          editable={editable} 
          labelCommand={handleLabelCommand}
          status={userProfile.Status}
        >
          {userProfile.username} 
        </Label>
        <StyledEditorBlock>
          <div className="profile-block">
            <SubHeader>Profile</SubHeader>
            <UserDataBlock
              currentUser={currentUser} 
              isMyFriend={
                friends.length>0?
                  friends.find(friend=> friend.username===currentUser.username)? true: false
                  :false
              } userData={userProfile}/>
            <SubHeader>
              <NavLink 
                to={"/friendlist/"+username}
              >
                Friends ({friends? friends.length: "0"})
              </NavLink>
            </SubHeader>
            <UserFriends friends={friends}/>
          </div>
          <div className="posts-block">
            <PostsController 
              isAnotherUser={username===currentUser.username? false: true}
              onSelect={TabSelection} 
              selectedCaption={selectedTab}/>
            <BodyBlock 
              mode="Profile"
              isAnotherUser={username} 
              isPrivatePosts={selectedTab===1? false: true}
              onSaveProgressOnLoadingPosts={onSaveProgressOnLoadingPosts} 
              currentUser={currentUser} 
              posts={feed}
              onError={onError} 
              />
          </div>
        </StyledEditorBlock>
      </SubContainer>
  ): null;
};


export default ProfileViewer;
