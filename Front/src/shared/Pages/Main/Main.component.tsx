import React, { FC, useEffect, useRef } from "react";
import { Redirect } from "react-router";
import { IFullDataUser } from "../../../App.types";
import BodyBlock from "../../components/BodyBlock/BodyBlock.component";
import Preloader from "../../components/Preloader";

interface IMainPageProps {
  socket: SocketIOClient.Socket;
  mode: "Main Page" | "Profile";
  isReady: boolean;
  isLogin: boolean;
  token: string;
  currentUser: IFullDataUser;
  progressMessage: string;
  onError: (message: string) => void;
}

const MainPageComponent: FC<IMainPageProps> = ({
  socket,
  mode,
  token,
  currentUser,
  isLogin,
  isReady,
  progressMessage,
  onError
}) => {
  const childRef = useRef<any>();

  useEffect(() => {
    if (childRef && childRef.current) {
      socket.on("Get Posts Response", childRef.current.getPostsResponse);
      socket.on("Comments Response", childRef.current.commentsResponse);
      socket.on("Rating Response", childRef.current.ratingResponse);
    }
    return () => {
      socket.removeEventListener("Get Posts Response");
      socket.removeEventListener("Comments Response");
      socket.removeEventListener("Rating Response");
    };
  }, [childRef, childRef.current]);

  return isReady ? (
    isLogin ? (
      <BodyBlock
        ref={childRef}
        mode={mode}
        socket={socket}
        token={token}
        currentUser={currentUser}
        onError={onError}
      />
    ) : (
      <Redirect to={"/login"} />
    )
  ) : (
    <Preloader message={progressMessage} />
  );
};

export default MainPageComponent;
