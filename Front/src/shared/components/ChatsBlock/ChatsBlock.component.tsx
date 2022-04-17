/* tslint:disable */
import React, {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef
} from "react";
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
import { tokenGen } from "../utils/tokenGen";

interface IChatsFeedProps {
  currentUser: IFullDataUser;
  socket: SocketIOClient.Socket;
  onError: (errorMessage: string) => void;
}

const ChatsFeed = forwardRef(
  ({ currentUser, socket, onError }: IChatsFeedProps, ref) => {
    const token = tokenGen(12);
    var nullMembers: api.models.IMember[] = [];
    var nullFilter = { username: "", country: "", city: "", date: "" };

    const chatEditorRef = useRef<any>();
    const [showModal, setShowModal] = useState(false);
    const [selectedChatToEdit, setSelectedChatToEdit] = useState<
      api.models.IPreviewChat
    >();
    const [chats, setChats] = useState<api.models.IPreviewChat[]>([]);
    const [room, setRoom] = useState<api.models.IChat>();
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

    useImperativeHandle(ref, () => ({
      loadAvailableUsers(
        res: socket.ISocketResponse<
          ISearchedUser[] | string,
          api.models.IAvailableUserActions
        >
      ) {
        if (res.data.requestFor === "Search Friends") {
          if (res.status === "OK") {
            let users: ISearchedUser[] = res.data.response as ISearchedUser[];
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
          if (res.status !== "OK") {
            onError(res.data.response as string);
          }
        }
      },

      setChatFeed(
        res: socket.ISocketResponse<
          api.models.IPreviewChat | string,
          socket.AvailableMessengerResponseRoutes
        >
      ) {
        console.log(res);
        if (
          res.operation === "Connect To Chat Page Response" &&
          res.status === "OK"
        ) {
          setChats(prevState =>
            uniqBy(
              [...prevState, res.data.response as api.models.IPreviewChat],
              "chatID"
            )
          );
          setIsTyping(prevState => {
            let newChats = prevState.concat({
              room: (res.data
                .response as api.models.IPreviewChat).chatID.toString(),
              typing: [""]
            });
            return newChats;
          });
        }
        if (res.status !== "OK") {
          onError(res.data.response as string);
        }
        setShowModal(false);
        setSelectedChatToEdit(null);
      },

      getChats(
        res: socket.ISocketResponse<
          api.models.IPreviewChat | string,
          socket.AvailableMessengerResponseRoutes
        >
      ) {
        console.log(res);
        if (res.operation === "Create Chat Response" && res.status === "OK") {
          setChats(prevState =>
            uniqBy(
              [...prevState, res.data.response as api.models.IPreviewChat],
              "chatID"
            )
          );
          setIsTyping(prevState => {
            let newChats = prevState.concat({
              room: (res.data
                .response as api.models.IPreviewChat).chatID.toString(),
              typing: [""]
            });
            return newChats;
          });
        }
        if (res.status !== "OK") {
          onError(res.data.response as string);
        }
        setShowModal(false);
        setSelectedChatToEdit(null);
      },

      editChatsFeed(
        res: socket.ISocketResponse<
          api.models.IPreviewChat | string,
          socket.AvailableMessengerResponseRoutes
        >
      ) {
        console.log(res);
        if (res.operation === "Edit Chat Response" && res.status === "OK") {
          setChats(prevState => {
            return prevState.map(chat => {
              if (
                chat.chatID ===
                (res.data.response as api.models.IPreviewChat).chatID
              )
                return res.data.response as api.models.IPreviewChat;
              else return chat;
            });
          });
        }
        if (res.status !== "OK") {
          onError(res.data.response as string);
        }
        setShowModal(false);
        setSelectedChatToEdit(null);
      },

      joinRoom(
        res: socket.ISocketResponse<
          api.models.IMessage[] | { username: string },
          socket.AvailableMessengerResponseRoutes
        >
      ) {
        console.log(res);
        if (
          res.data.requestFor === "Join Room Response" &&
          res.status === "OK"
        ) {
          setRoom(prevState => ({
            ...prevState,
            messages: res.data.response as api.models.IMessage[]
          }));
        }
        if (
          res.data.requestFor === "Opponent Join Room Response" &&
          res.status === "OK"
        ) {
          console.log(
            `${
              (res.data.response as { username: string }).username
            } joined room`
          );
        }
      },

      isType(
        res: socket.ISocketResponse<
          { chatroom: string; username: string },
          socket.AvailableMessengerResponseRoutes
        >
      ) {
        console.log(res);
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
      },

      updateMessageFeed(
        res: socket.ISocketResponse<
          api.models.IMessage & { toRoom: string },
          socket.AvailableMessengerResponseRoutes
        >
      ) {
        console.log(res);
        if (res.operation === "Send Message Response" && res.status === "OK") {
          setRoom(prevState => {
            if (res.data.response.toRoom === prevState.chatID) {
              return {
                ...prevState,
                messages: prevState.messages.concat(res.data.response)
              };
            } else return prevState;
          });

          setChats(prevState => {
            let newState = prevState.map(chat => {
              if (chat.chatID.toString() === res.data.response.toRoom)
                return { ...chat, lastMessage: res.data.response };
              else return chat;
            });
            return newState;
          });
        }
      },

      onDeleteMessage(data: any) {
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
      }
    }));

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
          requestFor: "Search Friends",
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
      command: socket.AvailableMessengerRequestRoutes,
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
          (member: api.models.IMember) =>
            member.idUsers === currentMember.idUsers
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

    const selectChatRoom = (chatroom: string) => {
      setRoom(prevState => {
        return {
          chatID: chatroom,
          name: chats.filter(chat => chat.chatID.toString() === chatroom)[0]
            .name,
          avatar: chats.filter(chat => chat.chatID.toString() === chatroom)[0]
            .avatar
            ? chats.filter(chat => chat.chatID.toString() === chatroom)[0]
                .avatar
            : defaultAvatar,
          type: chats.filter(chat => chat.chatID.toString() === chatroom)[0]
            .type,
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
      sendToSocket<
        api.models.ISendMessageRequest,
        socket.AvailableMessengerRequestRoutes
      >(socket, {
        operation: "Send Message Request",
        token,
        data: {
          requestFor: "Send Message Request",
          options: {
            room: chatroom,
            user: currentUser.username,
            id_author: currentUser.idUsers,
            data: textMessage,
            type: "text"
          }
        }
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
            chatEditorRef.current.callSave();
          }}
          onCancel={() => {
            setShowModal(false);
            setSelectedChatToEdit(null);
          }}
        >
          <ChatEditor
            ref={chatEditorRef}
            currentUser={currentUser}
            existChatData={selectedChatToEdit ?? undefined}
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
  }
);

export default ChatsFeed;
