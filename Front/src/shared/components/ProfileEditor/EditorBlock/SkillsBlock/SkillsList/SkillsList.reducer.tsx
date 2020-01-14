/* tslint:disable */
import {
  IManipulateChipsAction,
  IInputTextAction,
  ISetVisibleAction,
  IResetAction
} from "./SkillsList.types";

interface IChipsDropdownState {
  chipsList: string[];
  filteredData: string[];
  inputData: string[];
  text: string;
  visible: boolean;
}

type IChipsDropDownActions =
  | IManipulateChipsAction
  | IInputTextAction
  | ISetVisibleAction
  | IResetAction;

const initialState = {
  chipsList: [],
  filteredData: [],
  inputData: [],
  text: "",
  visible: false
};

const arrayDiff = (originalArray: string[], secondArray: string[]) => {
  return originalArray.filter(
    (element: string) => !secondArray.includes(element)
  );
};

const reducer = (state: IChipsDropdownState, action: IChipsDropDownActions) => {
  switch (action.type) {
    case "ADD_CHIPS": {
      const isFound = state.inputData.find(
        (item: string) => item === action.element
      );

      const chipsListWithNewElement = [...state.chipsList, action.element];
      return {
        ...state,
        chipsList: isFound ? chipsListWithNewElement : state.chipsList,
        filteredData: isFound
          ? arrayDiff(state.inputData, chipsListWithNewElement)
          : state.filteredData,
        text: "",
        visible: false
      };
    }
    case "DELETE_CHIPS": {
      const chipsListWithoutElement = state.chipsList.filter(
        (elem: string) => elem !== action.element
      );
      return {
        ...state,
        chipsList: chipsListWithoutElement,
        filteredData: arrayDiff(state.inputData, chipsListWithoutElement),
        text: "",
        visible: false
      };
    }
    case "INPUT_TEXT": {
      return {
        ...state,
        filteredData:
          action.text.length > 0
            ? state.filteredData.filter((item: string) =>
                item.toLowerCase().includes(action.text.toLowerCase())
              )
            : arrayDiff(state.inputData, state.chipsList),
        text: action.text,
        visible: true
      };
    }
    case "SET_VISIBLE": {
      return {
        ...state,
        visible: action.visible
      };
    }
    case "RESET": {
      return {
        chipsList: [],
        filteredData: action.inputData,
        inputData: action.inputData,
        text: "",
        visible: false
      };
    }
    default: {
      return state;
    }
  }
};

export { initialState, reducer };
