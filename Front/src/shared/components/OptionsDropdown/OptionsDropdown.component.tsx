/* tslint:disable */
import React, { useState, useEffect } from "react";
import StyledOptionsDropdown from "./OptionsDropdown.styled";
import Option from "./Option";

interface IOptionsDropdownProps {
  visible: boolean;
  data: string[];
  onSelect: (value: string) => void;
}
// @todo: rewrite the class component
const OptionsDropdown = ({
  visible,
  data,
  onSelect
}: IOptionsDropdownProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => {
    if (visible) {
      const keyClick = (e: KeyboardEvent) => {
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex(
            selectedIndex === 0 ? data.length - 1 : selectedIndex - 1
          );
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex(
            selectedIndex === data.length - 1 ? 0 : selectedIndex + 1
          );
        } else if (e.key === "Enter") {
          e.preventDefault();
          onSelect(data[selectedIndex]);
        }
      };
      window.addEventListener("keydown", keyClick);
      return () => {
        window.removeEventListener("keydown", keyClick);
      };
    }
  });
  return visible ? (
    <StyledOptionsDropdown>
      {data.map((item, i) => (
        <Option
          key={item}
          item={item}
          active={selectedIndex === i}
          onClick={onSelect}
        />
      ))}
    </StyledOptionsDropdown>
  ) : null;
};

export default OptionsDropdown;
