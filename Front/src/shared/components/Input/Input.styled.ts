/* tslint:disable */
import { styled } from "../../../styles/styled";

export default styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  .field {
    margin-right: 5px;
    input {
      background-color: transparent;
      font-family: ${props => props.theme.fontFamily.body};
      font-size: ${props => props.theme.fontSize.body};
      padding-left: 5px;
      border: none;
      border-left: 1px solid transparent;
      border-bottom: 1px solid
        ${(props: any) => props.theme.colors.input.border};
      outline: none;
      width: 100%;
      height: 35px;
      :focus {
        -webkit-transition: all 1s ease;
        -moz-transition: all 1s ease;
        -o-transition: all 1s ease;
        transition: all 1s ease;
        border-left: 1px solid
          ${(props: any) => props.theme.colors.input.borderHover};
        border-bottom: 1px solid
          ${(props: any) => props.theme.colors.input.borderHover};
        border-radius: 5px;
      }
    }
  }
`;
