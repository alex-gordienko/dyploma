/* tslint:disable */
import { styled } from "../../../styles/styled";

export default styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SubHeader = styled.div`
  width: 100%;
  margin: 50px 0px 26px 0px;
  font-family: ${props => props.theme.fontFamily.bigTitle};
  font-size: ${props => props.theme.fontSize.title};
  color: ${props => props.theme.colors.primaryBody};
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: 4px;
`;
