/* tslint:disable */
import { styled } from "../../styles/styled";

export default styled.div`
  display: flex;
  min-height: 300px;
  height: inherit;
  width: 100%;

  .panel {
    height: inherit;
  }
  .resizer {
    z-index: 100;
    width: 8px;
    background: darkGray;
    position: relative;
    cursor: col-resize;
    flex-shrink: 0;
    -webkit-user-select: none; /* Chrome all / Safari all */
    -moz-user-select: none; /* Firefox all */
    -ms-user-select: none; /* IE 10+ */
    user-select: none; /* Likely future */
  }

  .resizer::after,
  .resizer::before {
    content: "";
    border-left: 1px solid #333;
    position: absolute;
    top: 50%;
    transform: translateY(-100%);
    right: 0;
    display: inline-block;
    height: 20px;
    margin: 0 2px;
  }
  .resizer::before {
    left: 0;
  }
`;
