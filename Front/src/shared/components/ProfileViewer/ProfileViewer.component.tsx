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
import Preloader from "../Preloader";

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
  const [userProfile, setUserProfile] = useState<ISearchedUser>(user);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [isFriendListLoaded, setIsFrienListLoaded] = useState(false);
  const [friends, setFriends] = useState([user]);
  const [selectedTab, setSelectedTab] = useState(1);

  useEffect(() => {
    if (isProfileLoaded && isFriendListLoaded) {
      socket.removeEventListener("User Searcher Response");
    }
  }, [isProfileLoaded, isFriendListLoaded]);

  socket.on(
    "User Searcher Response",
    (
      res: socket.ISocketResponse<
        string | ISearchedUser | ISearchedUser[],
        api.models.IAvailableUserActions
      >
    ) => {
      if (res.data.requestFor === "Search User") {
        if (res.status === "OK") {
          console.log(res.data.response);
          setUserProfile(res.data.response as ISearchedUser);
          setIsProfileLoaded(true);
        } else {
          onError(res.data.response as string);
        }
      }
      if (res.data.requestFor === "Search Friends") {
        if (res.status === "OK") {
          console.log(res.data.response);
          setFriends(res.data.response as ISearchedUser[]);
          setIsFrienListLoaded(true);
        }
      }
    }
  );

  const searchProfile = (username = currentUser.username) => {
    sendToSocket<
      api.models.ISearchUserRequest,
      api.models.IAvailableUserActions
    >(socket, {
      operation: "User Searcher Request",
      data: {
        requestFor: "Search User",
        options: {
          currentUser: currentUser.username,
          searchedUser: username,
          filters: nullFilter,
          page: 0
        }
      },
      token
    });
  };

  const searchFriends = (username = currentUser.username) => {
    sendToSocket<
      api.models.ISearchUserRequest,
      api.models.IAvailableUserActions
    >(socket, {
      operation: "User Searcher Request",
      data: {
        requestFor: "Search Friends",
        options: {
          currentUser: currentUser.username,
          searchedUser: username,
          filters: nullFilter,
          page: 0
        }
      },
      token
    });
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
    setIsProfileLoaded(false);
    setIsFrienListLoaded(false);
  }, [username]);

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
  return isProfileLoaded && isFriendListLoaded ? (
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
  ) : (
    <Preloader message="Loading Profile Data..." />
  );
};

export default ProfileViewer;
