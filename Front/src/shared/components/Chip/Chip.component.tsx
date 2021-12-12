/* tslint:disable */
import React from "react";
import StyledChip from "./Chip.styled";
import { ReactComponent as CloseIcon } from "../../../assets/icons/cross.svg";

interface IChipProps {
  children: string;
  deletable: boolean;
  onDelete?: (deleteElement: string) => void;
}

class Chip extends React.PureComponent<IChipProps> {
  public static defaultProps = {
    deletable: false
  };

  constructor(props: Readonly<IChipProps>) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  public handleClick() {
    if (this.props.onDelete) {
      this.props.onDelete(this.props.children);
    }
  }

  public render() {
    return (
      <StyledChip deletable={this.props.deletable}>
        {this.props.children}
        {this.props.deletable && (
          <button className="delete-icon" onClick={this.handleClick}>
            <CloseIcon />
          </button>
        )}
      </StyledChip>
    );
  }
}
export default Chip;
