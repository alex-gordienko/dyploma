/* tslint:disable */
import React, { useState, useRef, useEffect } from "react";
import Label from "./Label";
import EditorBlock from "./EditorBlock";
import SubContainer from "../Container/Container.Pages.styled";

import { StyledEditorBlock } from "./ProfileEditor.styled";
import { SubHeader } from "../EditorComponents/EditorComponents.styled";
import { IFullDataUser } from "../../../App.types";
import { Redirect } from "react-router-dom";

interface IProfileEditorProps {
  user?: IFullDataUser;
  contries: { id: number; name_en: string }[];
  cities: { id: number; country_id: number; name_en: string }[];
  socket: SocketIOClient.Socket;
  token: string;
  onError: (message: string) => void;
}

const ProfileEditor = ({
  user,
  socket,
  token,
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
      return <Redirect to={user ? "/profile/" + user.username : "/"} />;
    }
  };

  socket.on(
    "User Editor Response",
    (
      res: socket.ISocketResponse<
        ISearchedUser[],
        api.models.IAvailableUserActions
      >
    ) => {
      console.log(res.data.response);
      socket.removeEventListener("User Searcher Response");

      if (res.data.requestFor === "Search Peoples") {
        if (res.status === "Not Found") {
          if (searchedPeoples.length < 1) setSearchedPeoples([]);
        }
        if (res.status === "SQL Error") {
          onError((res.data.response as unknown) as string);
        }
        if (res.status === "OK") {
          setSearchedPeoples(prevState =>
            uniqBy([...prevState, ...res.data.response], "idUsers")
          );
        }
        setReadyToCallNextPage(true);
      }
      if (res.data.requestFor === "Search Friends") {
        if (res.status === "Not Found") {
          if (friends.length < 1) setFriends([]);
        }
        if (res.status === "SQL Error") {
          onError((res.data.response as unknown) as string);
        }
        if (res.status === "OK") {
          setFriends(prevState =>
            uniqBy([...prevState, ...res.data.response], "idUsers")
          );
        }
        setReadyToCallNextPage(true);
      }
      if (res.data.requestFor === "Search Invites") {
        if (res.status === "Not Found") {
          if (invites.length < 1) setInvites([]);
        }
        if (res.status === "SQL Error") {
          onError((res.data.response as unknown) as string);
        }
        if (res.status === "OK") {
          setInvites(prevState =>
            uniqBy([...prevState, ...res.data.response], "idUsers")
          );
        }
        setReadyToCallNextPage(true);
      }
      if (res.data.requestFor === "Search Blocked") {
        if (res.status === "Not Found") {
          if (blocked.length < 1) setBlocked([]);
        }
        if (res.status === "SQL Error") {
          onError((res.data.response as unknown) as string);
        }
        if (res.status === "OK") {
          setBlocked(prevState =>
            uniqBy([...prevState, ...res.data.response], "idUsers")
          );
        }
        setReadyToCallNextPage(true);
      }
    }
  );

  const searchPeople = useCallback(
    (filter = filters, preloadedPeople = searchedPeoples.length) => {
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
      setReadyToCallNextPage(false);
    },
    [filters, searchedPeoples.length]
  );

  const handleLabelCommand = (number: "Save" | "Cancel") => {
    if (childRef.current) {
      number === "Save" ? childRef.current.callSave() : setRedirect(true);
    }
  };
  return (
    <SubContainer>
      {getRedirect()}
      <Label
        disabled={isDisabled}
        labelCommand={handleLabelCommand}
        mode={userData ? "Edit" : "Create"}
      >
        {userData ? "Edit user " + userData.username : "Create"}
      </Label>
      <StyledEditorBlock>
        <SubHeader>
          {userData ? "Edit Profile Information" : "Add Profile Information"}
        </SubHeader>
        <EditorBlock
          contries={contries}
          cities={cities}
          ref={childRef}
          existUserData={userData}
          saveUserChanges={userData ? onUserUpdate! : onUserCreate!}
          isDisabledToApply={e => setIsDisabled(e)}
        />
      </StyledEditorBlock>
    </SubContainer>
  );
};

export default ProfileEditor;
