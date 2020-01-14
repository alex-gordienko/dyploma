/* tslint:disable */
import React, { useState, useCallback, useEffect, RefObject } from "react";
import TextInputItem from "./EditorTextInput/EditorTextInput.component";
import EditorPhotoBlock from "./EditorPhotoBlock";
import { StyledEditor, EditorForm, FilesSelector } from "./EditorItems.styled";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FieldName, ButtonBlock } from "../CreatePost.styled";
import { IPhotoBuffer } from "../../../../App.types";
import { nullPhoto } from "../../../../App.reducer";

interface IEditorItemsState {
  isPrivate: boolean;
}

interface IEditorItemsProps {
  rating: number;
  photoesUrls: IPhotoBuffer[];
  pushUpUrl(name: string, photoUrl: string): void;
  nameValue(text: string): void;
  descriptionValue(text: string): void;
  isPrivatePost(isPrivate: boolean): void;
}

class EditorItems extends React.PureComponent<
  IEditorItemsProps,
  IEditorItemsState
> {
  private readonly inputOpenFileRef: RefObject<HTMLInputElement>;
  constructor(props: IEditorItemsProps) {
    super(props);

    this.state = {
      isPrivate: false
    };
    this.inputOpenFileRef = React.createRef();
    this.getUrlFromFile = this.getUrlFromFile.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.isPrivate = this.isPrivate.bind(this);
  }
  componentWillReceiveProps() {
    this.forceUpdate();
  }

  public getUrlFromFile(files: FileList) {
    var i = 0;
    while (i < files.length) {
      var name = files[i].name;
      if (files[i].type.includes("image/")) {
        let reader = new FileReader();
        reader.onload = () => {
          if (reader.result === null) {
            alert("Error reading file");
          } else if (typeof reader.result === "string") {
            this.props.pushUpUrl(name, reader.result);
          }
        };
        reader.readAsDataURL(files[i]);
        i++;
      } else {
        alert("Invalid type of file " + files[i].name);
        i++;
      }
    }
  }

  public handleChange(e: any) {
    this.getUrlFromFile(e.target.files);
  }

  public isPrivate(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.checked ? true : false;
    this.setState({
      isPrivate: value
    });
    this.props.isPrivatePost(value);
  }

  showOpenFileDlg = () => {
    if (this.inputOpenFileRef.current != null) {
      this.inputOpenFileRef.current.click();
    }
  };

  public render() {
    return (
      <StyledEditor>
        <EditorPhotoBlock photoesList={this.props.photoesUrls} />
        <EditorForm>
          <div>
            <FieldName>Is Private?</FieldName>
            <input type="checkbox" value="Private" onChange={this.isPrivate} />
          </div>
          <FilesSelector>
            <FieldName>Select Photoes to continue</FieldName>
            <div className="label-button" onClick={this.showOpenFileDlg}>
              Load
            </div>
            <div className="label-button">Revert</div>
            <input
              type="file"
              ref={this.inputOpenFileRef}
              accept=".jpg, .jpeg, .png"
              onChange={this.handleChange}
              style={{ display: "none" }}
              multiple
            />
          </FilesSelector>
          <div
            style={
              this.props.photoesUrls === nullPhoto
                ? { visibility: "hidden" }
                : { visibility: "visible" }
            }
          >
            <TextInputItem
              required={true}
              label="Name:"
              placeholder="Enter name"
              onChange={this.props.nameValue}
              lenght="TextInput"
            />
            <TextInputItem
              required={true}
              label="Description:"
              placeholder="Enter description"
              onChange={this.props.descriptionValue}
              lenght="TextArea"
            />
          </div>
        </EditorForm>
      </StyledEditor>
    );
  }
}

export default EditorItems;
