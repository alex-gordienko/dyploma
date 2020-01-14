/* tslint:disable */
import { styled } from "../../../../styles/styled";

export const FilesSelector = styled.div`
  .label-button {
    font-family: ${props => props.theme.fontFamily.body};
    font-size: ${props => props.theme.fontSize.body};
    font-weight: 600;
    background-color: ${props => props.theme.colors.button.color};
    outline: none;
    color: ${props => props.theme.colors.button.textColor};
    border: 1px solid ${props => props.theme.colors.primaryBackground};
    margin-right: 25px;
    display: inline-block;
    border-radius: 40px;
    padding: 10px 44px 10px 43px;
    cursor: pointer;
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

export const StyledEditor = styled.div`
  display: inline-flex;
  margin: 0px 50px 50px 50px;
  flex-flow: row;
`;

export const EditorForm = styled.form`
  display: inline-flex;
  flex-flow: wrap;
  font-family: ${props => props.theme.fontFamily.body};
  font-size: ${props => props.theme.fontSize.body};
  color: ${props => props.theme.colors.primaryBackground};
  width: 413px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 29px;
  margin-left: 50px;
`;

export const PhotoBlock = styled.div`
  align-items: center;
  justify-content: center;
  width: 60%;
  height: auto;
`;

export const Photoes = styled.div`
  max-width: 100vh;
  margin-bottom: 40px;
`;
