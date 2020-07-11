/* tslint:disable */
import React, { useState, useCallback, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { IFullDataUser } from "../../../App.types";
import { Photo, ErrorPageBlock, Error } from "./ErrorPage.styled";
import {ButtonBlock} from "../../components/EditorComponents/EditorComponents.styled";
import UserErr from "../../../assets/icons/UserErr.png";
import ConnErr from "../../../assets/icons/ConnErr.png";

interface IErrorPageServerProps{
  type: "serverError";
  message: string;
}

interface IErrorPageBannedProps {
  type: "banned";
  user: IFullDataUser;
  reason: string;
}
interface IErrorPageNotValidProps {
  type: "nonValid";
  user: IFullDataUser;
}

type IErrorPageProps = IErrorPageServerProps|IErrorPageBannedProps|IErrorPageNotValidProps;

const ErrorPage = (mode: IErrorPageProps) => {
  switch (mode.type){
    case "nonValid":{
      return(
        <ErrorPageBlock>
          <Photo src={UserErr}/>
          <Error>Sorry, user {mode.user.username} is not activated.<br/>(Send message again/Change e-mail) </Error>
        </ErrorPageBlock>
      )
    }
    case "banned":{
      return(
        <ErrorPageBlock>
          <Photo src={UserErr}/>
          <Error>Sorry, user {mode.user.username} is banned.<br/>Reason: {mode.reason} </Error>
        </ErrorPageBlock>
      )
    }
    case "serverError":{
      return(
        <ErrorPageBlock>
          <Photo src={ConnErr}/>
          <Error>Server Error: {mode.message}</Error>
          <ButtonBlock>
            <NavLink 
              className="label-button"
              to={"/"}
              onClick={()=>window.location.reload()}
            >
                Reload Page</NavLink>
          </ButtonBlock>
        </ErrorPageBlock>
      )
    }
  }
};

export default ErrorPage;
