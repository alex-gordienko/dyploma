import { styled } from "../../../styles/styled";

export const FieldName = styled.div`
  color: ${props => props.theme.colors.primaryBody};
  margin: 10px auto 10px 0px;
  width: 100px;
  flex: none;
`;
export const Element = styled.div`
  min-width: 200px;
  width: inherit;
  max-width: 350px;
  min-height: 42px;
  margin-bottom: 5px;
`;

export const ErrorOnInput = styled.div`
  color: ${props => props.theme.colors.errorColor};
  -webkit-transition: all 0.3s ease;
  -moz-transition: all 0.3s ease;
  -o-transition: all 0.3s ease;
  transition: all 0.3s ease;
`;

export const LabelBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${props => props.theme.colors.secondaryBody};
  height: 8vh;
  min-height: 54px;
  width: inherit;
  padding-left: 50px;
  padding-right: 50px;
`;

export const SubHeader = styled.div`
  margin: 20px 40px 26px 50px;
  font-family: ${props => props.theme.fontFamily.bigTitle};
  font-size: ${props => props.theme.fontSize.title};
  color: ${props => props.theme.colors.primaryBody};
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 4px;
  text-decoration: none;
`;

export const ButtonBlock = styled.div`
  box-sizing: border-box;
  width: max-content;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .label-drop {
    cursor: pointer;
    margin: 5px 20px;
    width: fit-content;
    text-decoration: none;
    font-family: ${props => props.theme.fontFamily.body};
    font-size: ${props => props.theme.fontSize.body};
    font-weight: 600;
    background: ${props => props.theme.colors.button.color};
    outline: none;
    color: ${props => props.theme.colors.button.textColor};
    border-radius: 5px;
    padding: 5px 5px 5px 5px;
    :hover {
      -webkit-transition: all 0.3s ease;
      -moz-transition: all 0.3s ease;
      -o-transition: all 0.3s ease;
      transition: all 0.3s ease;
      background: ${props => props.theme.colors.button.hoverColor};
      color: ${props => props.theme.colors.button.hoverTextColor};
    }
  }

  .label-button {
    cursor: pointer;
    margin: 5px 10px;
    width: fit-content;
    text-decoration: none;
    font-family: ${props => props.theme.fontFamily.body};
    font-size: ${props => props.theme.fontSize.body};
    font-weight: 600;
    background: ${props => props.theme.colors.button.color};
    outline: none;
    color: ${props => props.theme.colors.button.textColor};
    border: none;
    border-radius: 5px;
    padding: 6px 22px 6px 22px;
    :disabled {
      background: ${props => props.theme.colors.button.disabledColor};
      color: ${props => props.theme.colors.button.textColor};
    }
    :hover {
      -webkit-transition: all 0.3s ease;
      -moz-transition: all 0.3s ease;
      -o-transition: all 0.3s ease;
      transition: all 0.3s ease;
      background: ${props => props.theme.colors.button.hoverColor};
      color: ${props => props.theme.colors.button.hoverTextColor};
    }
    :disabled:hover {
      background: ${props => props.theme.colors.button.hoverDisabledColor};
      color: ${props => props.theme.colors.button.hoverTextColor};
    }
  }
`;

export const Delimeter = styled.hr<{ type: "vertical" | "horizontal" }>`
  border: none;
  color: ${(props: any) => props.theme.colors.secondaryBody};
  background-color: ${(props: any) => props.theme.colors.secondaryBody};
  ${props =>
    props.type === "horizontal"
      ? " width: 100%; height: 1px; margin: 1px 15px 1px 15px;"
      : "width: 1px; height: 100%; margin: 15px 1px 15px 1px;"}
`;
