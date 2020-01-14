/* tslint:disable */
import React, { useState } from "react";
import { ThemeProvider } from "emotion-theming";
import Label from "./Label";
import { ITheme } from "../../../styles/variables";
import EditorBlock from "./EditorBlock";

interface IProfileEditorProps {
  mode: "Create" | "Edit";
  skillsList: string[];
  theme: ITheme;
  userName: string;
}

const ProfileEditor = ({
  mode,
  theme,
  userName,
  skillsList
}: IProfileEditorProps) => {
  const [action, getAction] = useState(0);
  const handleLabelCommand = (number: "Save" | "Cancel") => {
    number === "Save" ? getAction(1) : getAction(0);
  };
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Label labelCommand={handleLabelCommand}>
          {mode === "Create" ? "Create user" : userName}
        </Label>
        <EditorBlock mode={mode} skillsList={skillsList} theme={theme} />
      </div>
      <p>Getting action: {action === 0 ? "Cancel " : "Save "}</p>
    </ThemeProvider>
  );
};
ProfileEditor.defaultProps = {
  userName: "No Name"
};

export default ProfileEditor;
