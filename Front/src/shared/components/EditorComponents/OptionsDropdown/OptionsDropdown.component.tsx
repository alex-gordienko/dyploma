/* tslint:disable */
import React, { useState, useEffect } from "react";
import StyledOptionsDropdown from "./OptionsDropdown.styled";
import Option from "./Option";

interface IOptionsDropdownProps {
  visible: boolean;
  data: JSX.Element[];
  onSelect: (value: string) => void;
}
// @todo: rewrite the class component
const OptionsDropdown = ({
  visible,
  data,
  onSelect
}: IOptionsDropdownProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return visible ? (
    <StyledOptionsDropdown>
      {data.length > 0 ? (
        data.map((item, i) => (
          <Option
            key={i}
            item={item}
            active={selectedIndex === i}
            onClick={elem =>
              onSelect(elem.key === null ? "0" : elem.key.toString())
            }
          />
        ))
      ) : (
        <Option key={0} item={<p>"No Results Found"</p>} />
      )}
    </StyledOptionsDropdown>
  ) : null;
};

export default OptionsDropdown;
