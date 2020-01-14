/* tslint:disable */
import React, { useState, useCallback, useEffect } from "react";
import GoogleMapBlock from "../GoogleMapBlock";
import {
  StyledEditorBlock,
  PositionSelector,
  SubHeader
} from "./CreatePost.styled";
import SubContainer from "../Container/Container.Pages.styled";
import { ThemeProvider } from "emotion-theming";
import { ITheme } from "../../../styles/variables";
import Label from "./Label";
import EditorItems from "./EditorItems";
import { INewPost, IPhotoBuffer } from "../../../App.types";
import { nullPhoto } from "../../../App.reducer";

interface ICreatePostProps {
  theme: ITheme;
  rating: number;
  photoesUrls: IPhotoBuffer[];
  pushUpUrl: (name: string, photoUrl: string) => void;
  createNewPost: (newPost: INewPost) => void;
}

const CreatePost = ({
  rating,
  photoesUrls,
  pushUpUrl,
  createNewPost,
  theme
}: ICreatePostProps) => {
  const [action, getAction] = useState(0);
  const [isPrivate, setPrivate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [newMarker, setNewMarker] = useState({ lat: 0, lng: 0 });

  const handleLabelCommand = (number: "Save" | "Cancel") => {
    var d = new Date();
    var dateTime: string =
      d.getFullYear() +
      "-" +
      (d.getMonth() + 1) +
      "-" +
      d.getDate() +
      " " +
      d.getHours() +
      ":" +
      d.getMinutes() +
      ":" +
      d.getSeconds();
    var newPost: INewPost = {
      name,
      isPrivate,
      description,
      photoes: photoesUrls,
      position: newMarker,
      dateTime
    };
    if (newPost.description === "") alert("Please, insert description");
    else if (newPost.name === "") alert("Please, insert name");
    else if (newPost.photoes === nullPhoto) alert("Please, select photoes");
    else if (newMarker.lat === 0 || newMarker.lng === 0)
      alert("Please, select Position");
    else number === "Save" ? createNewPost(newPost) : getAction(0);
  };

  const nameValue = (text: string) => {
    setName(text);
  };
  const descriptionValue = (text: string) => {
    setDescription(text);
  };

  const isPrivatePost = (res: boolean) => {
    setPrivate(res);
  };

  const handlePosition = (lat: number, lng: number) => {
    console.log(lat, lng);
    setNewMarker({ lat, lng });
  };

  return (
    <ThemeProvider theme={theme}>
      <SubContainer>
        <Label labelCommand={handleLabelCommand}>Create Post</Label>
        <StyledEditorBlock>
          <SubHeader>Primary info</SubHeader>
          <EditorItems
            rating={rating}
            photoesUrls={photoesUrls}
            pushUpUrl={pushUpUrl}
            nameValue={nameValue}
            descriptionValue={descriptionValue}
            isPrivatePost={isPrivatePost}
          />
          <SubHeader>Actual Position</SubHeader>
          <PositionSelector>
            <GoogleMapBlock newPosition={handlePosition} />
          </PositionSelector>
        </StyledEditorBlock>
      </SubContainer>
    </ThemeProvider>
  );
};

export default CreatePost;
