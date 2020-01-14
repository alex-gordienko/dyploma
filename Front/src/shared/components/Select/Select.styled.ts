/* tslint:disable */
import styled from "@emotion/styled";

export default styled.div`
  min-width: 130px;
  position: relative;

  select {
    width: 100%;
    height: 40px;
    border: 1px solid #cfcfcf;
    padding: 2px 35px 2px 20px;
    border-radius: 20px;
    font-size: 14px;
    appearance: none;
  }

  span {
    content: "";
    border-bottom: 1px solid #000;
    border-left: 1px solid #000;
    position: absolute;
    z-index: 1;
    top: 15px;
    right: 20px;
    height: 8px;
    width: 8px;
    display: inline-block;
    transform: rotate(-45deg);
  }

  select:focus {
    border-radius: 20px 20px 0 0;
  }

  select:focus + span {
    top: 20px;
    transform: rotate(135deg);
  }
`;
