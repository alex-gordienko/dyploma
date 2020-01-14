/* tslint:disable */
import { styled } from "../../../../styles/styled";

export const LabelBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.colors.primaryBody};
  height: 8vh;
  width: 100%;
  padding-left: 50px;
  padding-right: 50px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .label-name {
    font-family: ${props => props.theme.fontFamily.bigTitle};
    font-size: ${props => props.theme.fontSize.title};
    color: ${props => props.theme.colors.primaryBackground};
    letter-spacing: 4px;
    margin-right: auto;
  }
`;
