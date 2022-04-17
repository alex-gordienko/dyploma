/* tslint:disable */
import React from "react";
import { Content, ChatButtons } from "./Label.styled";
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
        <ChatButtons>
          <ButtonBlock>
            <button className="label-button" onClick={this.props.onCreate}>
              Create Chat
            </button>
          </ButtonBlock>
        </ChatButtons>
      </LabelBlock>
    );
  }
}

export default Label;
