/* tslint:disable */
import React from "react";
import { LongText } from "./TextArea.styled";

export interface ITextAreaProps {
  onChange(text: string): void;
  placeholder?: string;
  children?: string;
}

interface ITextAreaState {
  value: string;
}

class TextArea extends React.PureComponent<ITextAreaProps, ITextAreaState> {
  constructor(props: ITextAreaProps) {
    super(props);
    this.state = {
      value: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }
  public handleChange(event: React.FormEvent<HTMLTextAreaElement>) {
    this.setState({
      value: event.currentTarget.value
    });
    this.props.onChange(event.currentTarget.value);
  }
  public render() {
    return (
      <LongText
        onChange={this.handleChange}
        value={this.state.value}
        placeholder={this.props.placeholder}
      >
        {this.props.children}
      </LongText>
    );
  }
}
export default TextArea;
