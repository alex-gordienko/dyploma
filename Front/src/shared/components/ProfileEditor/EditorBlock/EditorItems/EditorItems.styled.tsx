/* tslint:disable */
import { styled } from "../../../../../styles/styled";

export const StyledEditor = styled.div`
  display: inline-flex;
  flex-flow: row;
`;

export const EditorForm = styled.form`
  display: inline-flex;
  flex-flow: wrap;
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

export const PhotoBlock = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 110px;
  height: 110px;
  background-color: ${props => props.theme.colors.button.color};
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
  :hover {
    -webkit-transition: all 0.3s ease;
    -moz-transition: all 0.3s ease;
    -o-transition: all 0.3s ease;
    transition: all 0.3s ease;
    background-color: ${props => props.theme.colors.button.hoverColor};
  }
`;
