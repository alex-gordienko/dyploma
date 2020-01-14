/* tslint:disable */
import { styled } from "../../../../styles/styled";

export const LabelBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.colors.primaryBody};
  height: 67px;
  width: 100%;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .label-name {
    font-family: ${props => props.theme.fontFamily.bigTitle};
    font-size: ${props => props.theme.fontSize.title};
    color: ${props => props.theme.colors.primaryBackground};
    letter-spacing: 4px;
    margin-right: auto;
  }

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
