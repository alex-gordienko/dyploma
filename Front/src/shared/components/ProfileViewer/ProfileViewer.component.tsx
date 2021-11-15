/* tslint:disable */
import React, { useState, useRef, useEffect } from "react";
import Label from "./PageLabel";
import PostsController from "./Label";
import UserDataBlock from "./UserDataBlock";
import UserFriends from "./UserFriends";
import SubContainer from "../Container/Container.Pages.styled";

import { StyledEditorBlock } from "./ProfileViewer.styled";
import { SubHeader } from "../EditorComponents/EditorComponents.styled";
import { IFullDataUser, ISearchedUser, IPost } from "../../../App.types";
import { Redirect, NavLink } from "react-router-dom";
import BodyBlock from "../BodyBlock";
import { sendToSocket } from "../../../backend/httpGet";
import defaultAvatar from "../../../assets/img/DefaultPhoto.jpg";

interface IProfileViewerProps {
  socket: SocketIOClient.Socket;
  token: string;
  username: string | undefined;
  editable: boolean;
  currentUser: IFullDataUser;
  onError: (message: string) => void;
}

const ProfileViewer = ({
  socket,
  token,
  username,
  editable,
  currentUser,
  onError
}: IProfileViewerProps) => {
  const [redirect, setRedirect] = useState(false);
  var user: ISearchedUser = {
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
  var nullFilter = { username: "", country: "", city: "", date: "" };
  const nullPosts: IPost[] = [];
  const [userProfile, setUserProfile] = useState<ISearchedUser>(user);
  const [friends, setFriends] = useState([user]);
  const [userPost, setUserPost] = useState(nullPosts);
  const [privatePosts, setPrivatePosts] = useState(nullPosts);
  const [feed, setFeed] = useState(nullPosts);
  const [selectedTab, setSelectedTab] = useState(1);

  socket.on("Search User Response", (res: any) => {
    if (res.result === "User not found. Try again") {
    } else setUserProfile(res.result);
  });

  socket.on("Search Friends Response", (res: any) => {
    if (res.result === "Friends not found") {
    } else setFriends(res.result);
  });

  socket.on("Get User Public Posts Response", (res: any) => {
    if (res.result === "No Results Found.") {
      if (userPost.length > 0 && userPost[0].username !== username) {
        setUserPost([]);
        setFeed([]);
      }
    } else {
      if (userPost.length > 0) {
        if (userPost[0].username !== username) {
          setUserPost(res.result);
          setFeed(res.result);
        }
      } else {
        let newFeed = userPost.concat(res.result);
        setUserPost(newFeed);
        setFeed(newFeed);
      }
    }
  });

  socket.on("Get User Private Posts Response", (res: any) => {
    if (res.result === "No Results Found.") {
      if (privatePosts.length > 1) setPrivatePosts([]);
    } else {
      let newFeed = privatePosts.concat(res.result);
      setPrivatePosts(newFeed);
    }
  });

  //error => onError("Error connection to the server")

  const searchProfile = (username = currentUser.username) => {
    //console.log("Searching: ", username);
    const postData =
      '{ "operation": "Search User"' +
      ', "json": {' +
      '"currentUser": "' +
      currentUser.username +
      '",' +
      '"searchedUser": "' +
      username +
      '"' +
      "}}";
    console.log("ProfileViewer.component.tsx 116 -> Try to send data");
    // sendToSocket(socket, "userSearcher.php", postData);
  };

  const searchFriends = (username = currentUser.username) => {
    let postData =
      '{ "operation": "Search Friends", ' +
      '"json": {' +
      '"username": "' +
      username +
      '",' +
      '"filters": ' +
      JSON.stringify(nullFilter) +
      "," +
      '"page": 0 ' +
      "}}";
    console.log("ProfileViewer.component.tsx 132 -> Try to send data");
    // sendToServer("userSearcher.php", postData);
  };

  useEffect(() => {
    if (username) {
      console.log("UserData is null. Call function");
      searchProfile(username);
      searchFriends(username);
    } else {
      console.log("Username Error. Loading your profile");
      searchProfile();
      searchFriends();
    }
  }, [username]);

  useEffect(() => {
    if (selectedTab === 1) setFeed(userPost);
    else if (selectedTab === 2) setFeed(privatePosts);
  }, [selectedTab]);

  const getRedirect = () => {
    if (redirect) {
      return <Redirect to={"/edit"} />;
    }
  };

  const TabSelection = (mode: "public" | "private") => {
    console.log(mode);
    setSelectedTab(mode === "public" ? 1 : mode === "private" ? 2 : 0);
  };

  const handleLabelCommand = () => {
    setRedirect(true);
  };
  return userProfile ? (
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
              friends.length > 0
                ? friends.find(
                    friend => friend.username === currentUser.username
                  )
                  ? true
                  : false
                : false
            }
            userData={userProfile}
          />
          <SubHeader>
            <NavLink to={"/friendlist/" + username}>
              Friends ({friends ? friends.length : "0"})
            </NavLink>
          </SubHeader>
          <UserFriends friends={friends} />
        </div>
        <div className="posts-block">
          <PostsController
            isAnotherUser={username === currentUser.username ? false : true}
            onSelect={TabSelection}
            selectedCaption={selectedTab}
          />
          <BodyBlock
            mode="Profile"
            socket={socket}
            token={token}
            isAnotherUser={username}
            isPrivatePosts={selectedTab === 1 ? false : true}
            currentUser={currentUser}
            onError={onError}
          />
        </div>
      </StyledEditorBlock>
    </SubContainer>
  ) : null;
};

export default ProfileViewer;
