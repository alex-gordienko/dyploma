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
  if (isLogin) {
    return (
      <StyledHeader>
        <Logo />
        <Menu />
        <UserMenu
          avatar={avatar}
          isLogin={isLogin}
          logOut={LogOut}
          username={username}
        />
      </StyledHeader>
    );
  } else {
    return (
      <StyledHeader>
        <Logo />
        <UserMenu
          avatar={avatar}
          isLogin={isLogin}
          logOut={LogOut}
          username={username}
        />
      </StyledHeader>
    );
  }
};

export default Header;
