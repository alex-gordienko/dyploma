/* tslint:disable */
import React from "react";
import TextInputItem from "./EditorTextInput/EditorTextInput.component";
import SelectItem from "./EditorSelect/EditorSelect.component";
import DateItem from "./EditorDate/EditorDate.component";
import { StyledEditor, EditorForm, PhotoBlock } from "./EditorItems.styled";
import { SubHeader } from "../../ProfileEditor.styled";

interface IEditorItemsProps {
  mode: "Create" | "Edit";
}

export default function EditorItems({ mode }: IEditorItemsProps) {
  return (
    <div>
      <SubHeader>
        {mode === "Create"
          ? "Add Profile Information"
          : "Edit Profile Information"}
      </SubHeader>
      <StyledEditor>
        <PhotoBlock></PhotoBlock>
        <EditorForm>
          <TextInputItem
            required={true}
            label="Full Name:"
            placeholder="Enter name"
            lenght="TextInput"
          />
          <SelectItem
            label="Position:"
            defaultValue="Select Position"
            values={["Position1", "Position2", "Position3", "Position4"]}
          />
          <TextInputItem
            required={true}
            label="E-mail:"
            type="email"
            placeholder="Enter e-mail"
            lenght="TextInput"
          />
          <SelectItem
            label="Projects:"
            defaultValue="Select Projects"
            values={["All projects", "Project1", "Project2", "Project3"]}
          />
          <TextInputItem
            required={true}
            label="Tel.:"
            placeholder="Enter telephone number"
            lenght="TextInput"
            type="tel"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          />
          <DateItem label="Hire date:" placeholder="Choose date" />
          <DateItem label="Birthday:" placeholder="Choose date" />
          <SelectItem
            label="Office:"
            defaultValue="Select office"
            values={["Office1", "Office2", "Office3", "Office4"]}
          />
          <TextInputItem
            label="Description:"
            placeholder="Enter description"
            lenght="TextArea"
          />
          <TextInputItem
            label="Hobbies:"
            placeholder="Enter hobbies"
            lenght="TextArea"
          />
        </EditorForm>
      </StyledEditor>
    </div>
  );
}
