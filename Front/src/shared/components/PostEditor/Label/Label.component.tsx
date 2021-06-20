/* tslint:disable */
import React from "react";
import { Content } from "./Label.styled";
import {
  LabelBlock,
  ButtonBlock
} from "../../EditorComponents/EditorComponents.styled";
import { NavLink, Redirect } from "react-router-dom";

interface ILabelProps {
  children: string;
  disabled: boolean;
  labelCommand(command: "Save" | "Cancel"): void;
}

class Label extends React.PureComponent<ILabelProps, { redirect: boolean }> {
  constructor(props: ILabelProps) {
    super(props);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);

    this.state = {
      redirect: false
    };
  }
  public handleCancelClick() {
    this.setState({
      redirect: true
    });
  }
  public handleSaveClick() {
    this.props.labelCommand("Save");
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
  };

  public render() {
    return this.props.children === "Error" ? (
      <LabelBlock>
        <Content>
          <div className="label-name">{this.props.children}</div>
        </Content>
        <ButtonBlock>
          <NavLink to="/" className="label-button">
            Back
          </NavLink>
        </ButtonBlock>
      </LabelBlock>
    ) : (
      <LabelBlock>
        <Content>
          <div className="label-name">{this.props.children}</div>
        </Content>
        <ButtonBlock>
          {this.renderRedirect()}
          <button className="label-button" onClick={this.handleCancelClick}>
            Cancel
          </button>
          <button
            disabled={this.props.disabled}
            className="label-button"
            onClick={this.handleSaveClick}
          >
            Create
          </button>
        </ButtonBlock>
      </LabelBlock>
    );
  }
}

export default Label;
