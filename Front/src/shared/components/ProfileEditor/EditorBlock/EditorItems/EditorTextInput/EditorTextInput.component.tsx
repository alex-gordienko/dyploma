/* tslint:disable */
import React, { useState } from "react";
import Input from "../../../../Input";
import TextArea from "../../../../TextArea";
import StyledTextInput from "./EditorTextInput.styled";
import { FieldName, Element } from "../../EditorBlock.styled";

interface IEditorItemProps {
  label: string;
  placeholder: string;
  lenght: "TextInput" | "TextArea";
  type?: string;
  pattern?: string;
  required?: boolean;
}

export default function InputEditorItem({
  label,
  placeholder,
  lenght,
  type,
  pattern,
  required
}: IEditorItemProps) {
  const [value, setValue] = useState("");
  return (
    <StyledTextInput>
      <FieldName>{label}</FieldName>
      <Element>
        {lenght === "TextInput" ? (
          <Input
            type={type}
            placeholder={placeholder}
            pattern={pattern}
            onChanged={e => {
              setValue(e);
            }}
          />
        ) : (
          <div className="long-text">
            <TextArea
              onChange={e => {
                setValue(e);
              }}
              placeholder={placeholder}
            />
          </div>
        )}
      </Element>
    </StyledTextInput>
  );
}
