/* tslint:disable */
import React, { useState, useCallback, useEffect } from "react";
import Container from "../Container";
import Form from "./LoginForm.styled";

interface ILoginFormProps {
  isLogin: (login: string, email: string, pass: string) => void;
}

const LoginForm = ({ isLogin }: ILoginFormProps) => {
  const [login, setLogin] = useState("");
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");

  const inputLogin = (e: React.FormEvent<HTMLInputElement>) => {
    setLogin(e.currentTarget.value);
  };
  const inputPass = (e: React.FormEvent<HTMLInputElement>) => {
    setPass(e.currentTarget.value);
  };
  const inputEmail = (e: React.FormEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
  };

  const handleClick = () => {
    isLogin(login, email, pass);
  };

  return (
    <Container>
      <Form>
        <form>
          <label>Login</label>
          <input
            type="text"
            id="login"
            name="loginField"
            placeholder="Input..."
            value={login}
            onChange={inputLogin}
            required={true}
          />
          <label>E-mail</label>
          <input
            type="text"
            id="email"
            name="emailField"
            placeholder="E-mail..."
            value={email}
            onChange={inputEmail}
            required={true}
          />
          <label>Password</label>
          <input
            type="password"
            id="pass"
            name="passField"
            placeholder="Password..."
            value={pass}
            onChange={inputPass}
            required={true}
          />
          <input
            type="button"
            name="login"
            value="login"
            onClick={handleClick}
          />
        </form>
      </Form>
    </Container>
  );
};

export default LoginForm;
