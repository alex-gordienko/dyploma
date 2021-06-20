/* tslint:disable */
import {
  IManipulateChipsAction,
  IInputTextAction,
  ISetVisibleAction,
  IResetAction
} from "./ChipsDropdown.types";

const inputText = (text: string): IInputTextAction => ({
  text,
  type: "INPUT_TEXT"
});

const addChips = (element: string): IManipulateChipsAction => ({
  element,
  type: "ADD_CHIPS"
});

const deleteChips = (element: string): IManipulateChipsAction => ({
  element,
  type: "DELETE_CHIPS"
});

const setVisible = (visible: boolean): ISetVisibleAction => ({
  type: "SET_VISIBLE",
  visible
});

const reset = (
  inputData: JSX.Element[],
  alreadySelectedChips: string[]
): IResetAction => ({
  alreadySelectedChips,
  inputData,
  type: "RESET"
});

export { inputText, addChips, deleteChips, setVisible, reset };
