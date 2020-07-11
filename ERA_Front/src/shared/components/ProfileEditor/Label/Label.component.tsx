/* tslint:disable */
import React from "react";
import { Content } from "./Label.styled";
import { LabelBlock } from "../../EditorComponents/EditorComponents.styled";
import { ButtonBlock } from "../../EditorComponents/EditorComponents.styled";

interface ILabelProps {
  children: string;
  mode: "Create" | "Edit";
  labelCommand(command: "Save" | "Cancel"): void;
  disabled: boolean;
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
          <button disabled={this.props.disabled} className="label-button" onClick={this.handleSaveClick}>
              {this.props.mode==="Create"? "Create": "Save"}
          </button>
        </ButtonBlock>
      </LabelBlock>
    );
  }
}

export default Label;
