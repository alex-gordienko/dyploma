/* tslint:disable */
export interface IManipulateChipsAction {
  type: "ADD_CHIPS" | "DELETE_CHIPS";
  element: string;
}
export interface IInputTextAction {
  text: string;
  type: "INPUT_TEXT";
}
export interface ISetVisibleAction {
  visible: boolean;
  type: "SET_VISIBLE";
}
export interface IResetAction {
  inputData: JSX.Element[];
  alreadySelectedChips: string[];
  type: "RESET";
}
