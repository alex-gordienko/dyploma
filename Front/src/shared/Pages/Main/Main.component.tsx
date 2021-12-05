import React, { FC } from "react";
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
  return isReady ? (
    isLogin ? (
      <BodyBlock
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
