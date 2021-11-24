/* tslint:disable */
import React, { useState, useEffect, useRef } from "react";
import StyledFeed from "./ChatsFeed.styled";
import {
  Delimeter,
  ButtonBlock
} from "../../EditorComponents/EditorComponents.styled";
import ChatPreview from "./ChatPreview";
import { IFullDataUser } from "../../../../App.types";

interface IFeedProps {
  data: api.models.IPreviewChat[];
  onSelect: (value: string) => void;
  onEdit: (chat: api.models.IPreviewChat) => void;
  onDelete: (chat: api.models.IPreviewChat) => void;
}

const Chats = ({ data, onSelect, onEdit, onDelete }: IFeedProps) => {
  return data !== [] ? (
    <StyledFeed>
      {data
        .sort((elem1, elem2) => {
          var date1 = new Date(elem1.lastMessage.time);
          var date2 = new Date(elem2.lastMessage.time);
          return date2 > date1 ? 1 : -1;
        })
        .filter(chat => chat.chatID !== "0")
        .map((item, indx) => {
          return (
            <div key={indx} onClick={() => onSelect(item.chatID.toString())}>
              <ChatPreview
                key={item.chatID}
                item={item}
                onDelete={() => onDelete(item)}
                onEdit={() => {
                  onEdit(item);
                }}
              />
              <Delimeter type="horizontal" />
            </div>
          );
        })}
    </StyledFeed>
  ) : (
    <StyledFeed>No Results Found, dude</StyledFeed>
  );
};

export default Chats;
