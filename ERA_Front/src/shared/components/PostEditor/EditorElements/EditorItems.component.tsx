/* tslint:disable */
import React, { useState, useCallback, useEffect, RefObject } from "react";
import Jimp from "jimp";
import TextInputItem from "../../EditorComponents/EditorTextInput/EditorTextInput.component";
import EditorPhotoBlock from "../../EditorComponents/EditorPhotoBlock";
import { 
  StyledEditor, 
  EditorForm, 
  FirstBlockOfEditor, 
  SecondBlockOfEditor
} from "./EditorItems.styled";
import { FieldName, ButtonBlock } from  "../../EditorComponents/EditorComponents.styled"
import { IPhotoBuffer } from "../../../../App.types";
import { nullPhoto } from "../../../../App.reducer";

interface IEditorItemsState {
  isPrivate: boolean;
  dataURL: string;
}

interface IEditorItemsProps {
  photoesUrls: IPhotoBuffer[];
  pushUpUrl(name: string, blob: string): void;
  clearPhotoBuf(): void;
  onNameValueChanged(text: string): void;
  nameValue: string;
  onDescriptionValueChanged(text: string): void;
  descriptionValue:string;
  onIsPrivatePostChanged(isPrivate: boolean): void;
  isPrivatePost: boolean;
}

class EditorItems extends React.PureComponent<
  IEditorItemsProps,
  IEditorItemsState
> {
  private readonly inputOpenFileRef: RefObject<HTMLInputElement>;
  constructor(props: IEditorItemsProps) {
    super(props);

    this.state = {
      isPrivate: false,
      dataURL: ""
    };
    this.inputOpenFileRef = React.createRef();
    this.getUrlFromFile = this.getUrlFromFile.bind(this);
    this.clearPhotoBuf = this.clearPhotoBuf.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.isPrivate = this.isPrivate.bind(this);
  }
  componentWillReceiveProps() {
    this.forceUpdate();
  }

  public getUrlFromFile(files: FileList) {
    Array.from(files).map((file: File, indx:number)=>{
      var name = file.name;
      if (file.type.includes("image/")) {
        let reader = new FileReader();
        reader.onload = async()=>{
            if(reader.result && typeof reader.result ==="string"){
              console.log(name);
              Jimp.read(reader.result).then(async (image)=>{
                console.log("До сжатия : ", image.bitmap.data.length);
                if(image.bitmap.data.length > 3*1000*1000) {
                  console.log("Size before: "+image.getWidth()+"x"+image.getHeight());
                  image.quality(100).resize(/*.getWidth()*0.65*/ 1000, Jimp.AUTO);
                  console.log("Size after: "+image.getWidth()+"x"+image.getHeight());
                  console.log("После сжатия : ", image.bitmap.data.length);
                  const res = await image.getBase64Async(image.getMIME());
                  await this.props.pushUpUrl(file.name, res);
                }
                else{
                  const res = await image.getBase64Async(image.getMIME());
                  await this.props.pushUpUrl(file.name, res);
                }
              })
            }            
          };
        reader.readAsDataURL(file);
      } else {
        alert("Invalid type of file " + file.name);
      }
    })
  }

  public clearPhotoBuf(){
    this.props.clearPhotoBuf();
    this.forceUpdate();
  }

  public handleChange(e: any) {
    this.getUrlFromFile(e.target.files);
  }

  public isPrivate(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.checked ? true : false;
    this.setState({
      isPrivate: value
    });
    this.props.onIsPrivatePostChanged(value);
  }

  showOpenFileDlg = () => {
    if (this.inputOpenFileRef.current != null) {
      this.inputOpenFileRef.current.click();
    }
  };

  public render() {
    let { photoesUrls } = this.props;
    return (
      <StyledEditor>
        <EditorPhotoBlock photoesList={photoesUrls} />
        <EditorForm>
          <FirstBlockOfEditor>
            <div>
              <FieldName>Is Private?</FieldName>
              <input checked={this.props.isPrivatePost} type="checkbox" value="Private" onChange={this.isPrivate} />
            </div>
            <ButtonBlock>
              <FieldName>Select Photoes to continue</FieldName>
              <div className="label-button" onClick={this.showOpenFileDlg}>
                Load
              </div>
              <div className="label-button" 
                onClick={this.clearPhotoBuf}
              >
                Revert
              </div>
              <input
                type="file"
                ref={this.inputOpenFileRef}
                accept=".jpg, .jpeg"
                onChange={this.handleChange}
                style={{ display: "none" }}
                multiple
              />
            </ButtonBlock>
          </FirstBlockOfEditor>
          <SecondBlockOfEditor visibility={photoesUrls === nullPhoto? "hidden": "visible"}>
            <TextInputItem
              required={true}
              label="Name:"
              placeholder="Enter name"
              value={this.props.nameValue}
              onChange={this.props.onNameValueChanged}
              lenght="TextInput"
            />
            <TextInputItem
              required={true}
              label="Description:"
              placeholder="Enter description"
              value={this.props.descriptionValue}
              onChange={this.props.onDescriptionValueChanged}
              lenght="TextArea"
            />
          </SecondBlockOfEditor>
        </EditorForm>
      </StyledEditor>
    );
  }
}

export default EditorItems;
