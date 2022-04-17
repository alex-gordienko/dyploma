/* tslint:disable */
import React, { useState } from "react";
import Menu from "./Menu";
import UserMenu from "./UserMenu";
import Logo from "./Logo";
import StyledHeader from "./Header.styled";

interface IHeaderProps {
  avatar: string;
  isLogin: boolean;
  LogOut: () => void;
  username: string;
}

const Header = ({ avatar, isLogin, LogOut, username }: IHeaderProps) => {
  return (
    <StyledHeader>
      <Logo />
      {isLogin && <Menu />}
      <UserMenu
        avatar={avatar}
        isLogin={isLogin}
        logOut={LogOut}
        username={username}
      />
    </StyledHeader>
  );
};

export default Header;
