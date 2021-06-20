/* tslint:disable */
import React from "react";
import StyledSelect from "./Select.styled";

interface ISelectProps {
  items: string[];
  className?: string;
}

export default function Select({ items, className }: ISelectProps) {
  return (
    <StyledSelect className={className}>
      <select>
        {items.map((item, indx) => (
          <option key={indx} value={item}>
            {item}
          </option>
        ))}
      </select>
    </StyledSelect>
  );
}
