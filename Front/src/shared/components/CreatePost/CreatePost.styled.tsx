/* tslint:disable */
import { styled } from "../../../styles/styled";

export const SubHeader = styled.div`
  margin: 50px 40px 26px 50px;
  font-family: ${props => props.theme.fontFamily.bigTitle};
  font-size: ${props => props.theme.fontSize.title};
  color: ${props => props.theme.colors.primaryBody};
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 4px;
`;

export const StyledEditorBlock = styled.div`
  overflow-y: scroll;
  width: inherit;
  height: 84vh;
`;

export const FieldName = styled.div`
  color: ${props => props.theme.colors.primaryBody};
  margin: 10px auto 10px 0px;
  max-width: 100px;
  flex: none;
`;
export const Element = styled.div`
  width: 100%;
  height: 42px;
  min-height: 42px;
`;

export const PositionSelector = styled.div`
  height: 84vh;
  margin: 0px 50px 0px 50px;
`;

export const ButtonBlock = styled.div`
  .label-button {
    font-family: ${props => props.theme.fontFamily.body};
    font-size: ${props => props.theme.fontSize.body};
    font-weight: 600;
    background-color: ${props => props.theme.colors.button.color};
    outline: none;
    color: ${props => props.theme.colors.button.textColor};
    border: 1px solid ${props => props.theme.colors.primaryBackground};
    margin-left: 25px;
    border-radius: 40px;
    padding: 10px 44px 10px 43px;
    :hover {
      -webkit-transition: all 0.3s ease;
      -moz-transition: all 0.3s ease;
      -o-transition: all 0.3s ease;
      transition: all 0.3s ease;
      background-color: ${props => props.theme.colors.button.hoverColor};
      color: ${props => props.theme.colors.button.hoverTextColor};
    }
  }
`;
