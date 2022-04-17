/* tslint:disable */
import React, { useRef, useState, useCallback, useEffect } from "react";
import EditorTextViewer from "../../EditorComponents/EditorTextViewer/EditorTextViewer.component";
import {
  StyledUserDataBlock,
  TopUserDataBlock,
  BottomUserDataBlock,
  InfoBlock,
  Photo,
  PhotoBlock,
  Progress
} from "./UserDataBlock.styled";
import { IFullDataUser, ISearchedUser } from "../../../../App.types";
import defaultPhoto from "../../../../assets/img/DefaultPhoto.jpg";
import { ButtonBlock } from "../../EditorComponents/EditorComponents.styled";

interface IUserDataBlockProps {
  currentUser: IFullDataUser;
  isMyFriend: boolean;
  userData: IFullDataUser | ISearchedUser;
}

const UserDataBlock = ({
  currentUser,
  isMyFriend,
  userData
}: IUserDataBlockProps) => {
  return (
    <StyledUserDataBlock>
      <TopUserDataBlock>
        <PhotoBlock>
          <Photo
            src={userData.avatar ? userData.avatar : defaultPhoto}
            alt={"Photo is here"}
          />
          {currentUser.idUsers === userData.idUsers ? null : (
            <ButtonBlock>
              <div className="label-button">Send Message</div>
              {isMyFriend ? (
                <div className="label-button">Remove friend</div>
              ) : (
                <div className="label-button">Add to friends</div>
              )}
            </ButtonBlock>
          )}
        </PhotoBlock>
        <InfoBlock>
          <Progress Rating={userData.rating} />
          <EditorTextViewer
            label="Name"
            lenght="TextInput"
            value={userData.FirstName + " " + userData.LastName}
          />
          {userData.Country !== null && userData.City !== null ? (
            <EditorTextViewer
              label="Living in"
              lenght="TextInput"
              value={userData.Country + ", " + userData.City}
            />
          ) : null}
          <EditorTextViewer
            label="Birthday"
            lenght="TextInput"
            value={userData.Birthday}
          />
          <EditorTextViewer
            label="Phone"
            lenght="TextInput"
            value={userData.phone.toString()}
          />
        </InfoBlock>
      </TopUserDataBlock>
      <BottomUserDataBlock></BottomUserDataBlock>
    </StyledUserDataBlock>
  );
};

export default UserDataBlock;
