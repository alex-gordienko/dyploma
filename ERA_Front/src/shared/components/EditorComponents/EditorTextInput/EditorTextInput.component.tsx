/* tslint:disable */
import React, { useState } from "react";
import Input from "../../Input";
import TextArea from "../../TextArea";
import StyledTextInput from "./EditorTextInput.styled";
import {FieldName, Element} from "../EditorComponents.styled";

interface IEditorLengthRestriction{
  type: "min length";
  length: number;
};

interface IEditorDataTypeRestriction{
  type: "type";
  restrict: "string"|"number";
}

interface IEditorSameRestriction{
  type: "same";
  with: string|number;
}

type IRestrict = IEditorLengthRestriction|IEditorDataTypeRestriction|IEditorSameRestriction;

interface IEditorItemProps<IRestrict> {
  disabled?: boolean;
  key?:number;
  label: string;
  placeholder: string;
  lenght: "TextInput" | "TextArea";
  type?: string;
  pattern?: string;
  required?: boolean;
  onChange: (text: string)=> void;
  onKeyDown?: (key: React.KeyboardEvent<HTMLInputElement>) => void;
  value?: string | number;
  restriction?: IRestrict;
}

export default function InputEditorItem({
  disabled,
  key,
  label,
  placeholder,
  lenght,
  type,
  pattern,
  required,
  onChange,
  onKeyDown,
  value,
  restriction
}: IEditorItemProps<IRestrict>) {
  return (
    <StyledTextInput key={key}>
      <FieldName>{label}{required? "*": ""}</FieldName>
      <Element>
        {lenght === "TextInput" ? (
          <Input
            key={key}
            disabled={disabled}
            required={required}
            type={type}
            placeholder={placeholder}
            pattern={pattern}
            onChanged={onChange}
            onKeyDown={onKeyDown}
            initValue={value}
            restriction={restriction}
          />
        ) : (
          <div className="long-text">
            <TextArea
              key={key}
              initValue={value}
              onChange={onChange}
              placeholder={placeholder}
            />
          </div>
        )}
      </Element>
    </StyledTextInput>
  );
}
