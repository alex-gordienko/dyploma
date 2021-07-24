/* tslint:disable */
import React, { useState } from "react";
import Input from "../Input";
import TextArea from "../TextArea";
import StyledTextInput from "./EditorSwitch.styled";
import { FieldName, Element } from "../EditorComponents.styled";

interface IEditorSwitchProps {
  required?: boolean;
  label: string;
  values: string[];
  onSelect: (selected: string) => void;
}

export default function EditorSwitchItem({
  label,
  required,
  values,
  onSelect
}: IEditorSwitchProps) {
  const [selected, setSelected] = useState(0);
  return (
    <StyledTextInput>
      <FieldName>
        {label}
        {required ? "*" : ""}
      </FieldName>
      <Element>
        {values.map((value, indx) => {
          return (
            <div key={indx}>
              <input
                checked={indx === selected ? true : false}
                type="radio"
                id={value}
                onChange={() => {
                  if (indx !== selected) {
                    onSelect(value);
                    setSelected(indx);
                  }
                }}
              />
              <label htmlFor={value}>{value}</label>
            </div>
          );
        })}
      </Element>
    </StyledTextInput>
  );
}
