/* tslint:disable */
import React, { useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import StyledDropDown from "./DropDownList.styled";

interface IDropDownListProps {
  visible: boolean;
  menuItemList: {
    label: string;
    onClick: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
  }[];
}

const DropDownList = ({ visible, menuItemList }: IDropDownListProps) => {
  return visible ? (
    <StyledDropDown>
      <ul>
        {menuItemList.map(item => {
          return (
            <li className="menu-link" onClick={item.onClick}>
              {item.label}
            </li>
          );
        })}
      </ul>
    </StyledDropDown>
  ) : null;
};

export default DropDownList;
