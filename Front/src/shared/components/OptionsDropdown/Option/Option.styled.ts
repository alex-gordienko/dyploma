/* tslint:disable */
import { styled } from "../../../../styles/styled";

interface IStyledOptionProps {
  active: boolean;
}

const StyledOption = styled.div<IStyledOptionProps>`
  max-width: inherit;
  margin: 1px 0px 1px 0px;
  padding: 4px 20px;
  text-align: left;
  color: ${props => props.theme.colors.secondaryBody};
  font-family: ${props => props.theme.fontFamily.body};
  font-size: ${props => props.theme.fontSize.body};
  cursor: pointer;
  background-color: ${props =>
    props.active
      ? props.theme.colors.secondaryHover
      : props.theme.colors.primaryBackground};
  &:hover {
    background-color: ${props => props.theme.colors.secondaryHover};
  }
`;
export default StyledOption;
