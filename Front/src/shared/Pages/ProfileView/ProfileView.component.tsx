import React, { FC, useEffect, useRef, useState } from "react";
import { useParams, Redirect } from "react-router";
import { IFullDataUser } from "../../../App.types";
import ProfileView from "../../components/ProfileViewer";
import BodyBlock from "../../components/BodyBlock/BodyBlock.component";
import Preloader from "../../components/Preloader";
import SubContainer from "../../components/Container/Container.Pages.styled";
import { ProfileViewerContainer } from "./ProfileView.styled";

interface IProfileViewProps {
  socket: SocketIOClient.Socket;
  isReady: boolean;
  isLogin: boolean;
  token: string;
  currentUser: IFullDataUser;
  progressMessage: string;
  onError: (message: string) => void;
}

const ProfileViewComponent: FC<IProfileViewProps> = ({
  socket,
  token,
  currentUser,
  isLogin,
  isReady,
  progressMessage,
  onError
}) => {
  const [selectedTab, setSelectedTab] = useState(1);
  const { username } = useParams<{ username: string }>();
  const ProfileViewRef = useRef<any>();
  const PostFeedRef = useRef<any>();

  useEffect(() => {
    if (ProfileViewRef && ProfileViewRef.current) {
      socket.on(
        "User Searcher Response",
        ProfileViewRef.current.loadFriendList
      );
    }
    if (PostFeedRef && PostFeedRef.current) {
      socket.on("Get Posts Response", PostFeedRef.current.getPostsResponse);
      socket.on("Comments Response", PostFeedRef.current.commentsResponse);
      socket.on("Rating Response", PostFeedRef.current.ratingResponse);
    }
    return () => {
      socket.removeEventListener("User Searcher Response");
      socket.removeEventListener("Get Posts Response");
      socket.removeEventListener("Comments Response");
      socket.removeEventListener("Rating Response");
    };
  }, [
    ProfileViewRef,
    ProfileViewRef.current,
    PostFeedRef,
    PostFeedRef.current
  ]);

  const TabSelection = (mode: "public" | "private") => {
    setSelectedTab(mode === "public" ? 1 : mode === "private" ? 2 : 0);
  };

  return isReady ? (
    isLogin ? (
      <SubContainer>
        <ProfileViewerContainer>
          <ProfileView
            ref={ProfileViewRef}
            socket={socket}
            token={token}
            username={username}
            editable={username === currentUser.username ? true : false}
            currentUser={currentUser}
            selectedTab={selectedTab}
            TabSelection={TabSelection}
            onError={onError}
          />
          <div className="posts-block">
            <BodyBlock
              ref={PostFeedRef}
              mode="Profile"
              socket={socket}
              token={token}
              isAnotherUser={username}
              isPrivatePosts={selectedTab === 2}
              currentUser={currentUser}
              onError={onError}
            />
          </div>
        </ProfileViewerContainer>
      </SubContainer>
    ) : (
      <Redirect to={"/login"} />
    )
  ) : (
    <Preloader message={progressMessage} />
  );
};

export default ProfileViewComponent;
