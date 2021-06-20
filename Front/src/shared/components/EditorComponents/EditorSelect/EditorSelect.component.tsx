/* tslint:disable */
import React from "react";
import Select from "../../Select";
import SelectEditorItem from "./EditorSelect.styled";
import { FieldName, Element } from "../EditorComponents.styled";

interface IEditorItemProps {
  label: string;
  defaultValue: string;
  values: string[];
}

export default function SelectItem({
  label,
  defaultValue,
  values
}: IEditorItemProps) {
  return (
    <SelectEditorItem>
      <FieldName>{label}</FieldName>
      <Element>
        <Select items={values} />
      </Element>
    </SelectEditorItem>
  );
}
