/* tslint:disable */
import React, { useState } from "react";
import TextArea from "../../../TextArea";
import { StyledEducationBlock } from "./EducationBlock.styled";
import { SubHeader } from "../../ProfileEditor.styled";

const EducationBlock = () => {
  const [value, setValue] = useState("");
  return (
    <StyledEducationBlock>
      <SubHeader>Education</SubHeader>
      <div className="input-field">
        <TextArea
          onChange={e => {
            setValue(e);
          }}
          placeholder="Enter education"
        />
      </div>
    </StyledEducationBlock>
  );
};

export default EducationBlock;
