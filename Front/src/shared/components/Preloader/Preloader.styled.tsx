import { styled } from "../../../styles/styled";

export const StyledPreloader = styled.div`
  margin: 0 auto;
  display: flex;
  align-items: center;
  flex-direction: column;
  font-family: ${(props: any) => props.theme.fontFamily.body};
  font-size: ${(props: any) => props.theme.fontSize.body};
  color: ${(props: any) => props.theme.colors.header.primaryText};
`;
