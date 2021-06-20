import { styled } from "../../../styles/styled";

export const StyledModal = styled.div<{
  type: "warning" | "accept" | "editing";
}>`
  position: fixed;
  top: ${props =>
    props.type === "warning"
      ? "35%"
      : props.type === "editing"
      ? "10%"
      : "10%"};
  right: ${props =>
    props.type === "warning"
      ? "35%"
      : props.type === "editing"
      ? "10%"
      : "10%"};
  bottom: ${props =>
    props.type === "warning"
      ? "35%"
      : props.type === "editing"
      ? "10%"
      : "10%"};
  left: ${props =>
    props.type === "warning"
      ? "35%"
      : props.type === "editing"
      ? "10%"
      : "10%"};
  padding: 10px;
  box-shadow: 0px 10px 30px 0 rgba(127, 127, 127, 0.3);
  border: 1px solid ${props => props.theme.colors.secondaryBody};
  background: ${props => props.theme.colors.primaryBackground};
  opacity: 0.8;
`;
