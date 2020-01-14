/* tslint:disable */
import { styled } from "../../../styles/styled";

export const Container = styled.div`
  width: 100%;
`;

export const Input = styled.input`
  font-family: ${(props: any) => props.theme.fontFamily.body};
  font-size: ${(props: any) => props.theme.fontSize.body};
  color: ${(props: any) => props.theme.colors.primaryBody};
  width: fill-available;
  padding: 3px 20px 5px 20px;
  background-color: ${(props: any) => props.theme.colors.primaryBackground};
  font-weight: lighter;
  outline: none;
  border-top: none;
  border-left: none;
  border-right: none;
  border-bottom: 1px solid ${(props: any) => props.theme.colors.secondaryHover};
`;
