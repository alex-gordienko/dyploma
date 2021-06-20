/* tslint:disable */
import { styled } from "../../../../../styles/styled";

export const StyledChatPreview = styled.div`
  width: 100%;
  text-align: left;
  color: ${(props: any) => props.theme.colors.secondaryBody};
  font-family: ${(props: any) => props.theme.fontFamily.body};
  cursor: pointer;
  display: inline-flex;
  background: ${props => props.theme.colors.primaryBackground};
  &:hover {
    background-color: ${(props: any) => props.theme.colors.secondaryHover};
  }
`;

export const Avatar = styled.div`
  display: flex;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  > img {
    border-radius: 30px;
    width: 100%;
    height: 100%;
    margin: 0px auto 0px auto;
  }
`;

export const Label = styled.div`
  font-size: ${(props: any) => props.theme.fontSize.title};
  max-width: 60vh;
  margin-right: auto;
  font-weight: bold;
  text-decoration: none;
`;

export const LeftBlock = styled.div`
  margin: 5px 20px 5px 20px;
`;

export const CenterBlock = styled.div``;

export const RightBlock = styled.div`
  margin-left: auto;
  margin-right: 20px;
  margin-top: auto;
  margin-bottom: auto;
`;

export const Body = styled.div`
  margin-top: 5px;
  font-size: ${(props: any) => props.theme.fontSize.body};
`;

export const Online = styled.div`
  font-size: ${(props: any) => props.theme.fontSize.small};
`;

export const Footer = styled.div``;
