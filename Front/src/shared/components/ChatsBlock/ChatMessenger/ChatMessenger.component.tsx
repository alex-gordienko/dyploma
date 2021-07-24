/* tslint:disable */
import React, { useState, useEffect, useRef } from "react";
import StyledMessenger, {
  Avatar,
  Chatname,
  MessageContainer,
  MessageContent,
  MessageAuthor,
  MessageDate,
  MessageTime,
  MessangerHeader,
  MessengerContentBlock,
  MessengerFooterBlock
} from "./ChatMessenger.styled";
import {
  Delimeter,
  ButtonBlock
} from "../../EditorComponents/EditorComponents.styled";
import { IChat, IFullDataUser, IMessage } from "../../../../App.types";
import Input from "../../EditorComponents/Input";
import TextArea from "../../EditorComponents/TextArea";
import Modal from "../../Modal";
import defaultAvatar from "../../../../assets/img/DefaultPhoto.jpg";
import { ReactComponent as Cross } from "../../../../assets/icons/cross.svg";

interface IChatProps {
  currentUser: IFullDataUser;
  isTyping: { room: string; typing: string[] }[];
  data: IChat;
  onTyping: (chatroom: string, username: string) => void;
  onSend: (chatroom: string, textMessage: string) => void;
  onDelete: (
    chatroom: string,
    justHideFromAuthor: boolean,
    selectedMessageIDs: number[]
  ) => void;
}

const Chat = ({
  currentUser,
  isTyping,
  data,
  onTyping,
  onSend,
  onDelete
}: IChatProps) => {
  const nullMessage: IMessage[] = [];
  const [selectedMessages, setSelectedMessages] = useState(nullMessage);
  const [text, setText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [justHide, setJustHide] = useState(true);

  useEffect(() => {
    setSelectedMessages(nullMessage);
  }, [data]);

  const MessageAuthorBlock = (item: IMessage, indx: number) => {
    let avatar =
      data.members.find(member => member.idUsers === item.id_author)!.avatar !==
      null
        ? data.members.find(member => member.idUsers === item.id_author)?.avatar
        : defaultAvatar;
    return data.type === "public" ? (
      indx >= 1 && item.id_author !== data.messages[indx - 1].id_author ? (
        <MessageAuthor
          Rating={
            data.members.find(member => member.idUsers === item.id_author)!
              .rating
          }
        >
          <img className="avatar" src={avatar} />
          {
            data.members.find(member => member.idUsers === item.id_author)
              ?.username
          }
        </MessageAuthor>
      ) : indx < 1 ? (
        <MessageAuthor
          Rating={
            data.members.find(member => member.idUsers === item.id_author)!
              .rating
          }
        >
          <img className="avatar" src={avatar} />
          {
            data.members.find(member => member.idUsers === item.id_author)
              ?.username
          }
        </MessageAuthor>
      ) : null
    ) : null;
  };

  const MessageDateBlock = (item: IMessage, indx: number) => {
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var birth = new Date(item.time);
    var prevMessageDate = new Date(
      indx === 0 ? data.messages[indx].time : data.messages[indx - 1].time
    );
    var title;

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Nov",
      "Dec"
    ];
    title =
      birth.getDate() +
      " " +
      months[birth.getMonth()] +
      " " +
      birth.getFullYear();

    if (indx === 0) return <MessageDate title={title}>{title}</MessageDate>;
    else {
      if (birth.getDate() !== prevMessageDate.getDate()) {
        if (today.getDate() - birth.getDate() === 0)
          return <MessageDate title={title}>Today</MessageDate>;
        else if (today.getDate() - birth.getDate() === 1)
          return <MessageDate title={title}>Yesterday</MessageDate>;
        else if (today.getDate() - birth.getDate() > 2)
          return <MessageDate title={title}>{title}</MessageDate>;
      } else return null;
    }
  };

  const MessageTimeBlock = (itemTime: string) => {
    let date = new Date(itemTime);
    let hour = date.getHours();
    let minutes = date.getMinutes();
    return (
      <MessageTime>
        {hour.toString()}:
        {minutes < 10 ? "0" + minutes.toString() : minutes.toString()}
      </MessageTime>
    );
  };

  const onType = (text: string) => {
    onTyping(data.chatID.toString(), currentUser.username);
    setText(text);
  };

  const onKeyDown = (key: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (text.length > 0 && key.key === "Enter") {
      console.log(text);
      onSend(data.chatID.toString(), text);
      setText("");
    }
  };
  const sendMessage = () => {
    if (text.length > 0) {
      console.log(text);
      onSend(data.chatID.toString(), text);
      setText("");
    }
  };

  const selectMessage = (messageID: number) => {
    setSelectedMessages(prevState => {
      if (prevState.find(searched => searched.id === messageID) === undefined) {
        console.log("That's new message");
        let newSelected: IMessage[] = prevState.concat(
          data.messages.filter(searched => searched.id === messageID)
        );
        return newSelected;
      } else {
        console.log("Already selected");
        let newSelected: IMessage[] = prevState.filter(
          searched => searched.id !== messageID
        );
        return newSelected;
      }
    });
  };

  const dropSelection = () => {
    setSelectedMessages(nullMessage);
  };

  const deleteMessage = () => {
    setShowModal(true);
  };

  return data.chatID !== "0" ? (
    <StyledMessenger>
      {selectedMessages.length < 1 ? (
        <MessangerHeader>
          <Avatar>
            <img src={data.avatar} key={data.chatID} alt="Pic is here" />
          </Avatar>
          <Chatname>
            {data.name}
            <div className="type">
              {data.type}, {data.members.length} members
            </div>
            <div>
              {isTyping.map(roomTypers => {
                if (
                  roomTypers.room === data.chatID &&
                  roomTypers.typing.length > 1
                )
                  return (
                    roomTypers.typing.filter(typer => typer !== "") +
                    " is typing..."
                  );
              })}
            </div>
          </Chatname>
        </MessangerHeader>
      ) : (
        <MessangerHeader>
          <ButtonBlock>
            <button className="label-drop" onClick={dropSelection}>
              <Cross fill="black" width="14" height="14" />
              {selectedMessages.length} selected
            </button>
            <button className="label-button" onClick={deleteMessage}>
              Delete
            </button>
          </ButtonBlock>
        </MessangerHeader>
      )}

      <MessengerContentBlock>
        {data.messages !== [] ? (
          data.messages
            .filter(
              msg =>
                !(
                  msg.isHiddenFromAuthor &&
                  msg.id_author === currentUser.idUsers
                )
            )
            .map((item, indx) => {
              return (
                <div>
                  {MessageDateBlock(item, indx)}
                  <MessageContainer
                    myMessage={
                      item.id_author === currentUser.idUsers ? true : false
                    }
                    onClick={() => selectMessage(item.id)}
                    title={item.time}
                    key={indx}
                  >
                    {MessageAuthorBlock(item, indx)}
                    <MessageContent
                      myMessage={
                        item.id_author === currentUser.idUsers ? true : false
                      }
                    >
                      {item.message}
                    </MessageContent>
                    {MessageTimeBlock(item.time)}
                  </MessageContainer>
                </div>
              );
            })
        ) : (
          <p>No Messages here</p>
        )}
      </MessengerContentBlock>
      <MessengerFooterBlock>
        <Modal
          show={showModal}
          type="warning"
          name="Delete"
          onOK={() => {
            onDelete(
              data.chatID,
              justHide,
              selectedMessages.map(sel => sel.id)
            );
            setShowModal(false);
            setSelectedMessages([]);
          }}
          onCancel={() => {
            setShowModal(false);
          }}
        >
          <div>
            <p>Are you sure to delete {selectedMessages.length} messages?</p>
            <input
              type="checkbox"
              onChange={e => {
                setJustHide(!e.currentTarget.value);
              }}
            />
            Also delete for{" "}
            {data.type === "private"
              ? data.members.find(
                  member => member.idUsers !== currentUser.idUsers
                )?.username
              : "all"}
            ?
          </div>
        </Modal>
        <TextArea
          onKeyDown={onKeyDown}
          onChange={onType}
          postpendComponent={
            <ButtonBlock>
              <div onClick={sendMessage} className="label-button">
                Send
              </div>
            </ButtonBlock>
          }
        />
      </MessengerFooterBlock>
    </StyledMessenger>
  ) : (
    <StyledMessenger>Please, select chat</StyledMessenger>
  );
};

export default Chat;
