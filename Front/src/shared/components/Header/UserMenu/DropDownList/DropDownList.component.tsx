/* tslint:disable */
import React, { useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import StyledDropDown from "./DropDownList.styled";

interface IDropDownListProps {
  visible: boolean;
  user: string;
  onLogout: () => void;
}

const DropDownList = ({ user, visible, onLogout }: IDropDownListProps) => {
  return visible ? (
    <StyledDropDown>
      <ul>
        <li>
          <NavLink
            to={"/profile/" + user}
            className="menu-link"
            activeClassName="menu-link--active"
          >
            My Profile
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/settings"
            className="menu-link"
            activeClassName="menu-link--active"
          >
            Settings
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/login"
            className="menu-link"
            activeClassName="menu-link--active"
            onClick={onLogout}
          >
            Log Out
          </NavLink>
        </li>
      </ul>
    </StyledDropDown>
  ) : null;
};

export default DropDownList;
