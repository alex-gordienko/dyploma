/* tslint:disable */
import {
  IManipulateChipsAction,
  IInputTextAction,
  ISetVisibleAction,
  IResetAction
} from "./SkillsList.types";

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

const reset = (inputData: string[]): IResetAction => ({
  inputData,
  type: "RESET"
});

export { inputText, addChips, deleteChips, setVisible, reset };
