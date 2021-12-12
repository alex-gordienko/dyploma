import { styled } from "../../../styles/styled";

export const ModalFullScreenContainer = styled.div`
  position: absolute;
  width: 100vw;
  height: calc(100% - 8vh);
  z-index: 5000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledModal = styled.div<{
  type: "warning" | "accept" | "editing";
}>`
  position: fixed;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  box-shadow: 0px 10px 30px 0 rgba(127, 127, 127, 0.3);
  border: 1px solid ${props => props.theme.colors.secondaryBody};
  border-radius: 10px;
  background: ${props => props.theme.colors.primaryBackground};
  opacity: 0.8;
  z-index: 5001;
`;
