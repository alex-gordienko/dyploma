/* tslint:disable */
import { styled } from "../../../../../styles/styled";

export const Input = styled.input`
  font-family: ${props => props.theme.fontFamily.body};
  font-size: ${props => props.theme.fontSize.body};
  display: flex;
  padding: 0 20px 0 0;
  background-color: transparent;
  border-radius: 20px;
  border: 1px solid #cfcfcf;
  padding-left: 17px;
  width: 100%;
  height: 100%;
`;

export default styled.div`
  font-family: ${props => props.theme.fontFamily.body};
  font-size: ${props => props.theme.fontSize.body};
  color: ${props => props.theme.colors.primaryBackground};
  width: 413px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 29px;
  margin-left: 50px;
`;
