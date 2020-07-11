/* tslint:disable */
import React, { useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import StyledDropDown from './DropDownList.styled';

interface IDropDownListProps {
  visible: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

const DropDownList = ({ visible, onEdit, onDelete }: IDropDownListProps) => {
    return visible?(
      <StyledDropDown>
        <ul>
            <li className="menu-link" onClick={()=>onEdit()}> 
                Edit
            </li>
            <li className="menu-link" onClick={()=>onDelete()}>
                Delete
            </li>
        </ul>
      </StyledDropDown>
    ):
    null;
  }

export default DropDownList;
