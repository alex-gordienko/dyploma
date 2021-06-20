/* tslint:disable */
import { styled } from "../../../styles/styled";

interface IDelimeterProps {
  xPos: number;
}

interface IBorderProps {
  width: number;
  xShift: number;
}

interface BodyblockStyledProps {
  mode: "Main Page" | "Profile";
}

export default styled.div<BodyblockStyledProps>`
  min-width: 500px;
  overflow-y: hidden;
  width: 100%;
  height: ${props => (props.mode === "Main Page" ? "92vh" : "70vh")};
  display: inline-flex;
  flex-flow: wrap;
`;

export const Delimeter = styled.div<IDelimeterProps>`
  cursor: col-resize;
  width: 1%;
  margin: 0;
  border: none;
  background: ${(props: any) => props.theme.colors.header.background};
`;

export const Border = styled.div<IBorderProps>`
  display: none;
  position: absolute;
  top: auto;
  left: ${props => props.xShift}px;
  z-index: 10;
  border: none;
  background-color: rgba(0, 0, 0, 0.5);
  height: inherit;
  width: ${props => props.width}px;
`;
