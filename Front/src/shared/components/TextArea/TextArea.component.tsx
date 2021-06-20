/* tslint:disable */
import React from "react";
import { StyledTextArea, LongText } from "./TextArea.styled";

export interface ITextAreaProps {
  onChange(text: string): void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  initValue?: string | number;
  prependComponent?: JSX.Element;
  postpendComponent?: JSX.Element;
}

class TextArea extends React.PureComponent<
  ITextAreaProps,
  { value: string | number | undefined }
> {
  constructor(props: ITextAreaProps) {
    super(props);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      value: this.props.initValue
    };
  }

  componentWillReceiveProps() {
    this.setState({
      value: this.props.initValue
    });
  }
  public handleChange(event: React.FormEvent<HTMLTextAreaElement>) {
    this.setState({
      value: event.currentTarget.value
    });
    this.props.onChange(event.currentTarget.value);
  }

  public render() {
    return (
      <StyledTextArea>
        {this.props.prependComponent ? this.props.prependComponent : null}
        <LongText
          onKeyPress={this.props.onKeyDown}
          onChange={this.handleChange}
          value={this.state.value}
          placeholder={this.props.placeholder}
        />
        {this.props.postpendComponent ? this.props.postpendComponent : null}
      </StyledTextArea>
    );
  }
}
export default TextArea;
