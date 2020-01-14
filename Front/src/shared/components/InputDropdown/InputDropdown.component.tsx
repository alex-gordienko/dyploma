/* tslint:disable */
import React, { useState, useCallback, useRef, useEffect } from "react";
import OptionsDropdown from "../OptionsDropdown";
import Input from "./InputDropdown.styled";

interface IDropdownProps {
  inputData: string[];
}

const Dropdown = ({ inputData }: IDropdownProps) => {
  const [text, setText] = useState("");
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(inputData);
  const [selectedValue, setSelectedValue] = useState("");
  const onFocus = useCallback(() => {
    setVisible(true);
  }, []);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const onChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setVisible(true);
    const value = e.currentTarget.value;
    setText(value);
    if (value) {
      setData(inputData.filter(item => item.includes(value)));
    } else {
      setData(inputData);
    }
  }, []);
  const handleSelect = (item: string) => {
    setText(item);
    setSelectedValue(item);
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
    <div>
      <div
        ref={wrapperRef}
        style={{ position: "relative", width: "218px", margin: "auto" }}
      >
        <Input
          data-testid="input"
          type="text"
          value={text}
          onFocus={onFocus}
          onChange={onChange}
        />
        <OptionsDropdown
          visible={visible}
          data={data}
          onSelect={handleSelect}
        />
      </div>
      <b>Selected value: {selectedValue}</b>
    </div>
  );
};

export default Dropdown;
