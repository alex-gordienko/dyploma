/* tslint:disable */
import { styled } from "../../../../styles/styled";

const StyledMenu = styled.nav`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-right: 50px;

  .menu-link {
    font-family: ${(props: any) => props.theme.fontFamily.body};
    font-size: ${(props: any) => props.theme.fontSize.body};
    color: ${(props: any) => props.theme.colors.header.primaryText};
    text-decoration: none;
    margin-left: 50px;
    line-height: 2;
    position: relative;
    :hover {
      color: ${(props: any) => props.theme.colors.header.primaryTextHover};
    }
    :after {
      background-color: ${(props: any) =>
        props.theme.colors.header.primaryText};
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
  }
  .menu-link--active {
    color: ${(props: any) => props.theme.colors.header.primaryTextActive};
  }

  a:hover:after,
  a:focus:after {
    width: 100%;
  }
  a:hover,
  a:focus {
    text-decoration: none;
    outline: none;
  }
  .logo {
    font-family: "Roboto Slab", serif;
    font-weight: bold;
    margin: 10px 5px 5px 5px;
    float: left;
  }
  nav {
    float: right;
  }
  nav ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  nav li {
    font-family: "PT Sans Caption", sans-serif;
    font-size: 0.8em;
    margin-right: 1em;
    display: inline-block;
  }
  nav a {
    color: black;
  }
`;

export default StyledMenu;
