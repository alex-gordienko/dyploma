/* tslint:disable */
import React from "react";
import Container from "../../Container/Container.Pages.styled";
import EditorItems from "./EditorItems";
import EducationBlock from "./EducationBlock";
import SkillsBlock from "./SkillsBlock";
import { ITheme } from "../../../../styles/variables";

interface IProfileEditorProps {
  mode: "Create" | "Edit";
  skillsList: string[];
  theme: ITheme;
}

const EditorBlock = ({ mode, skillsList, theme }: IProfileEditorProps) => {
  return (
    <Container>
      <EditorItems mode={mode} />
      <EducationBlock />
      <SkillsBlock skillsList={skillsList} theme={theme} />
    </Container>
  );
};
EditorBlock.defaultProps = {
  userName: "No Name"
};

export default EditorBlock;
