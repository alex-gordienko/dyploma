/* tslint:disable */
import React from "react";
import { NavLink } from "react-router-dom";
import StyledMenu from "./Menu.styled";

const Menu = () => (
  <StyledMenu>
    <div className="menu-createMarker-button">
      <NavLink to="/create-marker" className="button-menu-link">
        Create Marker
      </NavLink>
    </div>
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
      to="/chat"
      className="menu-link"
      activeClassName="menu-link--active"
    >
      Chat
    </NavLink>
  </StyledMenu>
);

export default Menu;
