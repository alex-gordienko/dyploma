/* tslint:disable */
import { styled } from "../../../styles/styled";

export default styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  background: ${props => props.theme.colors.primaryBackground};
`;
