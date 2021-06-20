/* tslint:disable */
import React, { useState, useCallback, useRef, useEffect } from "react";
import OptionsDropdown from "../OptionsDropdown";
import Input from "../../Input";
import StyledEditorAutocomplete from "./EditorAutoComplete.styled";
import { FieldName, Element } from "../EditorComponents.styled";

interface IDropdownProps {
  label: string;
  required?: boolean;
  initValue?: string;
  inputData: JSX.Element[];
  outputData: (result: string) => void;
}

const Dropdown = ({
  label,
  initValue,
  required,
  inputData,
  outputData
}: IDropdownProps) => {
  const [text, setText] = useState(initValue ? initValue : "");
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(inputData);
  const onFocus = useCallback(() => {
    setVisible(true);
  }, []);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const onChange = useCallback((e: string) => {
    setVisible(true);
    const value = e;
    setText(value);
    if (value) {
      setData(
        inputData.filter(item =>
          item.key !== null
            ? item.key
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase())
            : "0"
        )
      );
    } else {
      setData(inputData);
    }
  }, []);
  const handleSelect = (item: string) => {
    setText(item);
    outputData(item);
    setVisible(false);
  };
  useEffect(() => {
    if (visible) {
      const handleBodyClick = (e: MouseEvent) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(e.target as HTMLElement)
        ) {
          setVisible(false);
        }
      };
      document.body.addEventListener("click", handleBodyClick);
      return () => {
        document.body.removeEventListener("click", handleBodyClick);
      };
    }
  }, [visible]);
  return (
    <StyledEditorAutocomplete>
      <FieldName>
        {label}
        {required ? "*" : ""}
      </FieldName>
      <Element ref={wrapperRef}>
        <Input
          required={required}
          data-testid="input"
          type="text"
          initValue={text}
          onFocus={onFocus}
          onChanged={onChange}
        />
        <OptionsDropdown
          visible={visible}
          data={data}
          onSelect={handleSelect}
        />
      </Element>
    </StyledEditorAutocomplete>
  );
};

export default Dropdown;
