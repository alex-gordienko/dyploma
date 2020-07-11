/* tslint:disable */
import React, { useState, useCallback, useEffect } from "react";
import GoogleMapBlock from "../GoogleMapBlock";
import {
  StyledEditorBlock,
  PositionSelector
} from "./PostEditor.styled";
import { SubHeader } from "../EditorComponents/EditorComponents.styled";
import SubContainer from "../Container/Container.Pages.styled";
import Label from "./Label";
import EditorItems from "./EditorElements";
import { INewPost, IPhotoBuffer, IPost } from "../../../App.types";
import { nullPhoto } from "../../../App.reducer";
import { Redirect } from "react-router-dom";

interface IEditPostProps {
  type: "Edit";
  currentUser: number;
  rating: number;
  loadData:() =>void;
  existPost: IPost | null;
  saveChanges: (changedPost: IPost) => void;
}

interface ICreatePostProps {
  type: "Create";
  rating: number;
  createNewPost: (newPost: INewPost) => void;
}

type IPostEditorProps = ICreatePostProps | IEditPostProps;

const PostEditor = (mode: IPostEditorProps) => {

  useEffect(()=>{
    if(mode.type=== "Edit" && mode.existPost===null){
      //console.log("postData is null. Calling function");
      mode.loadData();
    }
  },[1])

    const [isPrivate, setPrivate] = useState(mode.type==="Edit"&& mode.existPost ? mode.existPost.isPrivate? true: false: false );
    const [name, setName] = useState(mode.type==="Edit"&& mode.existPost? mode.existPost.Name: "");
    const [description, setDescription] = useState(mode.type==="Edit"&& mode.existPost? mode.existPost.description: "");
    const [newMarker, setNewMarker] = useState(mode.type==="Edit"&& mode.existPost? { lat: mode.existPost.position.lat, lng: mode.existPost.position.lng } :{ lat: 0, lng: 0 });
    const [photoBuf, setPhotoBuf] = useState(mode.type==="Edit"&& mode.existPost? mode.existPost.photoes : nullPhoto);

    const getRedirect=()=>{
      return <Redirect to="/"/>;
    }

    const handleLabelCommand = (number: "Save" | "Cancel") => {
      if(number === "Save"){
        var d = new Date();
        var dateTime: string =d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
        if(mode.type==="Create"){
          var newPost:INewPost={
            name,
            isPrivate,
            description,
            photoes: photoBuf,
            position: newMarker,
            dateTime
          };
          if (newPost.description === "") alert("Please, insert description");
          else if (newPost.name === "") alert("Please, insert name");
          else if (newPost.photoes === nullPhoto) alert("Please, select photoes");
          else if (newMarker.lat === 0 || newMarker.lng === 0)
            alert("Please, select Position");
          else mode.createNewPost(newPost);
        }
        else if(mode.type==="Edit"&& mode.existPost){
          var editedPost:IPost={
            Name: name,
            idPost: mode.existPost.idPost,
            idUser: mode.existPost.idUser,
            isPrivate: isPrivate? 1:0,
            description,
            photoes: photoBuf,
            position: newMarker,
            date: dateTime,
            rating: mode.existPost.rating,
            type: mode.existPost.type,
            username: mode.existPost.username
          };
          if (editedPost.description === "") alert("Please, insert description");
          else if (editedPost.Name === "") alert("Please, insert name");
          else if (editedPost.photoes === nullPhoto) alert("Please, select photoes");
          else if (newMarker.lat === 0 || newMarker.lng === 0) alert("Please, select Position");
          else mode.saveChanges(editedPost);
        }
      }
      else if(number === "Cancel"){
        getRedirect();
      }
    };

    const onNameValueChanged = (text: string) => {
      setName(text);
    };
    const onDescriptionValueChanged = (text: string) => {
      setDescription(text);
    };

    const onIsPrivatePostChanged = (res: boolean) => {
      setPrivate(res);
    };

    const handlePosition = (lat: number, lng: number) => {
      setNewMarker({ lat, lng });
    };

    const setPhotoes = (name: string, photoUrl: string) =>{
      if (photoBuf === nullPhoto) {
        photoBuf.splice(0, 3);
      }
      const newPhoto: IPhotoBuffer = { name, blob:photoUrl};
      const updatedPhotoBuf: IPhotoBuffer[] = [...photoBuf, newPhoto];
      setPhotoBuf(updatedPhotoBuf);
    }

    const clearPhotoBuf = () => {
      setPhotoBuf(nullPhoto);
    }

    return mode.type==="Edit"&& mode.existPost?(
      mode.rating>70 && mode.currentUser === mode.existPost.idUser ?(
        <SubContainer>
          <Label labelCommand={handleLabelCommand}>Create Post</Label>
          <StyledEditorBlock>
            <SubHeader>Primary info</SubHeader>
            <EditorItems
              photoesUrls={photoBuf}
              pushUpUrl={setPhotoes}
              clearPhotoBuf={clearPhotoBuf}
              onNameValueChanged={onNameValueChanged}
              onDescriptionValueChanged={onDescriptionValueChanged}
              onIsPrivatePostChanged={onIsPrivatePostChanged}
              nameValue={name}
              descriptionValue={description}
              isPrivatePost={isPrivate}
            />
            <SubHeader>Actual Position</SubHeader>
            <PositionSelector>
              <GoogleMapBlock mode="Posts" aloneMarker={mode.existPost} newPosition={handlePosition} />
            </PositionSelector>
          </StyledEditorBlock>
        </SubContainer>
      ):(
        mode.currentUser === mode.existPost.idUser ?(
          <SubContainer>
            <Label labelCommand={handleLabelCommand}>Error</Label>
            <StyledEditorBlock>
              <SubHeader>Your Rating: {mode.rating}. That's too low to create post</SubHeader>
            </StyledEditorBlock>
          </SubContainer>
        ):(
          <SubContainer>
            <Label labelCommand={handleLabelCommand}>Error</Label>
            <StyledEditorBlock>
              <SubHeader>That's not your post, dude</SubHeader>
            </StyledEditorBlock>
          </SubContainer>
        )
      )
    ):(
      mode.rating>70?(
        <SubContainer>
        <Label labelCommand={handleLabelCommand}>Create Post</Label>
        <StyledEditorBlock>
          <SubHeader>Primary info</SubHeader>
          <EditorItems
            photoesUrls={photoBuf}
            pushUpUrl={setPhotoes}
            clearPhotoBuf={clearPhotoBuf}
            onNameValueChanged={onNameValueChanged}
            onDescriptionValueChanged={onDescriptionValueChanged}
            onIsPrivatePostChanged={onIsPrivatePostChanged}
            nameValue={name}
            descriptionValue={description}
            isPrivatePost={isPrivate}
          />
          <SubHeader>Actual Position</SubHeader>
          <PositionSelector>
            <GoogleMapBlock mode="Posts" aloneMarker={undefined} newPosition={handlePosition} />
          </PositionSelector>
        </StyledEditorBlock>
      </SubContainer>
    ):(
        <SubContainer>
          <Label labelCommand={handleLabelCommand}>Error</Label>
          <StyledEditorBlock>
            <SubHeader>Your Rating: {mode.rating}. That's too low to create post</SubHeader>
          </StyledEditorBlock>
        </SubContainer>
    )
    );  
};

export default PostEditor;
