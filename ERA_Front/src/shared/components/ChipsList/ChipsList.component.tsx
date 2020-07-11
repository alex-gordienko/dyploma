/* tslint:disable */
import React from "react";
import Chip from "../Chip";
import StyledChipsList from "./ChipsList.styled";

interface IChipsListProps {
  deletable: boolean;
  chipsList: string[];
  onDelete?: (deleteElement: string) => void;
}

const ChipsList = ({ deletable, chipsList, onDelete }: IChipsListProps) => {
  return (
    <StyledChipsList>
      {chipsList.map((element: string, index: number) => {
        return (
          <Chip key={index} deletable={deletable} onDelete={onDelete}>
            {element}
          </Chip>
        );
      })}
    </StyledChipsList>
  );
};
ChipsList.defaultProps = {
  deletable: false
};
export default ChipsList;
