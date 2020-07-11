/* tslint:disable */
import { styled } from "../../../../styles/styled";

export const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-right: auto;

  .label-name {
    font-family: ${props => props.theme.fontFamily.bigTitle};
    font-size: ${props => props.theme.fontSize.title};
    color: ${props => props.theme.colors.primaryBackground};
    letter-spacing: 4px;
  }
`;
