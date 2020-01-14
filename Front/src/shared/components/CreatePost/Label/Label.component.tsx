/* tslint:disable */
import React from "react";
import { LabelBlock, Content } from "./Label.styled";
import { ButtonBlock } from "../CreatePost.styled";

interface ILabelProps {
  children: string;
  labelCommand(command: "Save" | "Cancel"): void;
}

class Label extends React.PureComponent<ILabelProps> {
  constructor(props: Readonly<ILabelProps>) {
    super(props);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
  }
  public handleCancelClick() {
    this.props.labelCommand("Cancel");
  }
  public handleSaveClick() {
    this.props.labelCommand("Save");
  }

  public render() {
    return (
      <LabelBlock>
        <Content>
          <div className="label-name">{this.props.children}</div>
        </Content>
        <ButtonBlock>
          <button className="label-button" onClick={this.handleCancelClick}>
            Cancel
          </button>
          <button className="label-button" onClick={this.handleSaveClick}>
            Create
          </button>
        </ButtonBlock>
      </LabelBlock>
    );
  }
}

export default Label;
