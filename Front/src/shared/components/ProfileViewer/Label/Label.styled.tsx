/* tslint:disable */
import { styled } from "../../../../styles/styled";

export const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-right: auto;

  .label-name {
    font-family: ${props => props.theme.fontFamily.bigTitle};
    font-size: ${props => props.theme.fontSize.title};
    letter-spacing: 4px;
  }
`;

export const TabSelector = styled.div`
  background: ${props => props.theme.colors.secondaryBody};
`;

export const TabElement = styled.div`
  background: linear-gradient(
    to bottom,
    transparent,
    ${props => props.theme.colors.primaryBackground}
  );
  height: inherit;
  display: table;
  > input {
    display: none;
  }
  > label {
    width: 20vh;
    height: 100%;
    text-align: center;
    display: table-cell;
    vertical-align: middle;
    cursor: pointer;
  }
  > label:hover {
    background: linear-gradient(
      to bottom,
      transparent,
      ${props => props.theme.colors.primaryBackground}
    );
  }
  > input:checked + label {
    background: linear-gradient(
      to bottom,
      transparent,
      ${props => props.theme.colors.primaryBackground}
    );
  }
`;

export const Tab = styled.div`
  background: ${props => props.theme.colors.primaryBackground};
  width: 100%;
`;
