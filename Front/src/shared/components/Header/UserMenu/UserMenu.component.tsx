/* tslint:disable */
import React, { useEffect, useCallback } from "react";
import DefaultPhoto from "../../../../assets/img/DefaultPhoto.jpg";
import StyledUserMenu from "./UserMenu.styled";
import { NavLink } from "react-router-dom";

interface IBodyBlockProps {
  avatar: string;
  isLogin: boolean;
  logOut: () => void;
  username: string;
}

const UserMenu = ({ avatar, isLogin, logOut, username }: IBodyBlockProps) => {
  const LogOut = useCallback(() => {
    logOut();
  }, []);
  if (isLogin) {
    return (
      <StyledUserMenu>
        <a className="user-menu__link" href="User.html">
          <img
            className="user-menu__avatar"
            src={DefaultPhoto}
            alt="user-photo"
          />
        </a>
        <div className="user-menu__wrapper">
          <div className="user-menu__name">{username}</div>
          <div className="user-menu__role">Admin</div>
          <a className="user-menu__role" onClick={LogOut}>
            Log out
          </a>
        </div>
      </StyledUserMenu>
    );
  } else {
    return (
      <StyledUserMenu>
        <NavLink
          to="/login"
          className="menu-link"
          activeClassName="menu-link--active"
        >
          Login
        </NavLink>
      </StyledUserMenu>
    );
  }
};

export default UserMenu;
