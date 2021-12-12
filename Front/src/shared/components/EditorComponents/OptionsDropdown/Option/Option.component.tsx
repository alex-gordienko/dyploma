/* tslint:disable */
import React, { useCallback } from "react";
import StyledOption from "./Option.styled";

interface IOptionProps {
  item: JSX.Element;
  active: boolean;
  onClick?: (item: JSX.Element) => void;
}

const Option = ({ item, active, onClick }: IOptionProps) => {
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(item);
    }
  }, [item]);
  return (
    <StyledOption data-testid={item.key} active={active} onClick={handleClick}>
      {item}
    </StyledOption>
  );
};

Option.defaultProps = {
  active: false
};

export default Option;
