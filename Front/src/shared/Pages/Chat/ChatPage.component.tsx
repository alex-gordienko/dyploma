import React, { FC, useRef, useEffect } from "react";
import { Redirect } from "react-router";
import { IFullDataUser } from "../../../App.types";
import ChatsFeed from "../../components/ChatsBlock";
import Preloader from "../../components/Preloader";

interface IChatPageProps {
  socket: SocketIOClient.Socket;
  isReady: boolean;
  isLogin: boolean;
  currentUser: IFullDataUser;
  progressMessage: string;
  onError: (message: string) => void;
}

const ChatComponent: FC<IChatPageProps> = ({
  socket,
  currentUser,
  isLogin,
  isReady,
  progressMessage,
  onError
}) => {
  const childRef = useRef<any>();

  useEffect(() => {
    if (childRef && childRef.current) {
      socket.on("User Searcher Response", childRef.current.loadAvailableUsers);
      socket.on("Connect To Chat Page Response", childRef.current.setChatFeed);
      socket.on("Chat Typing Response", childRef.current.isType);
      socket.on("Create Chat Response", childRef.current.getChats);
      socket.on("Edit Chat Response", childRef.current.editChatsFeed);
      socket.on("Join Room Response", childRef.current.joinRoom);
      socket.on("Send Message Response", childRef.current.updateMessageFeed);
      socket.on("Delete Message Response", childRef.current.onDeleteMessage);
    }
    return () => {
      socket.removeEventListener("User Searcher Response");
      socket.removeEventListener("Connect To Chat Page Response");
      socket.removeEventListener("Chat Typing Response");
      socket.removeEventListener("Create Chat Response");
      socket.removeEventListener("Edit Chat Response");
      socket.removeEventListener("Join Room Response");
      socket.removeEventListener("Send Message Response");
      socket.removeEventListener("Delete Message Response");
    };
  }, [childRef, childRef.current]);

  const renderChatPage = () => {
    if (isReady) {
      if (isLogin) {
        return (
          <ChatsFeed
            ref={childRef}
            socket={socket}
            currentUser={currentUser}
            onError={onError}
          />
        );
      }
      return <Redirect to={"/login"} />;
    }
    return <Preloader message={progressMessage} />;
  };

  return renderChatPage();
};

export default ChatComponent;
