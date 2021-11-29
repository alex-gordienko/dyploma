/* tslint:disable */
import React, { useState, useRef, useEffect, useCallback } from "react";
import Container from "../Container/Container.Pages.styled";
import StyledChatsFeed from "./ChatsBlock.styled";
import Label from "./Label";
import { IFullDataUser, ISearchedUser } from "../../../App.types";
import { sendToSocket } from "../../../backend/httpGet";
import Chats from "./ChatsFeed";
import Modal from "../Modal";
import ChatMessenger from "./ChatMessenger";
import ChatEditor from "./ChatEditor";
import defaultAvatar from "../../../assets/img/DefaultPhoto.jpg";
import { uniqBy } from "lodash";

interface IChatsFeedProps {
  currentUser: IFullDataUser;
  socket: SocketIOClient.Socket;
  onError: (errorMessage: string) => void;
}
const ChatsFeed: React.FC<IChatsFeedProps> = ({
  currentUser,
  socket,
  onError
}: IChatsFeedProps) => {
  const tokenGen = (length: number) => {
    var rnd = "";
    while (rnd.length < length)
      rnd += Math.random()
        .toString(36)
        .substring(2);
    return rnd.substring(0, length);
  };

  const token = tokenGen(12);

  var nullChat: api.models.IPreviewChat[] = [
    {
      chatID: "0",
      avatar: defaultAvatar,
      type: "private",
      name: "Test Chat",
      lastMessage: {
        id: 0,
        id_author: 0,
        isHiddenFromAuthor: true,
        time: "2020-04-12 17:20:00",
        type: "text",
        message: "quasi"
      },
      members: []
    }
  ];
  var nullRoom: api.models.IChat = {
    chatID: "0",
    avatar: defaultAvatar,
    type: "private",
    name: "Test chat",
    members: [],
    messages: []
  };
  var nullMembers: api.models.IMember[] = [];
  var nullFilter = { username: "", country: "", city: "", date: "" };

  const childRef = useRef<any>();
  const [showModal, setShowModal] = useState(false);
  const [selectedChatToEdit, setSelectedChatToEdit] = useState(nullChat[0]);
  const [chats, setChats] = useState(nullChat);
  const [room, setRoom] = useState(nullRoom);
  const [isTyping, setIsTyping] = useState([{ room: "0", typing: [""] }]);
  const [members, setMembers] = useState(nullMembers);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    sendToSocket<{ user: string }, socket.AvailableMessengerRequestRoutes>(
      socket,
      {
        operation: "Connect To Chat Page Request",
        token,
        data: {
          requestFor: "Connect To Chat Page Request",
          options: {
            user: currentUser.username
          }
        }
      }
    );
  }, [1]);

  useEffect(() => {
    return () => {
      socket.removeEventListener("Connect To Chat Page Response");
      socket.removeEventListener("Chat Typing Response");
      socket.removeEventListener("Create Chat Response");
      socket.removeEventListener("Edit Chat Response");
      socket.removeEventListener("Join Room Response");
      socket.removeEventListener("Send Message Response");
      socket.removeEventListener("Delete Message Response");
    };
  }, [socket]);

  const searchPeople = (
    filter = nullFilter,
    oldData = members,
    preloadedPeople = 0
  ) => {
    sendToSocket<
      api.models.ISearchUserRequest,
      api.models.IAvailableUserActions
    >(socket, {
      operation: "User Searcher Request",
      data: {
        requestFor: "Search Peoples",
        options: {
          currentUser: currentUser.username,
          searchedUser: currentUser.username,
          filters: filter,
          page: preloadedPeople
        }
      },
      token
    });
  };

  const setChatFeed = async (
    res: socket.ISocketResponse<
      api.models.IPreviewChat,
      socket.AvailableMessengerResponseRoutes
    >
  ) => {
    console.log(res);
    socket.removeEventListener("Connect To Chat Page Response");
    if (
      res.operation === "Connect To Chat Page Response" &&
      res.status === "OK"
    ) {
      setChats(prevState =>
        uniqBy([...prevState, res.data.response], "chatID")
      );
      setIsTyping(prevState => {
        let newChats = prevState.concat({
          room: res.data.response.chatID.toString(),
          typing: [""]
        });
        return newChats;
      });
    }
    setShowModal(false);
    setSelectedChatToEdit(nullChat[0]);
  };

  const saveChanges = (
    command:
      | "Create Chat Request"
      | "Edit Chat Request"
      | "Delete Chat Request",
    chat: api.models.IPreviewChat
  ) => {
    let newChat: api.models.IPreviewChat = chat;
    let currentMember: api.models.IMember = {
      idUsers: currentUser.idUsers,
      username: currentUser.username,
      rating: currentUser.rating,
      avatar: currentUser.avatar
    };
    if (
      !newChat.members.find(
        (member: api.models.IMember) => member.idUsers === currentMember.idUsers
      )
    ) {
      newChat.members.push(currentMember);
    }
    if (chat.avatar === defaultAvatar) {
      newChat.avatar = null;
    }
    if (newChat.type === "private") {
      newChat.name = tokenGen(12);
    }
    console.log(newChat, command);
    sendToSocket<
      api.models.IPreviewChat,
      socket.AvailableMessengerRequestRoutes
    >(socket, {
      operation: command,
      token,
      data: {
        requestFor: command,
        options: newChat
      }
    });
  };

  const getChats = async (
    res: socket.ISocketResponse<
      api.models.IPreviewChat,
      socket.AvailableMessengerResponseRoutes
    >
  ) => {
    console.log(res);
    socket.removeEventListener("Create Chat Response");
    if (
      res.operation === "Connect To Chat Page Response" &&
      res.status === "OK"
    ) {
      setChats(prevState =>
        uniqBy([...prevState, res.data.response], "chatID")
      );
      setIsTyping(prevState => {
        let newChats = prevState.concat({
          room: res.data.response.chatID.toString(),
          typing: [""]
        });
        return newChats;
      });
    }
    setShowModal(false);
    setSelectedChatToEdit(nullChat[0]);
  };

  const editChatsFeed = async (
    res: socket.ISocketResponse<
      api.models.IPreviewChat,
      socket.AvailableMessengerResponseRoutes
    >
  ) => {
    console.log(res);
    socket.removeEventListener("Edit Chat Response");
    if (res.operation === "Edit Chat Response" && res.status === "OK") {
      setChats(prevState => {
        return prevState.map(chat => {
          if (chat.chatID === res.data.response.chatID)
            return res.data.response;
          else return chat;
        });
      });
    }
    setShowModal(false);
    setSelectedChatToEdit(nullChat[0]);
  };

  const joinRoom = useCallback(
    async (
      res: socket.ISocketResponse<
        api.models.IMessage[],
        socket.AvailableMessengerResponseRoutes
      >
    ) => {
      console.log(res);
      socket.removeEventListener("Join Room Response");
      if (res.data.requestFor === "Join Room Response" && res.status === "OK") {
        setRoom(prevState => ({ ...prevState, messages: res.data.response }));
      }
    },
    [room]
  );

  const isType = async (
    res: socket.ISocketResponse<
      { chatroom: string; username: string },
      socket.AvailableMessengerResponseRoutes
    >
  ) => {
    socket.removeEventListener("Chat Typing Response");
    if (res.operation === "Chat Typing Response" && res.status === "OK") {
      setIsTyping(prevState => {
        return prevState.map(elem => {
          if (
            elem.room === res.data.response.chatroom &&
            !elem.typing.includes(res.data.response.username)
          ) {
            return {
              room: elem.room,
              typing: elem.typing.concat(res.data.response.username)
            };
          } else return { room: elem.room, typing: elem.typing };
        });
      });
      setTimeout(() => {
        setIsTyping(prevState => {
          return prevState.map(e => {
            if (
              e.room === res.data.response.chatroom &&
              e.typing.includes(res.data.response.username)
            ) {
              return { room: e.room, typing: [""] };
            } else return { room: e.room, typing: e.typing };
          });
        });
      }, 2000);
    }
  };

  const updateMessageFeed = (data: any) => {
    console.log(data);
    setRoom(prevState => {
      if (data.toRoom === prevState.chatID) {
        return {
          chatID: prevState.chatID,
          name: prevState.name,
          avatar: prevState.avatar,
          type: prevState.type,
          members: prevState.members,
          messages: prevState.messages.concat(data.newMessage)
        };
      } else return prevState;
    });

    setChats(prevState => {
      let newState = prevState.map(chat => {
        if (chat.chatID.toString() === data.toRoom)
          return {
            chatID: chat.chatID,
            name: chat.name,
            avatar: chat.avatar,
            type: chat.type,
            members: chat.members,
            lastMessage: data.newMessage
          };
        else return chat;
      });
      return newState;
    });
  };
  const onDeleteMessage = (data: any) => {
    console.log(data);
    setRoom(prevState => {
      return {
        chatID: prevState.chatID,
        name: prevState.name,
        avatar: prevState.avatar,
        type: prevState.type,
        members: prevState.members,
        messages: prevState.messages.filter(
          msg => !data.find((elem: any) => elem === msg.id)
        )
      };
    });
  };

  const selectChatRoom = (chatroom: string) => {
    setRoom(prevState => {
      return {
        chatID: chatroom,
        name: chats.filter(chat => chat.chatID.toString() === chatroom)[0].name,
        avatar: chats.filter(chat => chat.chatID.toString() === chatroom)[0]
          .avatar
          ? chats.filter(chat => chat.chatID.toString() === chatroom)[0].avatar
          : defaultAvatar,
        type: chats.filter(chat => chat.chatID.toString() === chatroom)[0].type,
        members: chats.filter(chat => chat.chatID.toString() === chatroom)[0]
          .members,
        messages: []
      };
    });
    sendToSocket<
      api.models.IJoinRoomRequest,
      socket.AvailableMessengerRequestRoutes
    >(socket, {
      operation: "Join Room Request",
      token,
      data: {
        requestFor: "Join Room Request",
        options: {
          user: currentUser.username,
          chatroom: chatroom
        }
      }
    });
  };

  const onTyping = (chatroom: string) => {
    sendToSocket<
      api.models.IJoinRoomRequest,
      socket.AvailableMessengerRequestRoutes
    >(socket, {
      operation: "Chat Typing Request",
      token,
      data: {
        requestFor: "Chat Typing Request",
        options: {
          user: currentUser.username,
          chatroom: chatroom
        }
      }
    });
  };

  const onDelete = (
    chatroom: string,
    justHideFromAuthor: boolean,
    selectedMessageIDs: number[]
  ) => {
    console.log(
      "Chat " +
        chatroom +
        ", command: delete, data: " +
        selectedMessageIDs +
        " just hide: " +
        justHideFromAuthor
    );
    setRoom(prevState => {
      return {
        chatID: prevState.chatID,
        name: prevState.name,
        avatar: prevState.avatar,
        type: prevState.type,
        members: prevState.members,
        messages: prevState.messages.filter(
          message => !selectedMessageIDs.find(selId => selId === message.id)
        )
      };
    });
    socket.emit("delete", {
      room: chatroom,
      user: currentUser.username,
      justHide: justHideFromAuthor,
      data: selectedMessageIDs
    });
  };

  const onSend = (chatroom: string, textMessage: string) => {
    console.log("Chat " + chatroom + ", command: send, data: " + textMessage);
    socket.emit("send", {
      room: chatroom,
      user: currentUser.username,
      id_author: currentUser.idUsers,
      data: textMessage,
      type: "text"
    });
  };

  socket.once("Connect To Chat Page Response", setChatFeed);
  socket.on("Chat Typing Response", isType);
  socket.on("Create Chat Response", getChats);
  socket.on("Edit Chat Response", editChatsFeed);
  socket.once("Join Room Response", joinRoom);
  socket.on("Send Message Response", updateMessageFeed);
  socket.on("Delete Message Response", onDeleteMessage);

  socket.on(
    "User Searcher Response",
    (
      res: socket.ISocketResponse<
        ISearchedUser[],
        api.models.IAvailableUserActions
      >
    ) => {
      socket.removeEventListener("User Searcher Response");
      if (res.data.requestFor === "Search Peoples") {
        if (res.status === "OK") {
          let users: ISearchedUser[] = res.data.response;
          let chatMembers: api.models.IMember[] = users.map(user => {
            return {
              idUsers: user.idUsers,
              username: user.username,
              rating: user.rating,
              avatar: user.avatar
            };
          });
          setShowModal(true);
          setMembers(prevState =>
            uniqBy([...prevState, ...chatMembers], "idUsers")
          );
        }
      }
    }
  );

  return (
    <Container>
      <Label
        onCreate={() => {
          searchPeople();
        }}
      >
        Your chats
      </Label>
      <StyledChatsFeed>
        <Chats
          data={chats}
          onSelect={selectChatRoom}
          onEdit={e => {
            setSelectedChatToEdit(e);
            searchPeople();
          }}
          onDelete={e => console.log(e)}
        />
        <ChatMessenger
          currentUser={currentUser}
          isTyping={isTyping}
          data={room}
          onTyping={onTyping}
          onSend={onSend}
          onDelete={onDelete}
        />
      </StyledChatsFeed>
      <Modal
        show={showModal}
        name="Create/Edit chat"
        type="editing"
        isDisabled={isDisabled}
        onOK={() => {
          childRef.current.callSave();
        }}
        onCancel={() => {
          setShowModal(false);
          setSelectedChatToEdit(nullChat[0]);
        }}
      >
        <ChatEditor
          ref={childRef}
          currentUser={currentUser}
          existChatData={
            selectedChatToEdit.chatID !== "0" ? selectedChatToEdit : undefined
          }
          peoples={members}
          onMembersInputChange={e =>
            searchPeople({ username: e, country: "", city: "", date: "" })
          }
          isDisabledToApply={e => setIsDisabled(e)}
          saveUserChanges={e =>
            saveChanges(
              selectedChatToEdit.chatID !== "0"
                ? "Edit Chat Request"
                : "Create Chat Request",
              e
            )
          }
        />
      </Modal>
    </Container>
  );
};

export default ChatsFeed;
