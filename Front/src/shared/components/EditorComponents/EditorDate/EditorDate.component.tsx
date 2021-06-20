/* tslint:disable */
import React from "react";
import StyledDate from "./EditorDate.styled";
import Input from "../../Input";
import { FieldName, Element, ErrorOnInput } from "../EditorComponents.styled";

interface IDateEditorProps {
  disabled?: boolean;
  maxDate?: string;
  minDate?: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  value: string;
  onChange: (date: string) => void;
  onInputError?: string;
}

export default function DateEditor({
  disabled,
  maxDate,
  minDate,
  label,
  placeholder,
  required,
  value,
  onChange,
  onInputError
}: IDateEditorProps) {
  return (
    <StyledDate>
      <FieldName>{label}</FieldName>
      <Element>
        <Input
          disabled={disabled}
          type="date"
          required={required}
          placeholder={placeholder}
          min={minDate}
          max={maxDate}
          initValue={value}
          onChanged={onChange}
        />
        {required && onInputError ? (
          <ErrorOnInput>{onInputError}</ErrorOnInput>
        ) : null}
      </Element>
    </StyledDate>
  );
}
