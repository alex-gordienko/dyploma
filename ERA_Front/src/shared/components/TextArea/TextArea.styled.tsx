/* tslint:disable */
import { styled } from "../../../styles/styled";
import variables from "../../../styles/variables";

export const StyledTextArea = styled.div`
  margin: 5px;
  width: 100%;
  display: inline-flex;
`;

export const LongText = styled.textarea`
  height: ${variables.textArea.height};
  padding: 0 20px 0 17px;  
  display: flex;
  font-family: ${props => props.theme.fontFamily.body};
  font-size: ${props => props.theme.fontSize.body};
  color: ${props => props.theme.colors.primaryBody};
  background: transparent;
  width: inherit;
  resize: none;
  overflow-y: auto;
  border: none;
  border-left: 1px solid ${(props:any)=>props.theme.colors.input.background};
  border-bottom: 1px solid ${(props:any)=>props.theme.colors.input.border};
  outline: none;
  :focus{
    -webkit-transition: all 1s ease;
    -moz-transition: all 1s ease;
    -o-transition: all 1s ease;
    transition: all 1s ease;
    border-left: 1px solid ${(props:any)=>props.theme.colors.input.borderHover};
    border-bottom: 1px solid ${(props:any)=>props.theme.colors.input.borderHover};
    border-radius: 5px;
  }
`;
