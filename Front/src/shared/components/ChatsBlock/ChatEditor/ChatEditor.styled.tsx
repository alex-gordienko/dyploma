/* tslint:disable */
import { styled } from "../../../../styles/styled";

export const StyledEditor = styled.div`
  display: flex;
  margin: 10px auto;
  flex-flow: row;
  max-width: 100vh;
  justify-content: center;
`;

export const PhotoBlock = styled.div`
  align-items: center;
  justify-content: center;
  height: auto;
`;

export const Photo = styled.img`
  height: auto;
  border-radius: 5px;
  display: inline-block;
  height: 15em;
  margin: 0px auto 0px auto;
`;

export const EditorForm = styled.div`
  flex-flow: wrap;
  display: flex;
  flex-flow: column;
  font-family: ${props => props.theme.fontFamily.body};
  font-size: ${props => props.theme.fontSize.body};
  justify-content: space-between;
  align-items: center;
  margin-bottom: 29px;
`;

export const Avatar = styled.div`
  display: flex;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  > img {
    border-radius: 15px;
    width: 100%;
    height: 100%;
    margin: 0px auto 0px auto;
  }
`;
