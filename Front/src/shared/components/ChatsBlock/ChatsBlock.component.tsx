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
const ChatsFeed = ({ currentUser, socket, onError }: IChatsFeedProps) => {
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

  const saveChanges = (
    command: "create chat" | "edit chat" | "delete chat",
    chat: api.models.IPreviewChat
  ) => {
    let newChat: any = chat;
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
    )
      newChat.members.push(currentMember);
    if (chat.avatar === defaultAvatar) newChat.avatar = null;
    if (newChat.type === "private") newChat.name = tokenGen(12);
    console.log(newChat);
    socket.emit(command, { user: currentUser.username, newChat: newChat });
  };

  const getChats = async (
    res: socket.ISocketResponse<
      api.models.IPreviewChat,
      socket.AvailableMessengerResponseRoutes
    >
  ) => {
    console.log(res);
    socket.removeEventListener("new chat");
    if (res.operation === "new chat" && res.status === "OK") {
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

  const editChatsFeed = async (data: any) => {
    console.log(data);
    if (data.chatlist) {
      setChats(prevState => {
        let newEditedChat: api.models.IPreviewChat = data.chatlist;
        let newChats = prevState.map(chat => {
          if (chat.chatID === newEditedChat.chatID) return newEditedChat;
          else return chat;
        });
        return newChats;
      });
    }
    setShowModal(false);
    setSelectedChatToEdit(nullChat[0]);
  };
  const joinRoom = (data: any) => {
    console.log(data);
    if (data.chatMessages) {
      setRoom(prevState => {
        return {
          chatID: prevState.chatID,
          name: prevState.name,
          avatar: prevState.avatar,
          type: prevState.type,
          members: prevState.members,
          messages: data.chatMessages
        };
      });
    }
  };

  const isType = (data: any) => {
    setIsTyping(prevState => {
      let newState = prevState.map(elem => {
        if (elem.room === data.room && !elem.typing.includes(data.typing)) {
          return { room: elem.room, typing: elem.typing.concat(data.typing) };
        } else return { room: elem.room, typing: elem.typing };
      });
      setTimeout(() => {
        setIsTyping(prevState => {
          let newState = prevState.map(e => {
            if (e.room === data.room && e.typing.includes(data.typing)) {
              return { room: e.room, typing: [""] };
            } else return { room: e.room, typing: e.typing };
          });
          return newState;
        });
      }, 4000);
      return newState;
    });
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

  socket.on("onTyping", isType);
  socket.on("new chat", getChats);
  socket.on("editing chat", editChatsFeed);
  socket.on("selected room", joinRoom);
  socket.on("new message", updateMessageFeed);
  socket.on("onDeletion", onDeleteMessage);

  const connectToChatServer = () => {
    sendToSocket<{ user: string }, socket.AvailableMessengerRequestRoutes>(
      socket,
      {
        operation: "Connect to chat page",
        token,
        data: {
          requestFor: "Connect to chat page",
          options: {
            user: currentUser.username
          }
        }
      }
    );
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
      operation: "Join room",
      token,
      data: {
        requestFor: "Join room",
        options: {
          user: currentUser.username,
          chatroom: chatroom
        }
      }
    });
  };

  useEffect(() => {
    connectToChatServer();
  }, [1]);

  const onTyping = (chatroom: string, username: string) => {
    console.log("Chat " + chatroom + ", command: typing, data: " + username);
    sendToSocket<
      api.models.IJoinRoomRequest,
      socket.AvailableMessengerRequestRoutes
    >(socket, {
      operation: "Typing",
      token,
      data: {
        requestFor: "Typing",
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
              selectedChatToEdit.chatID !== "0" ? "edit chat" : "create chat",
              e
            )
          }
        />
      </Modal>
    </Container>
  );
};

export default ChatsFeed;
