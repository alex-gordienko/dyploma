/* tslint:disable */
import { styled } from "../../../../styles/styled";
import variables from "../../../../styles/variables";

export default styled.div`
  font-family: ${props => props.theme.fontFamily.body};
  font-size: ${props => props.theme.fontSize.body};
  justify-content: space-between;
  align-items: center;
  margin-left: 40px;
  display: inline-flex;
`;
