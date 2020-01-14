/* tslint:disable */
import React from "react";
import Input from "../../../Input";
import TextArea from "../../../TextArea";
import StyledTextInput from "./EditorTextInput.styled";
import { FieldName, Element } from "../../CreatePost.styled";

interface IEditorItemProps {
  label: string;
  placeholder: string;
  lenght: "TextInput" | "TextArea";
  type?: string;
  pattern?: string;
  required?: boolean;
  onChange: (text: string) => void;
}

export default function InputEditorItem({
  label,
  placeholder,
  lenght,
  type,
  pattern,
  required,
  onChange
}: IEditorItemProps) {
  return (
    <StyledTextInput>
      <FieldName>{label}</FieldName>
      <Element>
        {lenght === "TextInput" ? (
          <Input type={type} placeholder={placeholder} onChanged={onChange} />
        ) : (
          <div className="long-text">
            <TextArea onChange={onChange} placeholder={placeholder} />
          </div>
        )}
      </Element>
    </StyledTextInput>
  );
}
