/* tslint:disable */
import {styled} from "../../../../../styles/styled";

export default styled.div`
  position: relative;
  display: inline-block;
  
  ul{
      background-color: ${(props: any) => props.theme.colors.header.background};
      list-style-type: none;
      margin:0;
      width: 20vh;
      position: fixed;
      right: 0;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      z-index: 1;
  }
  .menu-link {
    font-family: ${(props: any) => props.theme.fontFamily.body};
    font-size: ${(props: any) => props.theme.fontSize.body};
    color: ${(props: any) => props.theme.colors.header.primaryText};
    text-decoration: none;
    margin-right: 50px;
    line-height: 2;
    position: relative;
    :hover {
      color: ${(props: any) => props.theme.colors.header.primaryTextHover};
    }
  }
`;
