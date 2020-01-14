/* tslint:disable */
import React, { useCallback } from "react";
import StyledOption from "./Option.styled";

interface IOptionProps {
  item: string;
  active: boolean;
  onClick: (item: string) => void;
}

const Option = ({ item, active, onClick }: IOptionProps) => {
  const handleClick = useCallback(() => {
    onClick(item);
  }, [item]);
  return (
    <StyledOption data-testid={item} active={active} onClick={handleClick}>
      {item}
    </StyledOption>
  );
};

Option.defaultProps = {
  active: false
};

export default Option;
