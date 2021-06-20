/* tslint:disable */

const variables = {
  fontFamily: {
    bigTitle: "SF UI Display", // TODO:import other web font instead of SF
    body: "'lucida sans console', serif",
    title: "Open Sans"
  },
  fontSize: {
    body: "15px", // TODO: check all files and change names in styled components
    header: "20px",
    small: "10px",
    title: "20px"
  },
  textArea: {
    height: "108px"
  }
};

interface IColorPalette {
  button: {
    color: string;
    disabledColor: string;
    textColor: string;
    hoverColor: string;
    hoverDisabledColor: string;
    hoverTextColor: string;
  };
  chips: {
    background: string;
    text: string;
  };
  dropdown: {
    background: string;
  };
  header: {
    background: string;
    primaryText: string;
    primaryTextActive: string;
    primaryTextHover: string;
    secondaryText: string;
  };
  input: {
    background: string;
    backgroundHover: string;
    text: string;
    textHover: string;
    border: string;
    borderHover: string;
  };
  primaryBackground: string;
  primaryBody: string;
  secondarySelection: string;
  secondaryBody: string;
  secondaryHover: string;
  errorColor: string;
}

interface IFonts {
  bigTitle: string;
  title: string;
  body: string;
}

interface IFontSizes {
  title: string;
  body: string;
  small: string;
}

export interface ITheme {
  colors: IColorPalette;
  fontFamily: IFonts;
  fontSize: IFontSizes;
}

export default variables;
