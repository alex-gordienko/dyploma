/* tslint:disable */
import React from "react";
import { Content, TabSelector, Tab, TabElement } from "./Label.styled";
import { LabelBlock } from "../../EditorComponents/EditorComponents.styled";
import { ButtonBlock } from "../../EditorComponents/EditorComponents.styled";
import { NavLink } from "react-router-dom";

interface ILabelProps {
  isAnotherUser:boolean;
  selectedCaption: number;
  onSelect: (mode: "public"|"private")=> void;
}

class Label extends React.PureComponent<ILabelProps> {
  constructor(props: Readonly<ILabelProps>) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
  }

  private onSelect(mode: "public"|"private"){
    this.props.onSelect(mode)
  }

  public render() {
    return this.props.isAnotherUser?(
      <LabelBlock>
          <TabElement>
            <input 
                checked={this.props.selectedCaption===1? true: false}
                onClick={()=>this.onSelect("public")} 
                type="radio" id="tab1"/>
            <label htmlFor="tab1">Public Posts</label>
          </TabElement>
      </LabelBlock>
    ):(
      <LabelBlock>
          <TabElement>
            <input 
                checked={this.props.selectedCaption===1? true: false}
                onClick={()=>this.onSelect("public")} 
                type="radio" id="tab1"/>
            <label htmlFor="tab1">Public Posts</label>
            <input 
                checked={this.props.selectedCaption===2? true: false}
                onClick={()=>this.onSelect("private")} 
                type="radio" id="tab2"/>
            <label htmlFor="tab2">Private Posts</label>
          </TabElement>
      </LabelBlock>
    )
  }
}

export default Label;
