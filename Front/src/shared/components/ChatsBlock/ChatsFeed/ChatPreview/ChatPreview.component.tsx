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
import defaultAvatar from "../../../../../assets/img/DefaultPhoto.jpg";
import { ReactComponent as MoreIcon } from "../../../../../assets/icons/more.svg";
import DropDown from "./DropDownList";

interface IChatPreviewProps {
  item: api.models.IPreviewChat;
  onEdit: () => void;
  onDelete: () => void;
}

const ChatPreview = ({ item, onEdit, onDelete }: IChatPreviewProps) => {
  const [visible, setVisible] = useState(false);

  let avatar = item.avatar !== null ? item.avatar : defaultAvatar;

  const dropdownList = [
    {
      label: "Edit",
      onClick: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        event.stopPropagation();
        onEdit();
      }
    },
    {
      label: "Delete",
      onClick: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        event.stopPropagation();
        onDelete();
      }
    }
  ];

  return (
    <StyledChatPreview
      key={item.chatID}
      onMouseLeave={() => {
        setVisible(false);
      }}
    >
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
      <RightBlock>
        <MoreIcon
          style={{ width: "15px", height: "15px" }}
          onMouseEnter={() => {
            setVisible(true);
          }}
        />
        <DropDown visible={visible} menuItemList={dropdownList} />
      </RightBlock>
    </StyledChatPreview>
  );
};

export default ChatPreview;
