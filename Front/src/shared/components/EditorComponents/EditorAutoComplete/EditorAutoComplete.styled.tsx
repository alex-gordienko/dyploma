/* tslint:disable */
import { styled } from "../../../../styles/styled";

export default styled.div`
  font-family: ${props => props.theme.fontFamily.body};
  font-size: ${props => props.theme.fontSize.body};
  color: ${props => props.theme.colors.primaryBackground};
  justify-content: space-between;
  align-items: center;
  margin-left: 40px;
  display: inline-flex;
`;
