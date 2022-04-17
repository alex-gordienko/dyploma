/* tslint:disable */
import variables from "../variables";

const lighten = {
  ...variables,
  colors: {
    button: {
      color: "darkgray",
      disabledColor: "rgba(192,192,192,0.3)",
      textColor: "black",
      hoverColor: "#E5000B",
      hoverDisabledColor: "rgba(192,192,192,0.3)",
      hoverTextColor: "#141414"
    },
    chips: {
      background: "#1B0505",
      text: "#FFFFFF"
    },
    dropdown: {
      background: "#F2F2F2"
    },
    header: {
      background: "#E5000B",
      primaryText: "#464444",
      primaryTextActive: "#141414",
      primaryTextHover: "#FF1B15",
      secondaryText: "#969795"
    },
    input: {
      background: "#FFFFFF",
      backgroundHover: "#F2F2F2",
      text: "",
      textHover: "",
      border: "#A82B11",
      borderHover: "#FF1B15"
    },
    primaryBackground: "#FFFFFF",
    primaryBody: "#1B0505",
    secondaryBody: "#626262",
    secondaryHover: "rgba(192, 192, 192, 0.2)",
    secondarySelection: "#FF0870",
    errorColor: "red"
  }
};

export default lighten;
