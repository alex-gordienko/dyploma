/* tslint:disable */
import { styled } from "../../../../styles/styled";

export const StyledEditor = styled.div`
  display: flex;
  margin: 0 auto;
  flex-flow: row;
  width: 100vh;
  height: 50vh;
`;

export const EditorForm = styled.div`
  flex-flow: wrap;
  font-family: ${props => props.theme.fontFamily.body};
  font-size: ${props => props.theme.fontSize.body};
  color: ${props => props.theme.colors.primaryBackground};
  width: 413px;
  justify-content: space-between;
  margin-left: 50px;
`;

export const FirstBlockOfEditor = styled.div``;

export const SecondBlockOfEditor = styled.div<{visibility:string}>`
  visibility: ${props=> props.visibility};
`;

export const PhotoBlock = styled.div`
  align-items: center;
  justify-content: center;
  width: 60%;
  height: auto;
`;

export const Photoes = styled.div`
  max-width: 100vh;
  margin-bottom: 40px;
`;
