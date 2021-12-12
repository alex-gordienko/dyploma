/* tslint:disable */
import { styled } from "../../../../styles/styled";

export default styled.div`
  ::-webkit-scrollbar {
    width: 0px;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  position: absolute;
  max-height: 120px;
  width: inherit;
  box-shadow: 0 2px 2px 0 rgba(208, 208, 208, 0.5);
  background-color: ${(props: any) => props.theme.colors.dropdown.background};
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 50;
  border: 1px solid ${(props: any) => props.theme.colors.input.borderHover};
  border-radius: 0 0 10px 10px;
`;
