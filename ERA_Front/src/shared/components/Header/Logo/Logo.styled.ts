/* tslint:disable */
import styled from "@emotion/styled";

export default styled.a`
  margin-right: auto;
  path {
    fill: ${(props: any) => props.theme.colors.primaryBody};
  }
  font-family: ${(props: any) => props.theme.fontFamily.bigTitle};
  font-size: ${(props: any) => props.theme.fontSize.title};
  color: ${(props: any) => props.theme.colors.header.primaryText};
  text-decoration: none;
  line-height: 2;
  position: relative;
  :hover {
    color: ${(props: any) => props.theme.colors.header.primaryTextHover};
  }
  :after {
    background-color: ${(props: any) => props.theme.colors.header.primaryText};
    display: block;
    content: "";
    height: 2px;
    width: 10px;
    left: 50%;
    position: absolute;
    -webkit-transition: width 0.3s ease-in-out;
    -moz--transition: width 0.3s ease-in-out;
    transition: width 0.3s ease-in-out;
    -webkit-transform: translateX(-50%);
    -moz-transform: translateX(-50%);
    transform: translateX(-50%);
  }
`;
