/* tslint:disable */
import React, { useState, useCallback, useEffect } from "react";
import { NavLink } from "react-router-dom";
import TextInputItem from "../EditorComponents/EditorTextInput/EditorTextInput.component";
import Form, { LogoContainer } from "./LoginForm.styled";
import {
  ButtonBlock,
  Delimeter
} from "../EditorComponents/EditorComponents.styled";
import { ReactComponent as LogoIcon } from "../../../assets/icons/fullLogo.svg";

interface ILoginFormProps {
  isLogin: (login: string, pass: string) => void;
}

const LoginForm = ({ isLogin }: ILoginFormProps) => {
  const [login, setLogin] = useState("");
  const [pass, setPass] = useState("");

  const inputLogin = (e: string) => {
    setLogin(e);
  };
  const inputPass = (e: string) => {
    setPass(e);
  };

  const handleClick = () => {
    isLogin(login, pass);
  };

  return (
    <Form>
      <LogoContainer>
        <LogoIcon width="80px" height="80px" />
        <Delimeter type="vertical" />
        <p>Eternal Radiance</p>
      </LogoContainer>
      <TextInputItem
        required={true}
        label="Login: "
        placeholder="Your username in system"
        lenght="TextInput"
        value={login}
        onChange={inputLogin}
      />
      <TextInputItem
        required={true}
        label="Password: "
        placeholder="Password..."
        type="password"
        lenght="TextInput"
        value={pass}
        onChange={inputPass}
      />
      <ButtonBlock>
        <button
          disabled={login === "" || pass === "" ? true : false}
          className="label-button"
          onClick={handleClick}
        >
          Log in
        </button>
        <NavLink to="/registration" className="label-button">
          Create Profile
        </NavLink>
      </ButtonBlock>
    </Form>
  );
};

export default LoginForm;
