/* tslint:disable */
import { styled } from "../../../styles/styled";

export default styled.div`
  width: 100%;
  height: 100%;
  display: inline-flex;
  flex-flow: wrap;
  min-width: 650px;
  margin: 0px auto;
  overflow-y: hidden;
  background: ${props=> props.theme.colors.primaryBackground};
`;
