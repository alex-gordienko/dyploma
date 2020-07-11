/* tslint:disable */
import React, { useCallback, useRef, useEffect, useReducer } from "react";
import { initialState, reducer } from "./ChipsDropdown.reducer";
import {
  inputText,
  addChips,
  deleteChips,
  setVisible,
  reset
} from "./ChipsDropdown.actions";
import OptionsDropdown from "../EditorComponents/OptionsDropdown";
import { Container } from "./ChipsDropdown.styled";
import Input from '../Input';
import ChipsList from "../ChipsList";
import { Element, FieldName } from '../EditorComponents/EditorComponents.styled'

interface IVariablesRestriction{
  type: "only one element";
};

type IRestrict = IVariablesRestriction;

interface IDropdownProps<IRestrict> {
  label: string;
  required?: boolean;
  restriction?: IRestrict;
  inputData: JSX.Element[];
  alreadySelected?: string[];
  onInputChange?: (username: string)=>void;
  onChoise: (outputData: string[])=>void;
}

const InputDropdownChips = ({ label, required, alreadySelected, inputData, onChoise, onInputChange, restriction }: IDropdownProps<IRestrict>) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [{ text, chipsList, filteredData, visible }, dispatch] = useReducer(
    reducer,
    initialState
  );

  let nullChipsList = alreadySelected? alreadySelected: [];

  useEffect(() => dispatch(reset(inputData, nullChipsList)), [inputData.length]);

  useEffect(()=>{
    if(restriction?.type==='only one element'){
      if(chipsList.length>1){
        dispatch(deleteChips(chipsList[chipsList.length-1]));
      }
    }
  },[chipsList, restriction])

  const onFocus = () => {
    dispatch(setVisible(true));
  };

  const inputTextChange = (e: string) => {
      dispatch(inputText(e));
      if(onInputChange) onInputChange(e);
    };
  
  // If user clicked on element
  const handleOptionSelect = (item: string) => {
    console.log(item)
    if(restriction?.type==='only one element'){
      if(chipsList.length<1){
        dispatch(addChips(item));
        onChoise(chipsList.concat(item));
      }
    }
    else{
      dispatch(addChips(item));
      onChoise(chipsList.concat(item));
    }
  };

  // If user want to delete element from ChipsList
  const deleteChip = (item: string) => {
    dispatch(deleteChips(item));
    onChoise(chipsList.filter(elem=> elem !== item));
  };

  useEffect(() => {
    if (visible) {
      const handleBodyClick = (e: MouseEvent) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(e.target as HTMLElement)
        ) {
          dispatch(setVisible(false));
        }
      };
      document.body.addEventListener("click", handleBodyClick);
      return () => {
        document.body.removeEventListener("click", handleBodyClick);
      };
    }
  }, [visible]);
  return (
      <Container ref={wrapperRef}>
        <FieldName>
          {label}
        </FieldName>
        <Element>
          <Input
            data-testid="input"
            type="text"
            onFocus={onFocus}
            onChanged={inputTextChange}
            restriction={restriction}
          />
          <OptionsDropdown
            visible={restriction?.type==='only one element'? chipsList.length>=1? false : visible : visible}
            data={filteredData}
            onSelect={handleOptionSelect}
          />
          <ChipsList
            deletable={true}
            chipsList={chipsList}
            onDelete={deleteChip}
          />
        </Element>
      </Container>
  );
};

export default InputDropdownChips;
