/* tslint:disable */
import React, { useState } from "react";
import Input from "../Input";
import TextArea from "../TextArea";
import StyledTextInput from "./EditorTextViewer.styled";
import { FieldName, Element } from "../EditorComponents.styled";

interface IEditorItemProps {
  label: string;
  lenght: "TextInput" | "TextArea";
  value: string;
}

export default function TextViewerItem({
  label,
  lenght,
  value
}: IEditorItemProps) {
  return (
    <StyledTextInput>
      <FieldName>{label}</FieldName>
      <Element>
        {lenght === "TextInput" ? (
          <p>{value}</p>
        ) : (
          <div className="long-text">
            <p>{value}</p>
          </div>
        )}
      </Element>
    </StyledTextInput>
  );
}
