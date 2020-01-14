/* tslint:disable */
import React from "react";
import StyledDate, { Input } from "./EditorDate.styled";
import { FieldName, Element } from "../../CreatePost.styled";

interface IDateEditorProps {
  maxDate?: string;
  minDate?: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}

export default function DateEditor({
  maxDate,
  minDate,
  label,
  placeholder,
  required
}: IDateEditorProps) {
  return (
    <StyledDate>
      <FieldName>{label}</FieldName>
      <Element>
        <Input
          type="date"
          required={required}
          placeholder={placeholder}
          min={minDate}
          max={maxDate}
        />
        )
      </Element>
    </StyledDate>
  );
}
