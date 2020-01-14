/* tslint:disable */
import React, { useState } from "react";
import StyledInput from "./Input.styled";

interface IInputProps {
  prependComponent?: React.ReactNode;
  type?: string;
  placeholder?: string;
  onChanged: (text: string) => void;
  pattern?: string;
}

export default function Input({
  prependComponent,
  type,
  placeholder,
  onChanged,
  pattern
}: IInputProps) {
  const [value, setValue] = useState("");
  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
    onChanged(value);
  };
  return (
    <StyledInput>
      {prependComponent}
      <input
        value={value}
        pattern={pattern}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
      />
    </StyledInput>
  );
}
