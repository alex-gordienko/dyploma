/* tslint:disable */
import React, { useState, useCallback, useEffect } from "react";
import { isEqual } from "lodash";
import GoogleMapBlock from "../GoogleMapBlock";
import { StyledEditorBlock, PositionSelector } from "./PostEditor.styled";
import { SubHeader } from "../EditorComponents/EditorComponents.styled";
import SubContainer from "../Container/Container.Pages.styled";
import Label from "./Label";
import EditorItems from "./EditorElements";
import { IFullDataUser } from "../../../App.types";
import { nullPhoto, nullPost } from "../../../App.reducer";
import { Redirect } from "react-router-dom";
import Preloader from "../Preloader";
import { sendToSocket } from "../../../backend/httpGet";
import { formatDate } from "../utils/generateData";

interface IPostEditorProps {
  postId: number | "new";
  currentUser: IFullDataUser;
  socket: SocketIOClient.Socket;
  token: string;
  onError: (message: string) => void;
}

const PostEditor = ({
  postId,
  currentUser,
  socket,
  token,
  onError
}: IPostEditorProps) => {
  const [newPost, setNewPost] = useState<api.models.IPost | null>(nullPost);
  const [
    initialPostState,
    setInitialPostState
  ] = useState<api.models.IPost | null>(nullPost);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isReady, setIsReady] = useState(true);

  const getRedirect = () => {
    return <Redirect to="/" />;
  };

  socket.on(
    "Post Editor Response",
    (
      res: socket.ISocketResponse<
        api.models.IPost | string,
        api.models.IAvailablePostActions
      >
    ) => {
      socket.removeEventListener("Post Editor Response");
      if (res.data.requestFor === "get one post") {
        if (res.status === "OK") {
          setNewPost(res.data.response as api.models.IPost);
          setInitialPostState(res.data.response as api.models.IPost);
          setIsReady(true);
        }
      }
      if (res.data.requestFor === "create post") {
        if (res.status === "OK") {
          getRedirect();
          alert("Successful! Please, wait until your post will accept");
        } else {
          onError(res.data.response as string);
        }
      }
    }
  );

  const createPost = () => {
    sendToSocket<api.models.IPost, api.models.IAvailablePostActions>(socket, {
      data: {
        options: {
          ...newPost,
          date: formatDate(),
          idUser: currentUser.idUsers,
          username: currentUser.username
        },
        requestFor: "create post"
      },
      operation: "Post Editor Request",
      token: token
    });
  };

  const savePost = () => {
    if (isEqual(newPost, initialPostState)) {
      alert("There is nothing to change");
    } else {
      sendToSocket<api.models.IPost, api.models.IAvailablePostActions>(socket, {
        data: {
          options: {
            ...newPost,
            date: formatDate()
          },
          requestFor: "edit post"
        },
        operation: "Post Editor Request",
        token: token
      });
    }
  };

  useEffect(() => {
    if (postId !== "new") {
      setIsReady(false);
      sendToSocket<
        api.models.IGetPostToEditRequest,
        api.models.IAvailablePostActions
      >(socket, {
        data: {
          options: { postID: postId },
          requestFor: "get one post"
        },
        operation: "Post Editor Request",
        token
      });
    }
    return () => {
      socket.removeEventListener("Post Editor Response");
    };
  }, [postId]);

  useEffect(() => {
    newPost.description === "" ||
    newPost.Name === "" ||
    newPost.photoes === nullPhoto ||
    newPost.position.lat === 0 ||
    newPost.position.lng === 0
      ? setIsDisabled(true)
      : setIsDisabled(false);
  }, [newPost]);

  const handleLabelCommand = (number: "Save" | "Cancel") => {
    if (number === "Save") {
      if (postId === "new") {
        createPost();
      } else {
        savePost();
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
    const newPhoto: api.models.IPhotoBuffer[] = newPost.photoes
      .filter(photo => !nullPhoto.includes(photo))
      .concat({ name, blob: photoUrl });
    setNewPost({ ...newPost, photoes: newPhoto });
  };

  const clearPhotoBuf = () => {
    setNewPost({ ...newPost, photoes: nullPhoto });
  };

  const renderPostEditor = () => {
    const isUserHasAccessToPostEditor = currentUser.rating > 70;
    if (postId !== "new") {
      const isPostOwner = currentUser.idUsers === newPost.idUser;
      if (isUserHasAccessToPostEditor && isPostOwner) {
        return (
          <SubContainer>
            <Label disabled={isDisabled} labelCommand={handleLabelCommand}>
              Edit Post
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
        );
      }
      if (isPostOwner) {
        return (
          <SubContainer>
            <Label disabled={isDisabled} labelCommand={handleLabelCommand}>
              Error
            </Label>
            <StyledEditorBlock>
              <SubHeader>
                Your Rating: {currentUser.rating}. That's too low to create post
              </SubHeader>
            </StyledEditorBlock>
          </SubContainer>
        );
      }
      return (
        <SubContainer>
          <Label disabled={isDisabled} labelCommand={handleLabelCommand}>
            Error
          </Label>
          <StyledEditorBlock>
            <SubHeader>That's not your post, dude</SubHeader>
          </StyledEditorBlock>
        </SubContainer>
      );
    }
    if (postId === "new") {
      if (isUserHasAccessToPostEditor) {
        return (
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
        );
      }
      return (
        <SubContainer>
          <Label disabled={isDisabled} labelCommand={handleLabelCommand}>
            Error
          </Label>
          <StyledEditorBlock>
            <SubHeader>
              Your Rating: {currentUser.rating}. That's too low to create post
            </SubHeader>
          </StyledEditorBlock>
        </SubContainer>
      );
    }
  };

  return isReady ? (
    renderPostEditor()
  ) : (
    <Preloader message="Preloading Post Data" />
  );
};

export default PostEditor;
