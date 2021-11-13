import { styled } from "../../../styles/styled";

export const Photo = styled.img`
  max-width: 40vh;
  height: auto;
  margin-right: 20px;
`;

export const ErrorPageBlock = styled.div`
  display: inline-flex;
  width: 800px;
  margin: 25vh auto;
  flex-wrap: wrap;
  align-items: center;
  * {
    box-sizing: border-box;
  }
`;

export const Error = styled.p`
  margin: 20px auto;
  width: 40%;
`;
