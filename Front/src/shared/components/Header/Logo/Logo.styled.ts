/* tslint:disable */
import styled from "@emotion/styled";

export default styled.div`
  margin: auto auto auto 50px;

  & path {
    fill: ${(props: any) => props.theme.colors.header.background};
  }
`;
