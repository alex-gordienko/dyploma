/* tslint:disable */
import { styled } from "../../../../styles/styled";

export const StyledUserDataBlock = styled.div`
  max-width: inherit;
  margin: 10px 20px 0px 50px;
`;

export const TopUserDataBlock = styled.div`
  display: inline-flex;
`;

export const BottomUserDataBlock = styled.div``;

export const InfoBlock = styled.div`
  margin-left: 10px;
`;

export const PhotoBlock = styled.div`
  align-items: center;
  justify-content: center;
  height: auto;
`;

export const Photo = styled.img`
  height: auto;
  border-radius: 5px;
  height: 5em;
  margin: 0px auto 0px auto;
`;

export const Progress = styled.div<{ Rating: number }>`
  font-family: ${props => props.theme.fontFamily.body};
  width: inherit;
  height: 20px;
  border-radius: 5px;
  background: linear-gradient(to top, transparent, lightgray, black);
  overflow: hidden;
  position: relative;
  ::before{
    content: "";
    position: absolute;
    background: hsl(${props => props.Rating}, 100%, 50%);
    width: ${props => props.Rating}%;
    height: 20px;
    margin-left: 0%;
    box-sizing: border-box;
    border-left: none;
    box-shadow: 2px 0 2px 0 black;
    transition: 5s;
  }
  ::after{
    top:10%;
    left: ${props => props.Rating / 2}%;
    content: "${props => props.Rating}";
    position: absolute;
    z-index: 10;
    transition: 5s;
  }
`;
