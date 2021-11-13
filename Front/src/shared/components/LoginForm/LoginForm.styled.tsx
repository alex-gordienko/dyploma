/* tslint:disable */
import { styled } from "../../../styles/styled";

export default styled.div`
  width: 30%;
  min-width: 300px;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  border-radius: 10px;
  padding: 20px 10px;
  box-shadow: 0px 4px 29px 19px rgba(34, 60, 80, 0.2);
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-evenly;
  margin-bottom: 10px;

  p {
    font-size: ${props => props.theme.fontSize.title};
    font-family: ${props => props.theme.fontFamily.bigTitle};
    margin: 0;
  }
`;
