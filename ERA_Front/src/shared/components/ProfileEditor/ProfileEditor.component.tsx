/* tslint:disable */
import React, { useState, useRef } from "react";
import Label from "./Label";
import EditorBlock from "./EditorBlock";
import SubContainer from '../Container/Container.Pages.styled';

import { StyledEditorBlock } from './ProfileEditor.styled';
import { SubHeader } from '../EditorComponents/EditorComponents.styled';
import { IFullDataUser } from "../../../App.types";
import { Redirect } from "react-router-dom";

interface IProfileCreateProps {
  contries: {id: number;name_en: string;}[];
  cities: {id: number; country_id: number;name_en: string;}[];
  onUserCreate?: (newUser: IFullDataUser) => void;
}

interface IProfileEditorProps extends IProfileCreateProps {
  userData?: IFullDataUser;
  onUserUpdate?: (user: IFullDataUser)=> void;
}

const ProfileEditor = (
  {
    contries,
    cities,
    userData,
    onUserUpdate,
    onUserCreate
  }: IProfileEditorProps
  ) => {
  const childRef = useRef<any>();
  const [redirect, setRedirect] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const getRedirect=()=>{
    if(redirect){
      return <Redirect to={userData? "/profile/"+userData.username : "/"}/>
    }
  }
  const handleLabelCommand = (number: "Save" | "Cancel") => {
    if(childRef.current){
      number === "Save" ? childRef.current.callSave(): setRedirect(true);
    }
    
  };
  return (
      <SubContainer>
        {getRedirect()}
        <Label 
          disabled={isDisabled}
          labelCommand={handleLabelCommand}
          mode={userData? "Edit": "Create"}
        >
          {userData? "Edit user "+userData.username: "Create"}
        </Label>
        <StyledEditorBlock>
          <SubHeader>
            {userData
              ? "Edit Profile Information"
              : "Add Profile Information"}
          </SubHeader>
          <EditorBlock 
              contries={contries}
              cities={cities}
              ref={childRef} 
              existUserData={userData} 
              saveUserChanges={userData? onUserUpdate!: onUserCreate!}
              isDisabledToApply={(e)=>setIsDisabled(e)}
          />
        </StyledEditorBlock>
      </SubContainer>
  );
};

export default ProfileEditor;
