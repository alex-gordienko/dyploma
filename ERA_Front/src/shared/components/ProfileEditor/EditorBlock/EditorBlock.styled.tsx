/* tslint:disable */
import { styled } from "../../../../styles/styled";

export const FieldName = styled.div`
  color: ${props => props.theme.colors.primaryBody};
  margin: 10px auto 10px 0px;
  max-width: 100px;
  flex: none;
`;
export const Element = styled.div`
  width: 350px;
  height: 42px;
  min-height: 42px;
`;

export const StyledEditor = styled.div`
  display: flex;
  margin: 10px auto;
  flex-flow: row;
  max-width: 100vh;
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
    height: 20em;
    margin: 0px auto 0px auto;
`;

export const EditorForm = styled.div`
  display: flex;
  flex-flow: wrap;
  font-family: ${props => props.theme.fontFamily.body};
  font-size: ${props => props.theme.fontSize.body};
  color: ${props => props.theme.colors.primaryBackground};
  justify-content: space-between;
  align-items: center;
  margin-bottom: 29px;
`;