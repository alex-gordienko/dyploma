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
import OptionsDropdown from "../OptionsDropdown";
import { Input, Container } from "./ChipsDropdown.styled";
import ChipsList from "../ChipsList";
import { ITheme } from "../../../styles/variables";
import { ThemeProvider } from "emotion-theming";
import lighten from "../../../styles/themes/lighten";

interface IDropdownProps {
  inputData: string[];
  theme?: ITheme;
}

const InputDropdownChips = ({ inputData, theme }: IDropdownProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [{ text, chipsList, filteredData, visible }, dispatch] = useReducer(
    reducer,
    initialState
  );
  useEffect(() => dispatch(reset(inputData)), [inputData]);

  const onFocus = useCallback(() => {
    dispatch(setVisible(true));
  }, []);
  const inputTextChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      dispatch(inputText(e.currentTarget.value));
    },
    []
  );
  // If user clicked on element
  const handleOptionSelect = useCallback((item: string) => {
    dispatch(addChips(item));
  }, []);
  // If user want to delete element from ChipsList
  const deleteChip = useCallback((item: string) => {
    dispatch(deleteChips(item));
  }, []);

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
    <ThemeProvider theme={theme!}>
      <Container ref={wrapperRef}>
        <Input
          data-testid="input"
          type="text"
          value={text}
          onFocus={onFocus}
          onChange={inputTextChange}
        />
        <OptionsDropdown
          visible={visible}
          data={filteredData}
          onSelect={handleOptionSelect}
        />
        <ChipsList
          deletable={true}
          chipsList={chipsList}
          onDelete={deleteChip}
        />
      </Container>
    </ThemeProvider>
  );
};

InputDropdownChips.defaultProps = {
  theme: lighten
};

export default InputDropdownChips;
