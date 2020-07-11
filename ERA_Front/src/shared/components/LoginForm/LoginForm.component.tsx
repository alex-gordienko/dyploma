/* tslint:disable */
import React, { useState, useCallback, useEffect } from "react";
import { NavLink } from "react-router-dom";
import TextInputItem from '../EditorComponents/EditorTextInput/EditorTextInput.component'
import Form from "./LoginForm.styled";
import { ButtonBlock } from "../EditorComponents/EditorComponents.styled";

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
            <button disabled={login===""||pass===""? true: false}
              className="label-button" onClick={handleClick}>
              Log in
            </button>
            <NavLink
              to="/registration"
              className="label-button"
              >
                Create Profile
            </NavLink>
          </ButtonBlock>
          
      </Form>
  );
};

export default LoginForm;
