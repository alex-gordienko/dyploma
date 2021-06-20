/* tslint:disable */
import React from "react";
import { Content } from "./Label.styled";
import {
  LabelBlock,
  ButtonBlock
} from "../../EditorComponents/EditorComponents.styled";

interface ILabelProps {
  onCreate: () => void;
}

class Label extends React.PureComponent<ILabelProps> {
  constructor(props: Readonly<ILabelProps>) {
    super(props);
  }

  public render() {
    return (
      <LabelBlock>
        <Content>
          <div className="label-name">{this.props.children}</div>
        </Content>
        <ButtonBlock>
          <button className="label-button" onClick={this.props.onCreate}>
            Create Chat
          </button>
        </ButtonBlock>
      </LabelBlock>
    );
  }
}

export default Label;
