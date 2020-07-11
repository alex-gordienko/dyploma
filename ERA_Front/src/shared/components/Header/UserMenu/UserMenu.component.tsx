/* tslint:disable */
import React, { useEffect, useCallback, useState } from "react";
import StyledUserMenu from "./UserMenu.styled";
import { NavLink } from "react-router-dom";
import DropDownList from './DropDownList';

interface IBodyBlockProps {
  avatar: string;
  isLogin: boolean;
  logOut: () => void;
  username: string;
}

const UserMenu = ({ avatar, isLogin, logOut, username }: IBodyBlockProps) => {
  const [visible, setVisible] = useState(false);
          //onMouseEnter={()=>setVisible(true)}
          //onMouseLeave={()=>setVisible(false)}
  const LogOut = useCallback(() => {
    logOut();
  }, []);
  if (isLogin) {
    return (
      <StyledUserMenu>
        <a className="user-menu__link" href="User.html">
          <img
            className="user-menu__avatar"
            src={avatar}
            alt="user-photo"
          />
        </a>
        <div className="user-menu__wrapper" 
          onMouseEnter={()=>setVisible(true)}
          onMouseLeave={()=>setVisible(false)}
        >
          <div className="user-menu__name">{username}</div>
          <div className="user-menu__role">Admin</div>
          
          <DropDownList user={username} visible={visible} onLogout={LogOut}/>
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
