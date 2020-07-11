/* tslint:disable */
import { styled } from "../../../styles/styled";

export default styled.div`
  display: flex;

  select {
    background-color: transparent;
    font-family: ${props => props.theme.fontFamily.body};
    font-size: ${props => props.theme.fontSize.body};
    padding-left: 5px;
    border: none;
    border-bottom: 1px solid ${(props:any)=>props.theme.colors.input.border};
    outline: none;
    width: 100%;
    height: 35px;
    :focus{
      -webkit-transition: all 1s ease;
      -moz-transition: all 1s ease;
      -o-transition: all 1s ease;
      transition: all 1s ease;
      border-bottom: 1px solid ${(props:any)=>props.theme.colors.input.borderHover};
    }
    option{
      outline: none;
      :last-child{
        border-bottom: 1px solid ${(props:any)=>props.theme.colors.input.borderHover};
        color: red;
      }
    }
  }

`;
