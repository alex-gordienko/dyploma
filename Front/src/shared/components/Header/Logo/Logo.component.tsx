/* tslint:disable */
import React from "react";
import StyledLogo from "./Logo.styled";
import { ReactComponent as LogoIcon } from "../../../../assets/icons/fullLogo.svg";

const Logo = () => (
  <StyledLogo>
    <LogoIcon width="50px" height="50px" />
  </StyledLogo>
);

export default Logo;
