/* tslint:disable */
import { styled } from "../../../../styles/styled";
import variables from "../../../../styles/variables";

export default styled.div`
  font-family: ${props => props.theme.fontFamily.body};
  font-size: ${props => props.theme.fontSize.body};
  color: ${props => props.theme.colors.primaryBody};
  justify-content: space-between;
  align-items: center;
  display: inline-flex;
  width: 100%;

  p {
    background-color: transparent;
    padding-left: 5px;
    border: none;
    border-left: 1px solid transparent;
    outline: none;
    width: 100%;
    height: 20px;
    border-bottom: 1px solid
      ${(props: any) => props.theme.colors.input.borderHover};
  }

  .long-text {
    height: ${variables.textArea.height};
  }
`;
