/* tslint:disable */
import {
  IManipulateChipsAction,
  IInputTextAction,
  ISetVisibleAction,
  IResetAction
} from "./ChipsDropdown.types";

interface IChipsDropdownState {
  chipsList: string[];
  filteredData: JSX.Element[];
  inputData: JSX.Element[];
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

const arrayDiff = (originalArray: JSX.Element[], secondArray: string[]) => {
  return originalArray.filter(
    (element: JSX.Element) => !secondArray.includes(element.key!==null? element.key.toString(): '0')
  );
};

const reducer = (state: IChipsDropdownState, action: IChipsDropDownActions) => {
  switch (action.type) {
    case "ADD_CHIPS": {
      const isFound = state.inputData.find(
        (item: JSX.Element) => item.key === action.element
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
            ? state.filteredData.filter((item: JSX.Element) =>
                item.key && typeof item.key ==="string"?
                  item.key.toLowerCase().includes(action.text.toLowerCase())
                :null
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
        ...state,
        filteredData: action.inputData,
        inputData: action.inputData,
        chipsList: action.alreadySelectedChips
      };
    }
    default: {
      return state;
    }
  }
};

export { initialState, reducer };
