/* tslint:disable */
import { styled } from "../../../../styles/styled";

interface IStyledOptionProps {
  active: boolean;
}

export const StyledPost = styled.div<IStyledOptionProps>`
  max-width: inherit;
  margin: 1px 0px 1px 0px;
  padding: 4px 20px;
  text-align: left;
  color: ${(props: any) => props.theme.colors.secondaryBody};
  font-family: ${(props: any) => props.theme.fontFamily.body};
  font-size: ${(props: any) => props.theme.fontSize.body};
  cursor: pointer;
  background-color: ${(props: any) =>
    props.active
      ? props.theme.colors.secondaryHover
      : props.theme.colors.primaryBackground};
  &:hover {
    background-color: ${(props: any) => props.theme.colors.secondaryHover};
  }
`;

export const Head = styled.div`
  display: flex;
`;

export const Label = styled.div`
  margin-right: auto;
`;

export const Author = styled.div``;

export const Body = styled.div``;

export const Photoes = styled.div`
  margin-bottom: 30px;
`;
export const Photo = styled.div`
  max-width: 100vh;
  max-height: 70vh;
  div > img {
    max-width: 100%;
    max-height: 70vh;
    margin: 0px auto 0px auto;
  }
`;

export const Text = styled.div``;

export const Time = styled.div``;

export const Footer = styled.div``;

export const Comments = styled.div``;
