/* tslint:disable */
import React, { useCallback, useState } from "react";
import {
  StyledChatPreview,
  LeftBlock,
  CenterBlock,
  RightBlock,
  Avatar,
  Label,
  Body,
  Online,
  Footer
} from "./ChatPreview.styled";
import { IPreviewChat, IMember } from "../../../../../App.types";
import defaultAvatar from "../../../../../assets/img/DefaultPhoto.jpg";
import { ReactComponent as MoreIcon } from "../../../../../assets/icons/more.svg";
import DropDown from "./DropDownList";

interface IChatPreviewProps {
  item: IPreviewChat;
  onEdit: () => void;
  onDelete: () => void;
}

const ChatPreview = ({ item, onEdit, onDelete }: IChatPreviewProps) => {
  const [visible, setVisible] = useState(false);
  const getAge = (dob: string) => {
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var birth = new Date(dob);
    var dobInThisYear = new Date(
      today.getFullYear(),
      birth.getMonth(),
      birth.getDate()
    );
    var Age, title;

    Age = today.getFullYear() - birth.getFullYear();
    if (today < dobInThisYear) Age -= 1;

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
    return <div title={title}>{Age} years</div>;
  };

  let avatar = item.avatar !== null ? item.avatar : defaultAvatar;

  return (
    <StyledChatPreview key={item.chatID}>
      <LeftBlock>
        <Avatar>
          <img src={avatar} key={item.chatID} alt="Pic is here" />
        </Avatar>
      </LeftBlock>
      <CenterBlock>
        <Label>{item.name}</Label>
        <Online>{item.type}</Online>
        {item.lastMessage.id !== 0 ? (
          <Footer>
            {
              item.members.find(
                member => member.idUsers === item.lastMessage.id_author
              )?.username
            }
            : {item.lastMessage.message}
          </Footer>
        ) : (
          <Footer>No Messages here</Footer>
        )}
      </CenterBlock>
      <RightBlock
        onMouseLeave={() => {
          setVisible(false);
        }}
      >
        <MoreIcon
          style={{ width: "15px", height: "15px" }}
          onMouseEnter={() => {
            setVisible(true);
          }}
        />
        <DropDown visible={visible} onEdit={onEdit} onDelete={onDelete} />
      </RightBlock>
    </StyledChatPreview>
  );
};

export default ChatPreview;
