/* tslint:disable */
import React, { useState, useCallback, useEffect } from "react";
import GoogleMapBlock from "../GoogleMapBlock";
import { StyledEditorBlock, PositionSelector } from "./PostEditor.styled";
import { SubHeader } from "../EditorComponents/EditorComponents.styled";
import SubContainer from "../Container/Container.Pages.styled";
import Label from "./Label";
import EditorItems from "./EditorElements";
import {
  IFullDataUser,
  INewPost,
  IPhotoBuffer,
  IPost
} from "../../../App.types";
import { nullPhoto, nullPost } from "../../../App.reducer";
import { Redirect } from "react-router-dom";

interface IEditPostProps {
  type: "Edit";
  currentUser: IFullDataUser;
  loadData: () => void;
  existPost: IPost;
  saveChanges: (changedPost: IPost) => void;
}

interface ICreatePostProps {
  type: "Create";
  currentUser: IFullDataUser;
  createNewPost: (newPost: IPost) => void;
}

type IPostEditorProps = ICreatePostProps | IEditPostProps;

const PostEditor = (mode: IPostEditorProps) => {
  const [newPost, setNewPost] = useState<IPost>(
    mode.type === "Create"
      ? {
          ...nullPost,
          idUser: mode.currentUser.idUsers,
          username: mode.currentUser.username
        }
      : mode.existPost
  );
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (mode.type === "Edit" && newPost === null) {
      //console.log("postData is null. Calling function");
      mode.loadData();
    }
  }, [1]);

  useEffect(() => {
    newPost.description === "" ||
    newPost.Name === "" ||
    newPost.photoes === nullPhoto ||
    newPost.position.lat === 0 ||
    newPost.position.lng === 0
      ? setIsDisabled(true)
      : setIsDisabled(false);
  }, [newPost]);

  const getRedirect = () => {
    return <Redirect to="/" />;
  };

  const handleLabelCommand = (number: "Save" | "Cancel") => {
    if (number === "Save") {
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
      if (mode.type === "Create") {
        mode.createNewPost({ ...newPost, date: dateTime });
      } else if (mode.type === "Edit" && newPost) {
        mode.saveChanges({ ...newPost, date: dateTime });
      }
    } else if (number === "Cancel") {
      getRedirect();
    }
  };

  const onNameValueChanged = (text: string) => {
    setNewPost({ ...newPost, Name: text });
  };
  const onDescriptionValueChanged = (text: string) => {
    setNewPost({ ...newPost, description: text });
  };

  const onIsPrivatePostChanged = (res: boolean) => {
    setNewPost({ ...newPost, isPrivate: res ? 1 : 0 });
  };

  const handlePosition = (lat: number, lng: number) => {
    setNewPost({ ...newPost, position: { lat, lng } });
  };

  const setPhotoes = (name: string, photoUrl: string) => {
    if (newPost.photoes === nullPhoto) {
      setNewPost({ ...newPost, photoes: [] });
    }
    const newPhoto: IPhotoBuffer[] = newPost.photoes
      .filter(photo => !nullPhoto.includes(photo))
      .concat({ name, blob: photoUrl });
    setNewPost({ ...newPost, photoes: newPhoto });
  };

  const clearPhotoBuf = () => {
    setNewPost({ ...newPost, photoes: nullPhoto });
  };

  return mode.type === "Edit" && newPost ? (
    mode.currentUser.rating > 70 &&
    mode.currentUser.idUsers === newPost.idUser ? (
      <SubContainer>
        <Label disabled={isDisabled} labelCommand={handleLabelCommand}>
          Create Post
        </Label>
        <StyledEditorBlock>
          <SubHeader>Primary info</SubHeader>
          <EditorItems
            photoesUrls={newPost.photoes}
            pushUpUrl={setPhotoes}
            clearPhotoBuf={clearPhotoBuf}
            onNameValueChanged={onNameValueChanged}
            onDescriptionValueChanged={onDescriptionValueChanged}
            onIsPrivatePostChanged={onIsPrivatePostChanged}
            nameValue={newPost.Name}
            descriptionValue={newPost.description}
            isPrivatePost={newPost.isPrivate ? true : false}
          />
          <SubHeader>Actual Position</SubHeader>
          <PositionSelector>
            <GoogleMapBlock
              mode="Posts"
              aloneMarker={newPost}
              newPosition={handlePosition}
            />
          </PositionSelector>
        </StyledEditorBlock>
      </SubContainer>
    ) : mode.currentUser.idUsers === newPost.idUser ? (
      <SubContainer>
        <Label disabled={isDisabled} labelCommand={handleLabelCommand}>
          Error
        </Label>
        <StyledEditorBlock>
          <SubHeader>
            Your Rating: {mode.currentUser.rating}. That's too low to create
            post
          </SubHeader>
        </StyledEditorBlock>
      </SubContainer>
    ) : (
      <SubContainer>
        <Label disabled={isDisabled} labelCommand={handleLabelCommand}>
          Error
        </Label>
        <StyledEditorBlock>
          <SubHeader>That's not your post, dude</SubHeader>
        </StyledEditorBlock>
      </SubContainer>
    )
  ) : mode.currentUser.rating > 70 ? (
    <SubContainer>
      <Label disabled={isDisabled} labelCommand={handleLabelCommand}>
        Create Post
      </Label>
      <StyledEditorBlock>
        <SubHeader>Primary info</SubHeader>
        <EditorItems
          photoesUrls={newPost.photoes}
          pushUpUrl={setPhotoes}
          clearPhotoBuf={clearPhotoBuf}
          onNameValueChanged={onNameValueChanged}
          onDescriptionValueChanged={onDescriptionValueChanged}
          onIsPrivatePostChanged={onIsPrivatePostChanged}
          nameValue={newPost.Name}
          descriptionValue={newPost.description}
          isPrivatePost={newPost.isPrivate ? true : false}
        />
        <SubHeader>Actual Position</SubHeader>
        <PositionSelector>
          <GoogleMapBlock
            mode="Posts"
            aloneMarker={undefined}
            newPosition={handlePosition}
          />
        </PositionSelector>
      </StyledEditorBlock>
    </SubContainer>
  ) : (
    <SubContainer>
      <Label disabled={isDisabled} labelCommand={handleLabelCommand}>
        Error
      </Label>
      <StyledEditorBlock>
        <SubHeader>
          Your Rating: {mode.currentUser.rating}. That's too low to create post
        </SubHeader>
      </StyledEditorBlock>
    </SubContainer>
  );
};

export default PostEditor;
