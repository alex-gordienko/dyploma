/* tslint:disable */
import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect
} from "react";
import Label from "./PageLabel";

import UserDataBlock from "./UserDataBlock";
import UserFriends from "./UserFriends";
import { SubHeader } from "../EditorComponents/EditorComponents.styled";
import { IFullDataUser, ISearchedUser } from "../../../App.types";
import { Redirect, NavLink } from "react-router-dom";
import { sendToSocket } from "../../../backend/httpGet";
import Preloader from "../Preloader";
import PostsController from "./Label";

interface IProfileViewerProps {
  socket: SocketIOClient.Socket;
  token: string;
  username: string | undefined;
  editable: boolean;
  currentUser: IFullDataUser;
  selectedTab: number;
  TabSelection: (mode: "public" | "private") => void;
  onError: (message: string) => void;
}

const ProfileViewer = forwardRef(
  (
    {
      socket,
      token,
      username,
      editable,
      currentUser,
      selectedTab,
      TabSelection,
      onError
    }: IProfileViewerProps,
    ref
  ) => {
    const [redirect, setRedirect] = useState(false);
    var nullFilter = { username: "", country: "", city: "", date: "" };
    const [userProfile, setUserProfile] = useState<ISearchedUser>();
    const [friends, setFriends] = useState<ISearchedUser[]>([]);

    useEffect(() => {
      if (username) {
        console.log("UserData is null. Call function");
        setUserProfile(null);
        searchProfile(username);
        searchFriends(username);
      } else {
        console.log("Username Error. Loading your profile");
        setUserProfile(null);
        searchProfile();
        searchFriends();
      }
    }, [username]);

    useImperativeHandle(ref, () => ({
      loadFriendList(
        res: socket.ISocketResponse<
          string | ISearchedUser | ISearchedUser[],
          api.models.IAvailableUserActions
        >
      ) {
        if (res.data.requestFor === "Search User") {
          if (res.status === "OK") {
            console.log(res.data.response);
            setUserProfile(res.data.response as ISearchedUser);
          } else {
            onError(res.data.response as string);
          }
        }
        if (res.data.requestFor === "Search Friends") {
          if (res.status === "OK") {
            console.log(res.data.response);
            setFriends(res.data.response as ISearchedUser[]);
          }
        }
      }
    }));

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

    const getRedirect = () => {
      if (redirect) {
        return <Redirect to={"/edit"} />;
      }
    };

    const handleLabelCommand = () => {
      setRedirect(true);
    };

    return userProfile ? (
      <>
        {getRedirect()}
        <Label
          rating={userProfile.rating}
          editable={editable}
          labelCommand={handleLabelCommand}
          status={userProfile.Status}
        >
          {userProfile.username}
        </Label>
        <PostsController
          isAnotherUser={username === currentUser.username ? false : true}
          onSelect={TabSelection}
          selectedCaption={selectedTab}
        />
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
      </>
    ) : (
      <Preloader message="Loading Profile Data..." />
    );
  }
);

export default ProfileViewer;
