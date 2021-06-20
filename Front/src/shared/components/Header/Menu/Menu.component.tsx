/* tslint:disable */
import React from "react";
import { NavLink } from "react-router-dom";
import StyledMenu from "./Menu.styled";
import { ButtonBlock } from "../../EditorComponents/EditorComponents.styled";

const Menu = () => (
  <StyledMenu>
    <ButtonBlock>
      <NavLink to="/postEditor/new" className="label-button">
        Create Post
      </NavLink>
    </ButtonBlock>
    <NavLink
      exact={true}
      to="/"
      className="menu-link"
      activeClassName="menu-link--active"
    >
      Main Page
    </NavLink>
    <NavLink
      to="/friendlist"
      className="menu-link"
      activeClassName="menu-link--active"
    >
      Friend's list
    </NavLink>
    <NavLink
      to="/chatlist"
      className="menu-link"
      activeClassName="menu-link--active"
    >
      Chat
    </NavLink>
  </StyledMenu>
);

export default Menu;
