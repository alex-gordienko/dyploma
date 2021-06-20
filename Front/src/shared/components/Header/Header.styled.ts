/* tslint:disable */
import styled from "@emotion/styled";

export default styled.header`
  display: inline-flex;
  flex-flow: wrap;
  min-width: 800px;
  margin: 0px auto;
  padding-left: 50px;
  padding-right: 50px;
  width: 100%;
  height: 8vh;
  min-height: 53px;
  justify-content: space-between;
  align-items: center;
  background: ${(props: any) => props.theme.colors.header.background};
`;
