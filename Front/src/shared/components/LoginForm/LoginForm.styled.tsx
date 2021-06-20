/* tslint:disable */
import { styled } from "../../../styles/styled";

export default styled.div`
  width: 500px;
  margin: 20px auto;
  * {
    box-sizing: border-box;
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
  input[type="button"] {
    background-color: #a82b11;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  input[type="button"]:hover {
    background-color: #6f49b9;
  }
`;
