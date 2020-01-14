/* tslint:disable */
import styled from "@emotion/styled";

export default styled.div`
  width: 500px;
  margin: 20px auto;
  * {
    box-sizing: border-box;
  }

  input[type="text"],
  input[type="password"] {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    margin-top: 6px;
    margin-bottom: 16px;
    resize: vertical;
  }
  input[type="button"] {
    background-color: #a82b11;
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  input[type="button"]:hover {
    background-color: #6f49b9;
  }
`;
