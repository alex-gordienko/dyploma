/* tslint:disable */
import React, { useState, useRef, useEffect } from "react";
import Label from "./Label";
import EditorBlock from "./EditorBlock";
import SubContainer from "../Container/Container.Pages.styled";

import { StyledEditorBlock } from "./ProfileEditor.styled";
import { SubHeader } from "../EditorComponents/EditorComponents.styled";
import { IFullDataUser } from "../../../App.types";
import { Redirect } from "react-router-dom";
import { sendToSocket } from "../../../backend/httpGet";
import Preloader from "../Preloader";

interface IProfileEditorProps {
  currentUser?: IFullDataUser;
  contries: { id: number; name_en: string }[];
  cities: { id: number; country_id: number; name_en: string }[];
  socket: SocketIOClient.Socket;
  token: string;
  onUpdateUserData: (user: IFullDataUser) => void;
  onError: (message: string) => void;
}

const ProfileEditor = ({
  currentUser,
  socket,
  token,
  onUpdateUserData,
  onError,
  contries,
  cities
}: IProfileEditorProps) => {
  const childRef = useRef<any>();
  const [redirect, setRedirect] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isReady, setIsReady] = useState(true);

  const getRedirect = () => {
    if (redirect) {
      return (
        <Redirect to={currentUser ? "/profile/" + currentUser.username : "/"} />
      );
    }
  };

  socket.on(
    "User Editor Response",
    (
      res: socket.ISocketResponse<
        IFullDataUser | string,
        api.models.IAvailableUserActions
      >
    ) => {
      console.log(res.data.response);
      socket.removeEventListener("User Editor Response");

      if (res.data.requestFor === "Edit User") {
        if (res.status === "OK") {
          setIsReady(true);
          onUpdateUserData(res.data.response as IFullDataUser);
          setRedirect(true);
        } else {
          setIsReady(true);
          onError(res.data.response as string);
        }
      }
    }
  );

  const onUserUpdate = (user: api.models.IUser) => {
    sendToSocket<api.models.IUser, api.models.IAvailableUserActions>(socket, {
      operation: "User Editor Request",
      data: {
        requestFor: "Edit User",
        options: user
      },
      token
    });
    setIsReady(false);
  };

  const onUserCreate = (user: api.models.IUser) => {
    sendToSocket<api.models.IUser, api.models.IAvailableUserActions>(socket, {
      operation: "User Editor Request",
      data: {
        requestFor: "Create User",
        options: user
      },
      token
    });
    setIsReady(false);
  };

  const handleLabelCommand = (number: "Save" | "Cancel") => {
    if (childRef.current) {
      number === "Save" ? childRef.current.callSave() : setRedirect(true);
    }
  };
  return isReady ? (
    <SubContainer>
      {getRedirect()}
      <Label
        disabled={isDisabled}
        labelCommand={handleLabelCommand}
        mode={currentUser ? "Edit" : "Create"}
      >
        {currentUser ? "Edit user " + currentUser.username : "Create"}
      </Label>
      <StyledEditorBlock>
        <SubHeader>
          {currentUser ? "Edit Profile Information" : "Add Profile Information"}
        </SubHeader>
        <EditorBlock
          contries={contries}
          cities={cities}
          ref={childRef}
          existUserData={currentUser}
          saveUserChanges={currentUser ? onUserUpdate : onUserCreate}
          isDisabledToApply={e => setIsDisabled(e)}
        />
      </StyledEditorBlock>
    </SubContainer>
  ) : (
    <Preloader message="Saving data..." />
  );
};

export default ProfileEditor;
