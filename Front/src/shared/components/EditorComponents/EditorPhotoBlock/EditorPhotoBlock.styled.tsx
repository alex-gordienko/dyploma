/* tslint:disable */
import { styled } from "../../../../styles/styled";

export const PhotoBlock = styled.div`
  align-items: center;
  justify-content: center;
  width: 70vh;
  height: auto;
`;

export const Photoes = styled.div`
  max-width: 100vh;
  height: 80vh;
  margin-bottom: 40px;
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
