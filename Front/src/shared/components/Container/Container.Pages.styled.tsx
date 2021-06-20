/* tslint:disable */
import { styled } from "../../../styles/styled";

export default styled.div`
  min-width: 700px;
  overflow-y: hidden;
  width: 100%;
  height: 92vh;
  display: inline-flex;
  flex-flow: wrap;
  background: ${props => props.theme.colors.primaryBackground};
`;
