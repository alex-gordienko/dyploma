/* tslint:disable */
import { styled } from "../../../../styles/styled";

export const TabElement = styled.div`
  background: ${props => props.theme.colors.button.color};
  height: inherit;
  display: table;
  > input {
    display: none;
  }
  > label {
    width: 20vh;
    height: 100%;
    text-align: center;
    display: table-cell;
    vertical-align: middle;
    cursor: pointer;
  }
  > label:hover {
    background: ${props => props.theme.colors.button.hoverColor};
    -webkit-transition: all 0.3s ease;
    -moz-transition: all 0.3s ease;
    -o-transition: all 0.3s ease;
    transition: all 0.3s ease;
  }
  > input:checked + label {
    background: ${props => props.theme.colors.button.hoverColor};
  }
`;
