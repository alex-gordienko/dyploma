/* tslint:disable */
import { styled } from "../../../../../styles/styled";

export default styled.div`
  font-family: ${props => props.theme.fontFamily.body};
  font-size: ${props => props.theme.fontSize.body};
  color: ${props => props.theme.colors.primaryBackground};
  justify-content: space-between;
  align-items: center;
  display: flex;
  margin-bottom: 29px;

  .label {
    color: ${props => props.theme.colors.primaryBody};
    margin: 10px 50px 10px 0px;
    max-width: 100px;
    flex: none;
  }
  .element {
    width: 100%;
  }
`;
