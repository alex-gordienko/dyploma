/* tslint:disable */
import React, { useState, useEffect } from "react";
import StyledInput from "./Input.styled";
import { ErrorOnInput } from "../EditorComponents/EditorComponents.styled";

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

interface IEditorVariablesRestriction{
  type: "only one element";
};

export type IRestrict = IEditorLengthRestriction|IEditorDataTypeRestriction|IEditorSameRestriction|IEditorVariablesRestriction;

interface IInputProps {
  disabled?: boolean;
  key?: number;
  prependComponent?: React.ReactNode;
  postpendComponent?: JSX.Element;
  required?: boolean;
  min?:string;
  max?: string;
  type?: string;
  placeholder?: string;
  initValue?:string|number;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>)=> void;
  onChanged: (text: string) => void;
  onKeyDown?: (key: React.KeyboardEvent<HTMLInputElement>)=> void;
  pattern?: string;
  restriction?: IRestrict;
}

export default function Input({
  disabled,
  key,
  prependComponent,
  postpendComponent,
  required,
  type,
  min,
  max,
  placeholder,
  onFocus,
  onChanged,
  onKeyDown,
  pattern,
  initValue,
  restriction
}: IInputProps) {
  const [text, setValue] = useState(initValue);
  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
  if(type==="tel"){
      let number = e.currentTarget.value.replace(RegExp("([A-Za-zА-Яа-яЁё-]+)"),"");
      setValue(number);
      onChanged(number);
  }
  else{
      setValue(e.currentTarget.value);
      onChanged(e.currentTarget.value);
  }
  };
  useEffect(()=>{
    setValue(initValue);
  },[initValue])
  return (
    <StyledInput>
      {prependComponent}
      <div className="field">
        <input
          key={key}
          onKeyPress={onKeyDown}
          disabled={disabled}
          required={required}
          min={min}
          max={max}
          value={text}
          pattern={pattern}
          onFocus={onFocus}
          onChange={onChange}
          placeholder={placeholder}
          type={type}
        />
        {restriction? 
            <ErrorOnInput>
              {text && restriction.type==="min length" && text.toString().length<restriction.length? 
                "Must be more than "+restriction.length+" characters":null}
              {restriction.type==="type" && typeof text !==restriction.restrict?
                  "Input data must be "+restriction.restrict: null}
              {text && restriction.type==="same" &&text!==restriction.with?
                  "Fields must be same":null}
              {restriction.type==='only one element'? 
                  "Available only one select": null}
            </ErrorOnInput>
          : null}
      </div>
      {postpendComponent}
    </StyledInput>
  );
}
