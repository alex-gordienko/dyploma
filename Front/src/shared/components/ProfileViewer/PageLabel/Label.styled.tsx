/* tslint:disable */
import { styled } from "../../../../styles/styled";

export const Content = styled.div<{ Rating: number }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-right: auto;

  .label-name {
    font-family: ${props => props.theme.fontFamily.bigTitle};
    font-size: ${props => props.theme.fontSize.title};
    color: hsl(${props => props.Rating}, 100%, 50%);
    letter-spacing: 4px;
  }
`;

export const Status = styled.div`
  margin-right: 30px;
  font-family: ${props => props.theme.fontFamily.title};
  font-size: ${props => props.theme.fontSize.body};
  color: ${props => props.theme.colors.primaryBackground};
  font-style: oblique;
`;

export const ProfileEditButton = styled.div`
  width: min-content;
`;
