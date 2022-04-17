/* tslint:disable */
import React from "react";
import { Content, Status, ProfileEditButton } from "./Label.styled";
import { LabelBlock } from "../../EditorComponents/EditorComponents.styled";
import { ButtonBlock } from "../../EditorComponents/EditorComponents.styled";
import { NavLink } from "react-router-dom";

interface ILabelProps {
  editable: boolean;
  rating: number;
  children: string;
  status: string;
  labelCommand(): void;
}

class Label extends React.PureComponent<ILabelProps> {
  constructor(props: Readonly<ILabelProps>) {
    super(props);
    this.handleEditClick = this.handleEditClick.bind(this);
  }
  public handleEditClick() {
    this.props.labelCommand();
  }

  public render() {
    const { children, editable, rating, status } = this.props;
    return editable ? (
      <LabelBlock>
        <Content Rating={rating}>
          <div className="label-name">
            {children} ({rating})
          </div>
        </Content>
        <Status>{status ? <div>&laquo;{status}&raquo;</div> : null}</Status>
        <ProfileEditButton>
          <ButtonBlock>
            <button className="label-button" onClick={this.handleEditClick}>
              Edit
            </button>
          </ButtonBlock>
        </ProfileEditButton>
      </LabelBlock>
    ) : (
      <LabelBlock>
        <Content Rating={rating}>
          <div className="label-name">{children}</div>
        </Content>
        <Status>{status ? <div>&laquo;{status}&raquo;</div> : null}</Status>
      </LabelBlock>
    );
  }
}

export default Label;
